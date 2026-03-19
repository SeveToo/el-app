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
    <div className="w-full flex justify-center px-4 font-sans">
      <Card className="w-full max-w-xl bg-default-100/50 dark:bg-default-50/10 backdrop-blur-md overflow-hidden shadow-sm border-2 border-transparent hover:border-primary hover:shadow-xl transition-all duration-300 group cursor-pointer active:scale-95 my-8">
        <Link 
          href="https://hypekorepetycje.pl" 
          target="_blank"
          className="block w-full"
        >
          <div className="relative w-full aspect-[843/245] flex items-center justify-center overflow-hidden">
            <img 
              src={getPath('/ads/hype_ad.svg')} 
              alt="HypeKorepetycje"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getPath('/ads/ad.webp');
              }}
            />
          </div>
        </Link>
      </Card>
    </div>
  )
}
