"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import type { SocialLink } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/icons/logo";
import { ThemeToggle } from "./theme-toggle";

const mainNavLinks = [
  { href: "/#about", label: "About Us" },
  { href: "/#services", label: "Services" },
  { href: "/#sitters", label: "Our Sitters" },
  { href: "/#contact", label: "Contact" },
];

type HeaderProps = {
  socialLinks?: SocialLink[];
}

export function Header({ socialLinks = [] }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const whatsAppLink = socialLinks.find(link => link.platform === 'whatsapp')?.url;

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <Card className="flex h-20 items-center justify-between p-4 bg-background/80 backdrop-blur-md shadow-lg border-border/40">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {mainNavLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {whatsAppLink && (
              <Button asChild className="hidden sm:inline-flex">
                <a href={whatsAppLink} target="_blank" rel="noopener noreferrer">Book Now</a>
              </Button>
            )}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs pr-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <SheetHeader>
                   <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <Logo />
                  </Link>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {mainNavLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
                {whatsAppLink && (
                  <Button asChild className="mt-8 w-full">
                    <a href={whatsAppLink} target="_blank" rel="noopener noreferrer">Book Now</a>
                  </Button>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </Card>
      </div>
    </header>
  );
}
