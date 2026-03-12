"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Crown } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
            <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
                <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80 shrink-0">
                    <Crown className="h-6 w-6 text-white" />
                    <span className="font-semibold hidden sm:inline-block text-lg tracking-tight text-white gap-2">
                        Imports_<span className="text-zinc-500 font-medium">manos</span>
                    </span>
                </Link>

                <div className="flex items-center justify-end shrink-0">
                    <nav className="flex items-center space-x-4">
                        <Link
                            href="/produtos"
                            className={`text-sm font-bold tracking-wide transition-colors ${pathname.startsWith('/produtos')
                                ? 'text-white'
                                : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            CATÁLOGO
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
