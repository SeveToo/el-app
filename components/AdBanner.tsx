'use client'

import React from 'react'
import { Card, CardBody } from '@heroui/card'
import { Image } from '@heroui/image'
import { Link } from '@heroui/link'

export const AdBanner = () => {
  return (
    <div className="w-full flex justify-center px-4">
      <Card className="w-full max-w-xl bg-content1 overflow-hidden shadow-2xl border-none my-8 group cursor-pointer hover:scale-[1.02] transition-all duration-500">
        <Link 
          href="https://hypekorepetycje.pl" 
          target="_blank"
          className="block w-full"
        >
          <div className="relative w-full aspect-[843/245] flex items-center justify-center overflow-hidden bg-white">
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes hueRotate {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
              }
              .animate-banner-hue {
                animation: hueRotate 12s infinite linear;
              }
            `}} />
            <img 
              src="/ads/hype_ad.svg" 
              alt="HypeKorepetycje"
              className="w-full h-full object-contain animate-banner-hue"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/ads/ad.webp';
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          </div>
        </Link>
      </Card>
    </div>
  )
}
