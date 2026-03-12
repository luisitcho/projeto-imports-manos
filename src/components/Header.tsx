"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, UserCog } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center mx-auto px-4 md:px-8">
                <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
                    <Store className="h-6 w-6 text-purple-500" />
                    <span className="font-bold sm:inline-block text-xl tracking-tight text-white drop-shadow-md">
                        Imports_manos
                    </span>
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        <Link
                            href="/"
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/'
                                    ? 'bg-white/10 text-white'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Produtos
                        </Link>
                        <Link
                            href="/admin"
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${pathname.startsWith('/admin')
                                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <UserCog className="w-4 h-4" />
                            Painel Admin
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
