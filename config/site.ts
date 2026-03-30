export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "EL APP",
  description: "Aplikacja do nauki języka angielskiego i matematyki.",
  navItems: [
    {
      label: "Angielski",
      href: "/?subject=english",
    },
    {
      label: "Matematyka",
      href: "/?subject=math",
    },
  ],
  navMenuItems: [
    {
      label: "Angielski",
      href: "/?subject=english",
    },
    {
      label: "Matematyka",
      href: "/?subject=math",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
