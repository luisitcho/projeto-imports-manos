import ProductList from '../components/ProductList';

export default function Home() {
  return (
    <div className="min-h-screen bg-black overflow-hidden relative selection:bg-white selection:text-black">
      <div className="relative z-10 py-24">
        <div className="text-center px-6 mx-auto max-w-2xl mb-24">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Destaques
          </h1>
          <p className="text-zinc-500 font-medium tracking-wide">
            O essencial para o seu dia a dia.
          </p>
        </div>

        <ProductList />
      </div>
    </div>
  );
}
