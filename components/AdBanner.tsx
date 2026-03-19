'use client'

import React from 'react'
import { Card, CardBody } from '@heroui/card'
import { Image } from '@heroui/image'
import { Link } from '@heroui/link'

export const AdBanner = () => {
  return (
    <Card className="w-full bg-content1 overflow-hidden shadow-xl border-none my-8 group cursor-pointer hover:scale-[1.01] transition-transform duration-300">
      <Link 
        href="https://hypekorepetycje.pl" 
        target="_blank"
        className="block w-full"
      >
        <div className="relative w-full aspect-[843/245] flex items-center justify-center overflow-hidden bg-white">
          <img 
            src="/ads/hype_ad.svg" 
            alt="HypeKorepetycje"
            className="w-full h-full object-contain"
          />
          {/* Subtle overlay for interaction */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
        </div>
      </Link>
    </Card>
  )
}
