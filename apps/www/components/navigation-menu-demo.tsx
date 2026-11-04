"use client";

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/registry/akso/ui/navigation-menu";

/** Demo used by the docs page and by the e2e tests. */
export function NavigationMenuDemo() {
  return (
    <NavigationMenu aria-label="Store">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#phones">Phones</NavigationMenuLink>
            <NavigationMenuLink href="#laptops">Laptops</NavigationMenuLink>
            <NavigationMenuLink href="#accessories">Accessories</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Support</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#contact">Contact us</NavigationMenuLink>
            <NavigationMenuLink href="#returns">Returns</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#offers" active>
            Offers
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
