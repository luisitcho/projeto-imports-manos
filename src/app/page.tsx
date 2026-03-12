import ProductList from '../components/ProductList';

export default function Home() {
  return (
    <main className="min-h-screen bg-black overflow-hidden relative selection:bg-purple-900 selection:text-white">
      {/* Background radial gradient */}
      <div className="absolute top-[-10%] left-1/2 -ml-[40rem] w-[80rem] h-[50rem] opacity-30 mix-blend-screen pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-800 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 py-16">
        <div className="text-center px-6 mx-auto max-w-2xl mb-12">
          <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500 tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Destaques da Loja
          </h1>
          <p className="text-lg text-zinc-400 font-medium">
            Confira as últimas novidades e produtos importados da Imports_manos.
          </p>
        </div>

        <ProductList />
      </div>
    </main>
  );
}
