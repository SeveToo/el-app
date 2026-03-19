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
import { AppLogo } from '@/components/AppLogo'

const NavbarContentWrapper = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subject = searchParams.get('subject') || 'english'

  const handleSelectionChange = (key: React.Key) => {
    router.push(`/?subject=${key}`)
  }

  return (
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
  )
}

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent
        className="basis-1/5 sm:basis-full"
        justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            className="flex justify-start items-center gap-1"
            href="/">
            <AppLogo />
            <p  className="pl-2 font-bold text-inherit"> APP</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <React.Suspense fallback={<div className="hidden sm:flex w-40" />}>
        <NavbarContentWrapper />
      </React.Suspense>

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

