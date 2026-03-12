"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";
import { PackageOpen, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../types";

export default function ProductList() {
    const [mounted, setMounted] = useState(false);
    const products = useProductStore((state) => state.products);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Prevent hydration errors
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedProduct(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    if (!mounted) {
        return (
            <div className="flex justify-center items-center h-64 text-zinc-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 px-4 text-center text-zinc-400"
            >
                <PackageOpen className="w-16 h-16 text-zinc-600 mb-6 drop-shadow-lg" />
                <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">Sem produtos no momento</h2>
                <p className="max-w-md text-sm leading-relaxed">
                    Nenhum item à venda.
                </p>
            </motion.div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 py-8 max-w-7xl mx-auto">
                <AnimatePresence>
                    {products.map((product) => (
                        <motion.div
                            layoutId={`card-${product.id}`}
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            role="button"
                            tabIndex={0}
                            aria-label={`Ver detalhes de ${product.nome}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setSelectedProduct(product);
                                }
                            }}
                            className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-md shadow-lg transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent z-10" />
                                <motion.img
                                    layoutId={`image-${product.id}`}
                                    src={product.foto}
                                    alt={product.nome}
                                    className="absolute inset-0 h-full w-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                                />
                            </div>

                            <div className="flex flex-col flex-1 p-5 relative z-20 -mt-10">
                                <motion.h3 layoutId={`title-${product.id}`} className="text-xl font-medium text-white tracking-tight line-clamp-2 mb-1 drop-shadow-md">
                                    {product.nome}
                                </motion.h3>

                                <div className="mt-auto pt-4 flex items-end justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Preço</span>
                                        <motion.span layoutId={`price-${product.id}`} className="text-2xl font-bold text-white tracking-tight">
                                            R$ {product.preco.toFixed(2)}
                                        </motion.span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">Valor Ref</span>
                                        <span className="text-sm font-medium text-zinc-500 line-through">
                                            R$ {product.valor.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal Detail */}
            <AnimatePresence>
                {selectedProduct && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                        />
                        {/* Modal Content */}
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                            <motion.div
                                layoutId={`card-${selectedProduct.id}`}
                                className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row pointer-events-auto relative"
                            >
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="absolute top-4 right-4 z-50 p-2 text-zinc-400 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors backdrop-blur-md"
                                    aria-label="Fechar"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="w-full md:w-1/2 relative bg-black aspect-square md:aspect-auto">
                                    <motion.img
                                        layoutId={`image-${selectedProduct.id}`}
                                        src={selectedProduct.foto}
                                        alt={selectedProduct.nome}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-8 w-full md:w-1/2 flex flex-col justify-center">
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-2"
                                    >
                                        Detalhes do Produto
                                    </motion.span>

                                    <motion.h3
                                        layoutId={`title-${selectedProduct.id}`}
                                        className="text-3xl font-bold text-white tracking-tight mb-6"
                                    >
                                        {selectedProduct.nome}
                                    </motion.h3>

                                    <div className="flex flex-col space-y-2 mb-8 border-t border-zinc-800 pt-6">
                                        <div className="flex justify-between items-center text-zinc-400 text-sm">
                                            <span>Valor Referência</span>
                                            <span className="line-through">R$ {selectedProduct.valor.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-zinc-400 text-sm">Nosso Preço</span>
                                            <motion.span
                                                layoutId={`price-${selectedProduct.id}`}
                                                className="text-3xl font-black text-white"
                                            >
                                                R$ {selectedProduct.preco.toFixed(2)}
                                            </motion.span>
                                        </div>
                                    </div>

                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        onClick={() => {
                                            alert("Integração com Carrinho / Checkout aqui!");
                                        }}
                                        className="w-full bg-white hover:bg-zinc-200 text-black py-4 rounded-xl font-bold transition-transform active:scale-95"
                                    >
                                        Comprar Agora
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
