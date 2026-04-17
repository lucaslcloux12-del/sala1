"use client";

import { useState, useEffect } from "react";
import { USER_DATABASE, UserProfile } from "../lib/users";

export default function Home() {
  // Estados para controlar o formulário e o usuário logado
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [bootText, setBootText] = useState("");

  // Efeito visual simulando inicialização do sistema
  useEffect(() => {
    const text = "SISTEMA INICIADO. INSIRA CREDENCIAIS.";
    let i = 0;
    const timer = setInterval(() => {
      setBootText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Lógica de verificação do login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Busca na nossa base de dados (o array de 10 usuários)
    const foundUser = USER_DATABASE.find(
      (u) => u.username === username && u.passkey === password
    );

    if (foundUser) {
      setActiveUser(foundUser);
      setError("");
    } else {
      setError("FALHA NA AUTENTICAÇÃO. TENTE NOVAMENTE.");
      // Limpa o erro após 3 segundos
      setTimeout(() => setError(""), 3000);
    }
  };

  // TELA 1: Se não houver usuário ativo, mostra o Login
  if (!activeUser) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 relative z-20">
        <div className="w-full max-w-md border border-emerald-900 bg-black/80 p-8 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          
          <div className="mb-8 min-h-[24px] border-l-2 border-emerald-500 pl-2 text-sm text-emerald-400">
            {bootText}
            <span className="animate-pulse">_</span>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <label className="text-xs text-emerald-800 mb-1 block">IDENTIFICAÇÃO</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border-b border-emerald-900 px-2 py-1 text-emerald-400 outline-none focus:border-emerald-500 transition-colors"
                placeholder="User..."
              />
            </div>

            <div>
              <label className="text-xs text-emerald-800 mb-1 block">CHAVE DE ACESSO</label>
              <input
                type="password"
                maxLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-emerald-900 px-2 py-1 text-emerald-400 outline-none focus:border-emerald-500 transition-colors tracking-widest"
                placeholder="********"
              />
            </div>

            {error && (
              <div className="text-red-500 text-xs text-center uppercase animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-4 border border-emerald-900 px-4 py-3 text-sm uppercase tracking-widest text-emerald-600 transition-colors hover:bg-emerald-900 hover:text-black focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              Autenticar
            </button>
          </form>
        </div>
        
        <div className="mt-6 text-[10px] text-emerald-900/50 uppercase tracking-widest">
          ACESSO RESTRITO A 10 MEMBROS
        </div>
      </main>
    );
  }

  // TELA 2: Se o login for bem sucedido, mostra o Painel Interno Secreto
  return (
    <main className="min-h-screen p-4 md:p-8 relative z-20">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-emerald-900 pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-emerald-500">
            Cofre Principal
          </h1>
          <p className="text-xs text-emerald-700">STATUS: ONLINE E CRIPTOGRAFADO</p>
        </div>
        <div className="flex flex-col md:items-end gap-2">
          <span className="text-xs text-emerald-400 bg-emerald-900/20 px-2 py-1 border border-emerald-900/50">
            BEM-VINDO, {activeUser.username} [{activeUser.role}]
          </span>
          <button
            onClick={() => {
              setActiveUser(null);
              setUsername("");
              setPassword("");
            }}
            className="text-[10px] text-emerald-600 underline hover:text-emerald-400 text-left md:text-right"
          >
            ENCERRAR SESSÃO
          </button>
        </div>
      </header>

      {/* Conteúdo da Área Secreta */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        <div className="border border-emerald-900/50 p-4 hover:border-emerald-700 transition-colors bg-black/40">
          <h2 className="mb-2 text-sm text-emerald-600">DOCUMENTOS CONFIDENCIAIS</h2>
          <p className="text-xs text-emerald-800">
            Nenhum novo arquivo detectado. O repositório está vazio.
          </p>
        </div>
        
        <div className="border border-emerald-900/50 p-4 hover:border-emerald-700 transition-colors bg-black/40">
          <h2 className="mb-2 text-sm text-emerald-600">REGISTRO DE ACESSO</h2>
          <p className="text-xs text-emerald-800">
            Conexão estabelecida com sucesso. Rastreamento desativado.
          </p>
        </div>
        
        <div className="border border-emerald-900/50 p-4 hover:border-emerald-700 transition-colors md:col-span-2 lg:col-span-1 bg-black/40">
          <h2 className="mb-2 text-sm text-emerald-600">FERRAMENTAS DE SISTEMA</h2>
          <ul className="text-xs text-emerald-800 space-y-2">
            <li className="cursor-not-allowed opacity-50">▶ Acessar Terminal Root (Offline)</li>
            <li className="cursor-not-allowed opacity-50">▶ Iniciar Purga de Dados (Bloqueado)</li>
          </ul>
        </div>

      </div>
    </main>
  );
}
"use client";
import { useState, useEffect } from "react";
import { USER_DATABASE, UserProfile } from "../lib/users";
// Importando o banco de dados do Firebase
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [secretContent, setSecretContent] = useState("Carregando dados criptografados...");

  // Função para buscar conteúdo no Firebase após o login
  const fetchSecretData = async () => {
    try {
      // Suposição: você criou uma coleção "vault" e um documento "main" no Firestore
      const docRef = doc(db, "vault", "main");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSecretContent(docSnap.data().message);
      } else {
        setSecretContent("AVISO: O banco de dados está vazio.");
      }
    } catch (err) {
      setSecretContent("ERRO: Falha na conexão com o Firebase.");
    }
  };

  // Chama a busca assim que o usuário logar
  useEffect(() => {
    if (activeUser) {
      fetchSecretData();
    }
  }, [activeUser]);

  // ... (mantenha a lógica de handleLogin igual ao passo anterior)
