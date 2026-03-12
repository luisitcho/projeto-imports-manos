"use client";

import { useActionState } from "react";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { login } from "../actions";

const initialState = { error: "" };

export default function AdminLogin() {
    const [state, formAction, pending] = useActionState(login, initialState);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-black">
            <div className="w-full max-w-md p-8 bg-zinc-900/40 border border-white/5 backdrop-blur-md rounded-2xl shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-white/5 rounded-full mb-4">
                        <ShieldAlert className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Área Restrita</h1>
                    <p className="text-sm text-zinc-500 mt-2 text-center">
                        Insira a senha de administrador para acessar o painel de gerenciamento.
                    </p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-zinc-400">
                            Senha de Acesso
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-black/50 border border-zinc-800 focus:border-white rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                            placeholder="••••••••"
                        />
                        {state?.error && (
                            <p className="text-sm text-red-400 mt-2">{state.error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={pending}
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {pending ? "Autenticando..." : "Entrar no Painel"}
                        {!pending && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
