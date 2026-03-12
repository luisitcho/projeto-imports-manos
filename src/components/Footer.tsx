import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-black text-zinc-400 py-12 text-sm mt-auto">
            <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="font-bold text-white text-lg mb-4 tracking-tight">Imports_manos</h3>
                    <p className="max-w-xs leading-relaxed">
                        Sua loja de produtos importados com a melhor qualidade e minimalismo.
                        Moderna, elegante e focada na sua experiência.
                    </p>
                </div>
                <div>
                    <h4 className="font-medium text-white mb-4">Links Rápidos</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/" className="hover:text-white transition-colors">Produtos</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-medium text-white mb-4">Contato</h4>
                    <ul className="space-y-2">
                        <li>contato@importsmanos.com.br</li>
                        <li>(11) 99999-9999</li>
                        <li className="pt-2">São Paulo, SP - Brasil</li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 md:px-8 flex flex-col items-center justify-center mt-12 pt-8 border-t border-white/5">
                <p>© {new Date().getFullYear()} Imports_manos. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}
