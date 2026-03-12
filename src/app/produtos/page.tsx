import ProductList from '../../components/ProductList';
import { Suspense } from 'react';

export default function ProdutosPage() {
    return (
        <div className="min-h-screen bg-black pt-12 pb-24">
            <div className="text-center px-6 mx-auto max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                    Catálogo Completo
                </h1>
                <p className="text-zinc-500 font-medium tracking-wide">
                    Explore todos os nossos produtos e lançamentos exclusivos.
                </p>
            </div>

            <Suspense fallback={
                <div className="flex justify-center items-center h-64 text-zinc-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                </div>
            }>
                <ProductList isCatalog={true} />
            </Suspense>
        </div>
    );
}
