'use client'

import React from 'react'
import { Card, CardBody } from '@heroui/card'
import { Image } from '@heroui/image'
import { Link } from '@heroui/link'

export const AdBanner = () => {
  // Dynamiczna ścieżka dla GitHub Pages vs Localhost
  const getPath = (p: string) => {
    const isGH = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
    return isGH ? `/el-app${p}` : p;
  };

  return (
    <div className="w-full flex justify-center px-0 font-sans my-0">
      <div className="w-full max-w-xl aspect-[843/245] overflow-hidden group cursor-pointer active:scale-95 transition-all duration-300">
        <Link 
          href="https://hypekorepetycje.pl" 
          target="_blank"
          className="block w-full h-full"
        >
          <img 
            src={getPath('/ads/ad.webp')} 
            alt="HypeKorepetycje"
            className="w-full h-full object-contain"
          />
        </Link>
      </div>
    </div>
  )
}
