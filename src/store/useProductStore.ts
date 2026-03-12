import { create } from 'zustand';
import { Product } from '../types';

interface ProductStore {
    products: Product[];
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    fetchProducts: async () => {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                set({ products: data });
            }
        } catch (e) {
            console.error('Failed to fetch products', e);
        }
    },
    addProduct: async (product) => {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            });
            if (res.ok) {
                const newProduct = await res.json();
                set((state) => ({ products: [...state.products, newProduct] }));
            } else {
                alert("Erro ao enviar produto.");
            }
        } catch (e) {
            console.error(e);
        }
    },
    updateProduct: async (id, updatedProduct) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct),
            });
            if (res.ok) {
                const returnedProduct = await res.json();
                set((state) => ({
                    products: state.products.map((p) => (p.id === id ? returnedProduct : p))
                }));
            } else {
                alert("Erro ao modificar produto.");
            }
        } catch (e) {
            console.error(e);
        }
    },
    deleteProduct: async (id) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                set((state) => ({
                    products: state.products.filter((p) => p.id !== id)
                }));
            } else {
                alert("Erro ao excluir produto.");
            }
        } catch (e) {
            console.error(e);
        }
    }
}));
