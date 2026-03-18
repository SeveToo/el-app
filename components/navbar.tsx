'use client'

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from '@heroui/navbar'
import { Tabs, Tab } from '@heroui/tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import NextLink from 'next/link'

import { ThemeSwitch } from '@/components/theme-switch'
import { Logo } from '@/components/icons'

export const Navbar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subject = searchParams.get('subject') || 'english'

  const handleSelectionChange = (key: React.Key) => {
    router.push(`/?subject=${key}`)
  }

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent
        className="basis-1/5 sm:basis-full"
        justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            className="flex justify-start items-center gap-1"
            href="/">
            <Logo />
            <p className="font-bold text-inherit">EL APP</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="center">
        <NavbarItem>
          <Tabs
            aria-label="Wybierz przedmiot"
            color="primary"
            radius="full"
            selectedKey={subject}
            onSelectionChange={handleSelectionChange}>
            <Tab key="english" title="Angielski" />
            <Tab key="math" title="Matematyka" />
          </Tabs>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        className="basis-1/5 sm:basis-full"
        justify="end">
        <NavbarItem className="flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  )
}

