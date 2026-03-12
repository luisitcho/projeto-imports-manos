"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Crown, Search } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/produtos?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
            <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
                <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80 shrink-0">
                    <Crown className="h-6 w-6 text-white" />
                    <span className="font-semibold hidden sm:inline-block text-lg tracking-tight text-white gap-2">
                        Imports_<span className="text-zinc-500 font-medium">manos</span>
                    </span>
                </Link>

                <div className="flex-1 max-w-sm mx-4 sm:mx-8">
                    <form onSubmit={handleSearch} className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar tênis, marcas..."
                            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full leading-5 bg-zinc-900/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:bg-zinc-900 focus:border-white focus:ring-1 focus:ring-white transition-all sm:text-sm"
                        />
                    </form>
                </div>

                <div className="flex items-center justify-end shrink-0">
                    <nav className="flex items-center space-x-4">
                        <Link
                            href="/produtos"
                            className={`text-sm font-bold tracking-wide transition-colors ${pathname.startsWith('/produtos')
                                ? 'text-white'
                                : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            VER TUDO
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
