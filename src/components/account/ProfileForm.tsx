"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileForm() {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    county: user?.county || "",
    city: user?.city || "",
    address: user?.address || "",
  });

  function save() {
    updateProfile(form);

    alert("Profile updated successfully.");
  }

  return (
    <div className="rounded-3xl border border-[#222] bg-[#090909] p-8">

      <h2 className="font-serif text-3xl">
        My Profile
      </h2>

      <div className="mt-8 space-y-5">

        <input
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          placeholder="Full Name"
          className="w-full rounded-xl border border-[#222] bg-black p-4"
        />

        <input
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          placeholder="Email"
          className="w-full rounded-xl border border-[#222] bg-black p-4"
        />

        <input
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
          placeholder="Phone"
          className="w-full rounded-xl border border-[#222] bg-black p-4"
        />

        <input
          value={form.county}
          onChange={(e) =>
            setForm({
              ...form,
              county: e.target.value,
            })
          }
          placeholder="County"
          className="w-full rounded-xl border border-[#222] bg-black p-4"
        />

        <input
          value={form.city}
          onChange={(e) =>
            setForm({
              ...form,
              city: e.target.value,
            })
          }
          placeholder="Town / City"
          className="w-full rounded-xl border border-[#222] bg-black p-4"
        />

        <textarea
          rows={4}
          value={form.address}
          onChange={(e) =>
            setForm({
              ...form,
              address: e.target.value,
            })
          }
          placeholder="Address"
          className="w-full rounded-xl border border-[#222] bg-black p-4"
        />

        <button
          onClick={save}
          className="w-full rounded-xl bg-[#D4AF37] py-4 font-semibold text-black"
        >
          Save Profile
        </button>

      </div>

    </div>
  );
}