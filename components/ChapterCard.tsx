'use client'

import * as React from 'react'
import NextLink from 'next/link'
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card'
import { Progress } from '@heroui/progress'
import { Button } from '@heroui/button'

type Props = {
  title: string
  subtitle?: string
  progress?: number
  href?: string
}

const ChapterCard: React.FC<Props> = ({
  title,
  subtitle,
  progress = 0,
  href,
}) => {
  return (
    <Card className="p-3 w-full">
      <CardHeader className="pb-1">
        <h3 className="text-base font-bold leading-tight">{title}</h3>
      </CardHeader>
      <CardBody className="py-2 gap-2">
        {subtitle && (
          <p className="text-default-500 text-xs">{subtitle}</p>
        )}
        <Progress
          value={Math.max(0, Math.min(100, progress))}
          size="sm"
          aria-label="postep"
        />
        <div className="text-xs text-default-400">
          Postęp: {progress}%
        </div>
      </CardBody>
      <CardFooter className="pt-2">
        {href ? (
          <NextLink href={href} className="w-full">
            <Button
              variant="ghost"
              size="sm"
              className="w-full font-semibold"
            >
              Otwórz
            </Button>
          </NextLink>
        ) : (
          <Button variant="ghost" size="sm" className="w-full font-semibold">
            Otwórz
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default ChapterCard
