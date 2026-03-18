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
    <Card className="p-4">
      <CardHeader>
        <h3 className="text-lg font-semibold">{title}</h3>
      </CardHeader>
      <CardBody>
        <p className="text-default-600 text-sm mb-4">
          {subtitle || 'placeholder'}
        </p>
        <div className="mb-2">
          <Progress value={Math.max(0, Math.min(100, progress))} />
        </div>
        <div className="text-xs text-default-500">
          Postęp: {progress}%
        </div>
      </CardBody>
      <CardFooter className="pt-3">
        {href ? (
          <NextLink href={href}>
            <Button variant="ghost" size="sm">
              Otwórz
            </Button>
          </NextLink>
        ) : (
          <Button variant="ghost" size="sm">
            Otwórz
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default ChapterCard
