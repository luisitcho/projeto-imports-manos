"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";
import { PackageOpen } from "lucide-react";

export default function ProductList() {
    const [mounted, setMounted] = useState(false);
    const products = useProductStore((state) => state.products);

    // Prevent hydration errors
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex justify-center items-center h-64 text-zinc-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center text-zinc-400">
                <PackageOpen className="w-16 h-16 text-zinc-600 mb-6 drop-shadow-lg" />
                <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">Nenhum produto cadastrado</h2>
                <p className="max-w-md text-sm leading-relaxed">
                    Acesse o painel administrador para adicionar novos itens ao catálogo. Os produtos aparecerão aqui com um visual incrível.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 py-8 max-w-7xl mx-auto">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 hover:bg-zinc-800/80"
                >
                    {/* Image Container with Glow Effect */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-transparent z-10" />
                        <img
                            src={product.foto}
                            alt={product.nome}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Overlay Gradient for contrast */}
                    </div>

                    <div className="flex flex-col flex-1 p-5 relative z-20 -mt-10">
                        <h3 className="text-xl font-bold text-white tracking-tight line-clamp-2 mb-1 drop-shadow-md">
                            {product.nome}
                        </h3>

                        <div className="mt-auto pt-4 flex items-end justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Preço</span>
                                <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                                    R$ {product.preco.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Valor Ref</span>
                                <span className="text-lg font-medium text-zinc-400 line-through">
                                    R$ {product.valor.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-purple-500/30 transition-all pointer-events-none" />
                </div>
            ))}
        </div>
    );
}
