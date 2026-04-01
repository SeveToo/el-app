import React from "react";
import { Link } from "@heroui/link";
import Image from "next/image";

export const AdBanner = () => {
  return (
    <div className="w-full flex justify-center px-0 font-sans my-0">
      <div className="w-full max-w-xl aspect-[843/245] overflow-hidden group cursor-pointer active:scale-95 transition-all duration-300">
        <Link
          className="block w-full h-full"
          href="https://hypekorepetycje.pl"
          target="_blank"
        >
          <Image
            priority
            alt="HypeKorepetycje"
            className="w-full h-full object-contain"
            height={245}
            src="/ads/ad.webp"
            width={843}
          />
        </Link>
      </div>
    </div>
  );
};
