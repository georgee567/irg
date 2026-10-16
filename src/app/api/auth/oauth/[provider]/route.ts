import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createSession, SESSION_COOKIE } from "@/lib/session";

const STATE_COOKIE = "irg_oauth_state";
const STATE_MAX_AGE = 10 * 60;

type Provider = "google" | "facebook";

type ProviderProfile = {
  email: string;
  name: string;
};

function getProvider(value: string): Provider | null {
  return value === "google" || value === "facebook" ? value : null;
}

function getBaseUrl(request: Request) {
  return process.env.AUTH_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
}

function getProviderConfig(provider: Provider, callbackUrl: string) {
  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) throw new Error("Google OAuth is not configured.");
    return {
      authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      profileUrl: "https://openidconnect.googleapis.com/v1/userinfo",
      clientId,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: "openid email profile",
      callbackUrl,
    };
  }

  const clientId = process.env.FACEBOOK_CLIENT_ID;
  if (!clientId) throw new Error("Facebook OAuth is not configured.");
  return {
    authorizationUrl: "https://www.facebook.com/v26.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v26.0/oauth/access_token",
    profileUrl: "https://graph.facebook.com/v26.0/me?fields=id,name,email",
    clientId,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    scope: "email,public_profile",
    callbackUrl,
  };
}

function redirectToLogin(request: Request, error?: string) {
  const url = new URL("/login", getBaseUrl(request));
  if (error) url.searchParams.set("oauthError", error);
  return NextResponse.redirect(url);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ provider: string }> }
) {
  const provider = getProvider((await context.params).provider);
  if (!provider) return redirectToLogin(request, "Unsupported OAuth provider.");

  const requestUrl = new URL(request.url);
  const callbackUrl = `${getBaseUrl(request)}/api/auth/oauth/${provider}`;
  const code = requestUrl.searchParams.get("code");
  const returnedState = requestUrl.searchParams.get("state");
  const cookieStore = await cookies();

  try {
    const config = getProviderConfig(provider, callbackUrl);

    if (!code) {
      const state = crypto.randomBytes(32).toString("hex");
      const authorizationUrl = new URL(config.authorizationUrl);
      authorizationUrl.searchParams.set("client_id", config.clientId);
      authorizationUrl.searchParams.set("redirect_uri", config.callbackUrl);
      authorizationUrl.searchParams.set("response_type", "code");
      authorizationUrl.searchParams.set("scope", config.scope);
      authorizationUrl.searchParams.set("state", state);

      const response = NextResponse.redirect(authorizationUrl);
      response.cookies.set({
        name: STATE_COOKIE,
        value: `${provider}:${state}`,
        httpOnly: true,
        sameSite: "lax",
        secure: config.callbackUrl.startsWith("https://"),
        maxAge: STATE_MAX_AGE,
        path: "/api/auth/oauth",
      });
      return response;
    }

    const storedState = cookieStore.get(STATE_COOKIE)?.value || "";
    const expectedState = `${provider}:${returnedState || ""}`;
    if (!returnedState || storedState !== expectedState) {
      return redirectToLogin(request, "OAuth state validation failed.");
    }
    cookieStore.delete(STATE_COOKIE);

    if (!config.clientSecret) {
      throw new Error(`${provider} OAuth client secret is not configured.`);
    }

    const tokenRequest = new URL(config.tokenUrl);
    tokenRequest.search = new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.callbackUrl,
      grant_type: "authorization_code",
    }).toString();
    const tokenResponse = await fetch(tokenRequest, {
      method: provider === "facebook" ? "GET" : "POST",
      headers: provider === "facebook" ? undefined : { "Content-Type": "application/x-www-form-urlencoded" },
      body: provider === "facebook" ? undefined : new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.callbackUrl,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenResponse.ok) throw new Error("OAuth token exchange failed.");
    const tokenData = (await tokenResponse.json()) as { access_token?: string };
    if (!tokenData.access_token) throw new Error("OAuth provider returned no access token.");

    const profileResponse = await fetch(config.profileUrl, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!profileResponse.ok) throw new Error("OAuth profile request failed.");
    const profile = (await profileResponse.json()) as { email?: string; name?: string };
    const providerProfile: ProviderProfile = {
      email: profile.email?.trim().toLowerCase() || "",
      name: profile.name?.trim() || "IRG Customer",
    };
    if (!providerProfile.email) throw new Error("OAuth provider did not return an email address.");

    let user = await prisma.user.findUnique({ where: { email: providerProfile.email } });
    if (!user) {
      const password = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12);
      user = await prisma.user.create({
        data: {
          name: providerProfile.name,
          email: providerProfile.email,
          password,
        },
      });
    }

    const session = await createSession(user.id);
    const destination = user.role === "ADMIN" ? "/admin" : "/account";
    const response = NextResponse.redirect(new URL(destination, getBaseUrl(request)));
    response.cookies.set({
      name: SESSION_COOKIE,
      value: session.token,
      httpOnly: true,
      secure: callbackUrl.startsWith("https://"),
      sameSite: "lax",
      path: "/",
      expires: session.expiresAt,
    });
    return response;
  } catch (error) {
    console.error(`${provider} OAuth error:`, error);
    return redirectToLogin(request, error instanceof Error ? error.message : "OAuth sign-in failed.");
  }
}
