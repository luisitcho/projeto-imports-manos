"use client";

import { useEffect, useState, useRef } from "react";
import { useProductStore } from "../../store/useProductStore";
import { Product } from "../../types";
import { Plus, Pencil, Trash2, ImagePlus, Save, X, Search } from "lucide-react";

export default function AdminPage() {
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
    const [searchTerm, setSearchTerm] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex justify-center items-center h-screen bg-black">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
            </div>
        );
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFoto(reader.result as string);
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
        setIsFormOpen(true);
    };

    const openEditForm = (p: Product) => {
        setEditingId(p.id);
        setNome(p.nome);
        setPreco(p.preco.toString());
        setValor(p.valor.toString());
        setFoto(p.foto);
        setIsFormOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !preco || !valor || !foto) return;

        if (editingId) {
            updateProduct(editingId, {
                nome,
                preco: parseFloat(preco),
                valor: parseFloat(valor),
                foto,
            });
        } else {
            addProduct({
                nome,
                preco: parseFloat(preco),
                valor: parseFloat(valor),
                foto,
            });
        }
        setIsFormOpen(false);
    };

    const filteredProducts = products.filter((p) =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black/95 text-white pb-20 pt-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white mb-1">
                            Painel <span className="text-purple-500">Administrador</span>
                        </h1>
                        <p className="text-zinc-400">Gerencie todos os produtos do Imports_manos.</p>
                    </div>

                    <button
                        onClick={openNewForm}
                        className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-purple-900/40"
                    >
                        <Plus className="w-5 h-5" />
                        Adicionar Produto
                    </button>
                </div>

                {/* Global Search Bar */}
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                    <input
                        title="Search Products"
                        placeholder="Buscar produto por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-zinc-600 focus:bg-zinc-900"
                    />
                </div>

                {/* Product List Admin Table */}
                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-900/80 border-b border-zinc-800 text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">Foto</th>
                                    <th className="px-6 py-4">Nome</th>
                                    <th className="px-6 py-4">Preço (R$)</th>
                                    <th className="px-6 py-4">Valor (R$)</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                            Nenhum produto cadastrado ou encontrado na busca.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="hover:bg-zinc-800/30 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="w-12 h-12 rounded-lg bg-black/40 border border-zinc-800 overflow-hidden relative">
                                                    <img
                                                        src={p.foto}
                                                        alt={p.nome}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-zinc-200">
                                                {p.nome}
                                            </td>
                                            <td className="px-6 py-4 text-purple-400 font-semibold">
                                                {p.preco.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400">
                                                {p.valor.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                                <button
                                                    onClick={() => openEditForm(p)}
                                                    className="p-2 bg-zinc-800/50 text-blue-400 hover:text-blue-300 hover:bg-zinc-700/50 rounded-lg transition-colors inline-block"
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
                                                    className="p-2 bg-zinc-800/50 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors inline-block"
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
                            className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700 rounded-full transition-colors"
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
                                        className={`relative cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors ${foto ? 'border-purple-600 bg-purple-900/10' : 'border-zinc-700 hover:border-purple-500 hover:bg-zinc-800/50'
                                            }`}
                                    >
                                        {foto ? (
                                            <div className="relative w-full h-40 overflow-hidden rounded-lg">
                                                <img src={foto} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <Pencil className="w-8 h-8 text-white" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-zinc-500">
                                                <ImagePlus className="w-10 h-10 mb-2" />
                                                <span className="text-sm">Clique para upload da imagem</span>
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
                                        className="w-full bg-black/50 border border-zinc-700 focus:border-purple-500 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                                        placeholder="Ex: Tênis Air Max 90"
                                    />
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
                                                className="w-full bg-black/50 border border-zinc-700 focus:border-purple-500 rounded-lg py-2.5 pl-9 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Valor Referência / Custo</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">R$</span>
                                            <input
                                                required
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={valor}
                                                onChange={(e) => setValor(e.target.value)}
                                                className="w-full bg-black/50 border border-zinc-700 focus:border-purple-500 rounded-lg py-2.5 pl-9 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="px-5 py-2.5 text-zinc-300 hover:text-white font-medium hover:bg-zinc-800 rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-purple-900/30"
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
