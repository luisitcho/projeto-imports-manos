"use client";

import ProductList from '../components/ProductList';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, Suspense } from 'react';

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative selection:bg-white selection:text-black">

      {/* Animated Hero Section */}
      <div
        ref={containerRef}
        className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Animated Background Text (Parallax) */}
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        >
          <span className="text-[15vw] font-black text-white/5 whitespace-nowrap tracking-tighter select-none">
            STREETWEAR
          </span>
        </motion.div>

        {/* Foreground Hero Content */}
        <div className="relative z-10 text-center px-6 mx-auto max-w-4xl mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white text-xs font-semibold tracking-widest uppercase mb-6 border border-white/10 backdrop-blur-md">
              Nova Coleção 2026
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            ELEVE SEU <br />
            <span className="text-zinc-500">ESTILO.</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-zinc-400 font-medium tracking-wide max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            A curadoria definitiva de produtos premium importados.
            Moderna, elegante e focada na sua experiência.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <button
              onClick={() => {
                document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-zinc-200 transition-transform hover:scale-105 active:scale-95"
            >
              Explorar Catálogo
            </button>
          </motion.div>
        </div>

        {/* Floating gradient orb for aesthetics */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-[150px] pointer-events-none -z-10"
        />
      </div>

      <div className="w-full bg-zinc-950 border-y border-white/5 py-6 overflow-hidden flex whitespace-nowrap">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 items-center text-zinc-600 font-bold uppercase tracking-widest text-xl disable-selection"
        >
          {/* Repeat multiple times for smooth infinite marquee */}
          <span>IMPORTS MANOS</span>
          <span className="w-2 h-2 rounded-full bg-white/20"></span>
          <span>QUALIDADE PREMIUM</span>
          <span className="w-2 h-2 rounded-full bg-white/20"></span>
          <span>ENTREGA RÁPIDA</span>
          <span className="w-2 h-2 rounded-full bg-white/20"></span>
          <span>ESTILO URBANO</span>
          <span className="w-2 h-2 rounded-full bg-white/20"></span>
          <span>IMPORTS MANOS</span>
          <span className="w-2 h-2 rounded-full bg-white/20"></span>
          <span>QUALIDADE PREMIUM</span>
          <span className="w-2 h-2 rounded-full bg-white/20"></span>
          <span>ENTREGA RÁPIDA</span>
          <span className="w-2 h-2 rounded-full bg-white/20"></span>
          <span>ESTILO URBANO</span>
          <span className="w-2 h-2 rounded-full bg-white/20"></span>
          <span>IMPORTS MANOS</span>
          <span className="w-2 h-2 rounded-full bg-white/20"></span>
          <span>QUALIDADE PREMIUM</span>
          <span className="w-2 h-2 rounded-full bg-white/20"></span>
        </motion.div>
      </div>

      <section id="produtos" className="relative z-10 py-24 min-h-screen">
        <div className="text-center px-6 mx-auto max-w-2xl mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4"
          >
            Lançamentos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 font-medium tracking-wide"
          >
            Selecione a categoria e descubra as melhores opções.
          </motion.p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center items-center h-64 text-zinc-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
          </div>
        }>
          <ProductList limit={8} />
        </Suspense>
      </section>
    </div>
  );
}
