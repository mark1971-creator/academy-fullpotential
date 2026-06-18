export const SITE_NAV_ITEMS = [
  { href: "/", label: "Home", match: (path: string) => path === "/" },
  {
    href: "/courses",
    label: "Browse Courses",
    match: (path: string) => path.startsWith("/courses"),
  },
  {
    href: "/my-courses",
    label: "My Learning",
    match: (path: string) => path.startsWith("/my-courses"),
  },
] as const;
