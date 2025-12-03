'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getIcon } from '@/lib/icons';

export type NavItemProps = {
    href: string;
    iconName: string;
    label: string;
};

export function NavItem({ href, iconName, label }: NavItemProps) {
    const pathname = usePathname();
    const isActive = pathname === href;
    const Icon = getIcon(iconName);

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
            )}
        >
            <Icon className="h-4 w-4" />
            {label}
        </Link>
    );
}
