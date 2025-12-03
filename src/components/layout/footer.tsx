'use client';

import Link from "next/link";
import { Logo } from "@/components/icons/logo";
import type { SocialLink, ContactDetail } from "@/lib/types";
import { getIcon } from "@/lib/icons";
import { useState, useEffect } from "react";

const footerNavLinks = [
  { href: "/#about", label: "About Us" },
  { href: "/#services", label: "Services" },
  { href: "/#sitters", label: "Our Sitters" },
  { href: "/#contact", label: "Contact Us" },
  { href: "/admin/login", label: "Admin" }
];

type FooterProps = {
  socialLinks: SocialLink[];
  contactDetails: ContactDetail[];
}

export function Footer({ socialLinks, contactDetails }: FooterProps) {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


  const emails = contactDetails.filter(d => d.type === 2);
  const phones = contactDetails.filter(d => d.type === 1);

  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4 xl:col-span-1">
             <Link href="/" className="inline-block">
                <Logo />
            </Link>
            <p className="text-muted-foreground text-base">
              Sunshine Giggles and Hugs.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((link) => {
                const Icon = getIcon(link.icon_name);
                return (
                  <a key={link.id} href={link.url || '#'} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <span className="sr-only">{link.platform}</span>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Navigation</h3>
                <ul className="mt-4 space-y-4">
                  {footerNavLinks.map(({ href, label }) => (
                    <li key={label}>
                      <Link href={href} className="text-base text-muted-foreground hover:text-primary">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Contact</h3>
                <ul className="mt-4 space-y-4">
                    {emails.map(email => (
                      <li key={email.id}>
                        <a href={`mailto:${email.value}`} className="text-base text-muted-foreground hover:text-primary">
                          {email.value}
                        </a>
                      </li>
                    ))}
                    {phones.map(phone => (
                      <li key={phone.id}>
                        <p className="text-base text-muted-foreground">{phone.value}</p>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-base text-muted-foreground xl:text-center">
            &copy; {currentYear ?? new Date().getFullYear()} GiggleHugs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
