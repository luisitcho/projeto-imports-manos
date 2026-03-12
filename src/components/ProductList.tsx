"use client";

import { useEffect, useState, useMemo } from "react";
import { useProductStore } from "../store/useProductStore";
import { PackageOpen, X, ChevronLeft, ChevronRight, ArrowRight, Frown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../types";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const ITEMS_PER_PAGE = 8;

interface ProductListProps {
    isCatalog?: boolean;
    limit?: number;
}

export default function ProductList({ isCatalog = false, limit }: ProductListProps) {
    const [mounted, setMounted] = useState(false);
    const products = useProductStore((state) => state.products);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Navigation hooks
    const searchParams = useSearchParams();
    const router = useRouter();

    // Read URL params (only actively used in Catalog mode, but technically parsed everywhere)
    const urlCategory = searchParams?.get("categoria");
    const urlQuery = searchParams?.get("q");

    const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

    // Sync internal category with URL when in Catalog
    useEffect(() => {
        if (isCatalog && urlCategory) {
            setSelectedCategory(urlCategory);
        } else if (isCatalog && !urlCategory) {
            setSelectedCategory("Todos");
        }
    }, [isCatalog, urlCategory]);

    const fetchProducts = useProductStore((state) => state.fetchProducts);

    // Initial Fetch & Mount
    useEffect(() => {
        fetchProducts().finally(() => setMounted(true));
    }, [fetchProducts]);

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedProduct(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Categories List
    const categories = useMemo(() => {
        const unique = new Set(products.map(p => p.categoria).filter(Boolean));
        return ["Todos", ...Array.from(unique)];
    }, [products]);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        let result = products;

        if (selectedCategory !== "Todos") {
            result = result.filter(p => p.categoria === selectedCategory);
        }

        if (isCatalog && urlQuery) {
            const lowerQ = urlQuery.toLowerCase();
            result = result.filter(p =>
                p.nome.toLowerCase().includes(lowerQ) ||
                (p.categoria && p.categoria.toLowerCase().includes(lowerQ))
            );
        }

        return result;
    }, [products, selectedCategory, isCatalog, urlQuery]);

    // Apply limiting or pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const displayProducts = useMemo(() => {
        if (limit && !isCatalog) {
            return filteredProducts.slice(0, limit);
        }
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage, limit, isCatalog]);

    // Reset page if filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, urlQuery]);

    const handleCategoryClick = (cat: string) => {
        if (isCatalog) {
            // Update URL if completely separated
            if (cat === "Todos") {
                router.push("/produtos");
            } else {
                router.push(`/produtos?categoria=${encodeURIComponent(cat)}`);
            }
        } else {
            // Just local update (or you can force route to /produtos)
            router.push(`/produtos?categoria=${encodeURIComponent(cat)}`);
        }
    };

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
        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* Context/Query Information for Catalog */}
            {isCatalog && urlQuery && (
                <div className="mb-8 flex items-center justify-between bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                    <p className="text-zinc-300">
                        Resultados para: <span className="text-white font-bold">"{urlQuery}"</span>
                    </p>
                    <button
                        onClick={() => router.push('/produtos')}
                        className="text-sm border border-zinc-700 hover:border-white px-4 py-2 rounded-full transition-colors text-zinc-400 hover:text-white"
                    >
                        Limpar Busca
                    </button>
                </div>
            )}

            {/* Categories Navigation (Shown differently based on context) */}
            {categories.length > 2 && (
                <div className={`flex flex-wrap gap-3 ${isCatalog ? 'mb-12 justify-center' : 'mb-10'}`}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === cat
                                ? "bg-white text-black shadow-lg scale-105 border border-white"
                                : "bg-zinc-900/80 text-zinc-400 border border-white/5 hover:bg-zinc-800 hover:text-white"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Products Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${isCatalog ? 'min-h-[500px]' : ''} content-start`}>
                <AnimatePresence mode="popLayout">
                    {displayProducts.map((product) => (
                        <motion.div
                            layout
                            layoutId={`card-${product.id}`}
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.3 }}
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
                            <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent z-10" />
                                <motion.img
                                    layoutId={`image-${product.id}`}
                                    src={product.foto}
                                    alt={product.nome}
                                    className="absolute inset-0 h-full w-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                                />
                                {product.categoria && (
                                    <div className="absolute top-3 left-3 z-20">
                                        <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-xs text-white rounded-full font-medium border border-white/10">
                                            {product.categoria}
                                        </span>
                                    </div>
                                )}
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

                {displayProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center text-zinc-500 flex flex-col items-center">
                        <Frown className="w-16 h-16 mb-4 opacity-30 text-zinc-400" />
                        <p className="text-lg">Nenhum produto encontrado.</p>
                        {urlQuery && (
                            <p className="text-sm mt-2 text-zinc-600">
                                Tente buscar por outros termos ou verifique a ortografia.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination Controls (Only on Catalog) */}
            {isCatalog && totalPages > 1 && (
                <div className="mt-16 mb-4 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full border border-white/10 bg-black hover:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 px-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors flex items-center justify-center ${currentPage === i + 1
                                    ? "bg-white text-black"
                                    : "bg-transparent text-zinc-400 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full border border-white/10 bg-black hover:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                        aria-label="Próxima página"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Home Hook - Let user go to catalog */}
            {!isCatalog && filteredProducts.length > limit! && (
                <div className="mt-16 flex justify-center">
                    <Link
                        href="/produtos"
                        className="group flex items-center gap-3 bg-zinc-900 border border-white/10 hover:border-white/30 text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest transition-all hover:bg-zinc-800"
                    >
                        VER CATÁLOGO COMPLETO
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            )}

            {/* Modal Detail */}
            <AnimatePresence>
                {selectedProduct && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                        />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                            <motion.div
                                layoutId={`card-${selectedProduct.id}`}
                                className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row pointer-events-auto relative max-h-[90vh]"
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
                                    {selectedProduct.categoria && (
                                        <div className="absolute top-6 left-6 z-20">
                                            <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md text-xs text-white rounded-full font-medium border border-white/10 uppercase tracking-widest">
                                                {selectedProduct.categoria}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 w-full md:w-1/2 flex flex-col justify-center overflow-y-auto">
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
                                            const phone = "5511999999999";
                                            const message = encodeURIComponent(`Olá! Gostaria de comprar o produto: *${selectedProduct.nome}*\nValor: R$ ${selectedProduct.preco.toFixed(2)}`);
                                            window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
                                        }}
                                        className="w-full bg-white hover:bg-zinc-200 text-black py-4 rounded-xl font-bold transition-transform active:scale-95 text-sm uppercase tracking-wide"
                                    >
                                        Comprar Agora
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
