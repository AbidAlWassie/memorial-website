// src/components/interface/NavbarWrapper.tsx
import { Navbar } from "@/components/";
import { images } from "@/data";

export default function NavbarWrapper({ session }: { session: any }) {
  // Define user menu items based on whether the session contains user data
  const userMenuItems = session?.user
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings", href: "/settings" },
        { label: "Sign out", href: "/api/auth/signout" },
      ]
    : [{ label: "Sign in", href: "/api/auth/signin" }];

  // Define user info, fallback to default values if no session
  const userInfo = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        avatarSrc: session.user.image,
      }
    : null; // Return `null` when no user session exists

  return (
    <Navbar
      brand={{
        name: "BD Heros",
        logoSrc: images.logo,
        logoAlt: "Logo",
        href: "/",
      }}
      navItems={[
        { label: "Home", href: "/" },
        { label: "Protesters", href: "/protesters" },
        { label: "Contribute", href: "/contribute" },
        { label: "Person", href: "/person" },
      ]}
      userMenuItems={userMenuItems}
      showSearchBar={true}
      userInfo={userInfo}
    />
  );
}
