import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/icons/logo';
import { NavItem, type NavItemProps } from './nav-item';

type MobileNavProps = {
    navItems: NavItemProps[]
}

export function MobileNav({ navItems }: MobileNavProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetHeader>
                <SheetTitle className="sr-only">Dashboard Menu</SheetTitle>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Logo />
                </Link>
              </SheetHeader>
              <nav className="grid gap-2 text-lg font-medium">
                {navItems.map(item => <NavItem key={item.href} {...item} />)}
              </nav>
            </SheetContent>
        </Sheet>
    )
}
