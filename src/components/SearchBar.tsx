"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBar() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/produtos?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative group w-full max-w-md mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-white transition-colors" />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar produtos, marcas, modelos..."
                className="block w-full pl-12 pr-4 py-3 border border-white/10 rounded-full leading-5 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:bg-zinc-900 focus:border-white focus:ring-1 focus:ring-white transition-all sm:text-base shadow-lg"
            />
        </form>
    );
}
