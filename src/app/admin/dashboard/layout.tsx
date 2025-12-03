import Link from 'next/link';
import {
  Bell,
  Home,
  Users,
  Star,
  Phone,
  Link2,
  List,
  LogOut,
  Settings,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Logo } from '@/components/icons/logo';
import { MobileNav } from './_components/mobile-nav';
import { NavItem } from './_components/nav-item';
import type { NavItemProps } from './_components/nav-item';

const navItems: NavItemProps[] = [
    { href: '/admin/dashboard', iconName: 'home', label: 'Dashboard' },
    { href: '/admin/dashboard/services', iconName: 'list', label: 'Services' },
    { href: '/admin/dashboard/sitters', iconName: 'users', label: 'Sitters' },
    { href: '/admin/dashboard/testimonials', iconName: 'star', label: 'Testimonials' },
    { href: '/admin/dashboard/faqs', iconName: 'help-circle', label: 'FAQs'},
    { href: '/admin/dashboard/contact', iconName: 'phone', label: 'Contact Details' },
    { href: '/admin/dashboard/social', iconName: 'link2', label: 'Social Links' },
    { href: '/admin/dashboard/settings', iconName: 'settings', label: 'Settings'},
    { href: '/admin/dashboard/guide', iconName: 'book-open', label: 'Guide'},
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const handleLogout = async () => {
    'use server';
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/admin/login');
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map(item => <NavItem key={item.href} {...item} />)}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <MobileNav navItems={navItems} />
          <div className="w-full flex-1">
            {/* Add search if needed */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/admin/dashboard/settings">
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/admin/dashboard/guide">
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Guide</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
               <form action={handleLogout}>
                <button type="submit" className="w-full">
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
