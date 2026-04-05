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
        <NavbarItem className="flex items-center gap-2 sm:gap-3">
          <a
            className="relative px-1 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest text-foreground transition-all duration-300 group"
            href="https://hypekorepetycje.pl"
            rel="noopener noreferrer"
            target="_blank"
          >
            Korepetycje
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
