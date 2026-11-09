"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import type { SocialLink } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/icons/logo";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

const mainNavLinks = [
  { href: "/#about", label: "About Us" },
  { href: "/#services", label: "Services" },
  { href: "/#sitters", label: "Our Sitters" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#faq", label: "FAQs" },
  { href: "/#contact", label: "Contact" },
];

type HeaderProps = {
  socialLinks?: SocialLink[];
}

export function Header({ socialLinks = [] }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [whatsAppLink, setWhatsAppLink] = useState<string | undefined>();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setWhatsAppLink(socialLinks.find(link => link.platform === 'whatsapp')?.url ?? undefined);
  }, [socialLinks]);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 p-4">
      <Card className={cn(
          "w-full max-w-7xl mx-auto rounded-full transition-all duration-300",
           isScrolled ? 'bg-background/80 backdrop-blur-md shadow-lg border-border/40' : 'bg-transparent border-transparent'
        )}>
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          
          <nav className="hidden md:flex items-center gap-1 bg-background/50 border border-border/50 rounded-full px-2 py-1 shadow-sm">
            {mainNavLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "transition-colors hover:text-primary px-4 py-2 rounded-full text-sm font-medium",
                    isActive ? "bg-primary text-primary-foreground" : ""
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {whatsAppLink && (
              <Button asChild className="hidden sm:inline-flex rounded-full">
                <a href={whatsAppLink} target="_blank" rel="noopener noreferrer">Book Now</a>
              </Button>
            )}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden rounded-full">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs pr-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <SheetHeader className="mb-8">
                   <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <Logo />
                  </Link>
                </SheetHeader>
                <nav className="flex flex-col gap-4">
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
                    <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>Book Now</a>
                  </Button>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Card>
    </header>
  );
}