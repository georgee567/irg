
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const logoCandidates = [
  "/images/logo.png",
  "/images/irg-logo-png%20(2).png",
];

interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className = "" }: BrandLogoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    return (
      <Link
        href="/"
        aria-label="IRG Home"
        className={
          "shrink-0 font-serif text-4xl font-medium tracking-[0.02em] text-[#D4AF37] sm:text-5xl " +
          className
        }
      >
        IRG
      </Link>
    );
  }

  const src = logoCandidates[currentIndex];

  return (
    <Link href="/" aria-label="IRG Home" className={"shrink-0 " + className}>
      <Image
        src={src}
        alt="IRG"
        width={170}
        height={50}
        priority
        className="h-[30px] w-[115px] object-fill sm:h-[35px] sm:w-[125px]"
        onError={() => {
          if (currentIndex < logoCandidates.length - 1) {
            setCurrentIndex((previous) => previous + 1);
            return;
          }

          setImageFailed(true);
        }}
      />
    </Link>
  );
}

