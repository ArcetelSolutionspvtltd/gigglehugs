import Link from "next/link";
import { Heart, Sun, Smile, Twitter, Facebook, Instagram } from "lucide-react";
import { Logo } from "@/components/icons/logo";

const footerLinks = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/sitters", label: "Our Sitters" },
  { href: "/contact", label: "Contact Us" },
  { href: "/admin/generate-bio", label: "Admin Tool"}
];

const socialLinks = [
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Instagram, label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="bg-secondary/50">
      <div className="container max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4 xl:col-span-1">
             <Link href="/" className="flex items-center gap-2">
                <Smile className="h-10 w-10 text-primary" />
                <span className="font-bold text-2xl">GiggleHugs</span>
            </Link>
            <p className="text-muted-foreground text-base">
              Bringing sunshine, giggles, and safe hugs to your family.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <Link key={label} href={href} className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">{label}</span>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Navigation</h3>
                <ul className="mt-4 space-y-4">
                  {footerLinks.map(({ href, label }) => (
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
                    <li>
                        <p className="text-base text-muted-foreground">contact@gigglehugs.com</p>
                    </li>
                    <li>
                        <p className="text-base text-muted-foreground">(123) 456-7890</p>
                    </li>
                    <li>
                        <p className="text-base text-muted-foreground">123 Sunshine Lane, Happyville</p>
                    </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-base text-muted-foreground xl:text-center">
            &copy; {new Date().getFullYear()} GiggleHugs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
