"use client";

import { useEffect, useState, useRef } from "react";
import { useProductStore } from "../../../store/useProductStore";
import { Product } from "../../../types";
import { Plus, Pencil, Trash2, ImagePlus, Save, X, Search, LogOut } from "lucide-react";

export default function AdminDashboardPage() {
    const [mounted, setMounted] = useState(false);
    const products = useProductStore((state) => state.products);
    const addProduct = useProductStore((state) => state.addProduct);
    const updateProduct = useProductStore((state) => state.updateProduct);
    const deleteProduct = useProductStore((state) => state.deleteProduct);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [valor, setValor] = useState("");
    const [foto, setFoto] = useState("");
    const [categoria, setCategoria] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const existingCategories = Array.from(new Set(products.map(p => p.categoria).filter(Boolean)));

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchProducts = useProductStore((state) => state.fetchProducts);

    useEffect(() => {
        fetchProducts().finally(() => setMounted(true));
    }, [fetchProducts]);

    if (!mounted) {
        return (
            <div className="flex justify-center items-center h-[70vh] bg-black">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
        );
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    let w = img.width;
                    let h = img.height;

                    if (w > MAX_WIDTH) {
                        h = Math.round((h * MAX_WIDTH) / w);
                        w = MAX_WIDTH;
                    }

                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, w, h);
                        const compressedBase64 = canvas.toDataURL('image/webp', 0.7); // Compress to 70% quality webp
                        setFoto(compressedBase64);
                    } else {
                        setFoto(reader.result as string);
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const openNewForm = () => {
        setEditingId(null);
        setNome("");
        setPreco("");
        setValor("");
        setFoto("");
        setCategoria("");
        setIsFormOpen(true);
    };

    const openEditForm = (p: Product) => {
        setEditingId(p.id);
        setNome(p.nome);
        setPreco(p.preco.toString());
        setValor(p.valor.toString());
        setFoto(p.foto);
        setCategoria(p.categoria || "");
        setIsFormOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !preco || !valor || !foto || !categoria) return;

        const isDuplicate = products.some(
            p => p.nome.toLowerCase().trim() === nome.toLowerCase().trim() && p.id !== editingId
        );

        if (isDuplicate) {
            alert("Erro: Já existe um produto cadastrado com este nome exato.");
            return;
        }

        // Mapeia e junta minúsculas/maiúsculas pra não duplicar categoria
        const normalizedCategoria = categoria.trim();
        const existingCategoryMatch = existingCategories.find(
            c => c.toLowerCase() === normalizedCategoria.toLowerCase()
        );
        const finalCategoria = existingCategoryMatch || (normalizedCategoria.charAt(0).toUpperCase() + normalizedCategoria.slice(1).toLowerCase());

        if (editingId) {
            updateProduct(editingId, {
                nome: nome.trim(),
                preco: parseFloat(preco.toString().replace(',', '.')),
                valor: parseFloat(valor.toString().replace(',', '.')),
                foto,
                categoria: finalCategoria,
            });
        } else {
            addProduct({
                nome: nome.trim(),
                preco: parseFloat(preco.toString().replace(',', '.')),
                valor: parseFloat(valor.toString().replace(',', '.')),
                foto,
                categoria: finalCategoria,
            });
        }
        setIsFormOpen(false);
    };

    const filteredProducts = products.filter((p) =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-[85vh] bg-black text-white pb-20 pt-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                            Painel <span className="text-zinc-500 font-medium">Administrador</span>
                        </h1>
                        <p className="text-zinc-400">Gerencie todos os produtos do Imports_manos.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                document.cookie = "admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                window.location.href = "/admin";
                            }}
                            className="inline-flex items-center justify-center gap-2 bg-transparent border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sair
                        </button>
                        <button
                            onClick={openNewForm}
                            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-lg shadow-white/10"
                        >
                            <Plus className="w-5 h-5" />
                            Novo Produto
                        </button>
                    </div>
                </div>

                {/* Global Search Bar */}
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                    <input
                        title="Search Products"
                        placeholder="Buscar produto por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-white transition-all placeholder:text-zinc-600 focus:bg-zinc-900"
                    />
                </div>

                {/* Product List Admin Table */}
                <div className="bg-black border border-white/10 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-white/10 bg-zinc-900/30 text-zinc-400 font-medium hover:bg-zinc-900/50 transition-colors">
                                    <th className="w-[15%] px-4 py-3 h-12 align-middle">Foto</th>
                                    <th className="w-[20%] px-4 py-3 h-12 align-middle">Nome</th>
                                    <th className="w-[15%] px-4 py-3 h-12 align-middle">Categoria</th>
                                    <th className="w-[15%] px-4 py-3 h-12 align-middle">Preço (R$)</th>
                                    <th className="w-[15%] px-4 py-3 h-12 align-middle">Valor de mercado (R$)</th>
                                    <th className="w-[20%] px-4 py-3 h-12 align-middle text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-zinc-500">
                                            Nenhum produto cadastrado ou encontrado na busca.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="hover:bg-zinc-900/50 transition-colors group data-[state=selected]:bg-zinc-800"
                                        >
                                            <td className="px-4 py-3 align-middle">
                                                <div className="w-10 h-10 rounded-md bg-black border border-white/10 overflow-hidden relative">
                                                    <img
                                                        src={p.foto}
                                                        alt={p.nome}
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-opacity duration-300 opacity-80 group-hover:opacity-100"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 align-middle font-medium text-zinc-200">
                                                {p.nome}
                                            </td>
                                            <td className="px-4 py-3 align-middle text-zinc-400">
                                                <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-xs font-medium border border-white/5">{p.categoria || "Sem Categoria"}</span>
                                            </td>
                                            <td className="px-4 py-3 align-middle text-white font-medium">
                                                R$ {p.preco.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 align-middle text-zinc-500 line-through">
                                                R$ {p.valor.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 align-middle text-right space-x-1">
                                                <button
                                                    onClick={() => openEditForm(p)}
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-white hover:text-black h-9 w-9 text-zinc-400"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm("Deseja realmente excluir este produto?")) {
                                                            deleteProduct(p.id);
                                                        }
                                                    }}
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-red-900/90 hover:text-red-200 h-9 w-9 text-zinc-400"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal / Dialog for Create & Edit */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsFormOpen(false)}
                            className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-black bg-zinc-800/50 hover:bg-white rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="p-6 sm:p-8">
                            <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">
                                {editingId ? "Editar Produto" : "Novo Produto"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Image Input Section */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Foto / Imagem</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                    />
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`relative cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors ${foto ? 'border-white bg-white/5' : 'border-zinc-700 hover:border-white hover:bg-zinc-800/50'
                                            }`}
                                    >
                                        {foto ? (
                                            <div className="relative w-full h-40 overflow-hidden rounded-lg">
                                                <img src={foto} alt="Preview" className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <Pencil className="w-8 h-8 text-white" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-zinc-500 text-center">
                                                <ImagePlus className="w-10 h-10 mb-2" />
                                                <span className="text-sm font-medium text-white">Clique para upload da imagem</span>
                                                <span className="text-xs text-zinc-600 mt-2 px-4">
                                                    Sua imagem será automaticamente redimensionada e otimizada (WebP) para poupar o espaço do painel.
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Nome do Produto</label>
                                    <input
                                        required
                                        type="text"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-700 focus:border-white rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-1 focus:ring-white transition-colors"
                                        placeholder="Ex: Tênis Air Max 90"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Categoria</label>
                                    <input
                                        required
                                        type="text"
                                        value={categoria}
                                        onChange={(e) => setCategoria(e.target.value)}
                                        className="w-full bg-black/50 border border-zinc-700 focus:border-white rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-1 focus:ring-white transition-colors"
                                        placeholder="Digite nova ou selecione abaixo..."
                                        autoComplete="off"
                                    />
                                    {existingCategories.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3 p-1">
                                            {existingCategories.map((cat, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setCategoria(cat)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${categoria.toLowerCase() === cat.toLowerCase()
                                                        ? "bg-white text-black border-white"
                                                        : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white"
                                                        }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Preço de Venda</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">R$</span>
                                            <input
                                                required
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={preco}
                                                onChange={(e) => setPreco(e.target.value)}
                                                className="w-full bg-black/50 border border-zinc-700 focus:border-white rounded-lg py-2.5 pl-9 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-white transition-colors"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Valor Referência</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">R$</span>
                                            <input
                                                required
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={valor}
                                                onChange={(e) => setValor(e.target.value)}
                                                className="w-full bg-black/50 border border-zinc-700 focus:border-white rounded-lg py-2.5 pl-9 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-white transition-colors"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800 mt-6 md:pb-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="px-5 py-2.5 text-zinc-300 hover:text-white font-medium hover:bg-zinc-800 rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-lg shadow-white/10"
                                    >
                                        <Save className="w-4 h-4" />
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
