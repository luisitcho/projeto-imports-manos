"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
            <div className="container flex h-16 items-center mx-auto px-4 md:px-8">
                <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
                    <Store className="h-5 w-5 text-white" />
                    <span className="font-semibold sm:inline-block text-lg tracking-tight text-white">
                        Imports_manos
                    </span>
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className={`text-sm font-medium transition-colors ${pathname === '/'
                                ? 'text-white'
                                : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            Produtos
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
