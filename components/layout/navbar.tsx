"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import * as React from "react";
import NextLink from "next/link";

import { ThemeSwitch } from "./theme-switch";
import { AppLogo } from "./AppLogo";

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <AppLogo />
            <p className="pl-2 font-bold text-inherit"> APP</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="flex items-center gap-3">
          <a
            className="text-xs sm:text-sm font-semibold text-indigo-500 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap"
            href="https://hypekorepetycje.pl"
            rel="noopener noreferrer"
            target="_blank"
          >
            Korepetycje
          </a>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
