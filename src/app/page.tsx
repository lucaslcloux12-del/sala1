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

import { useState, useEffect, useRef } from "react";
import { USER_DATABASE, UserProfile } from "../lib/users";
import { db } from "../lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";

export default function Home() {
  // Estados de Login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");

  // Estados do Chat
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Lógica de Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = USER_DATABASE.find(
      (u) => u.username === username && u.passkey === password
    );

    if (found) {
      setActiveUser(found);
      setError("");
    } else {
      setError("ACESSO NEGADO: CREDENCIAIS INVÁLIDAS.");
    }
  };

  // 2. Escutar mensagens em tempo real (Firebase)
  useEffect(() => {
    if (activeUser) {
      const q = query(collection(db, "chat"), orderBy("timestamp", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(msgData);
      });
      return () => unsubscribe();
    }
  }, [activeUser]);

  // 3. Auto-scroll para a última mensagem
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Enviar mensagem
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !activeUser) return;

    try {
      await addDoc(collection(db, "chat"), {
        text: newMessage,
        sender: activeUser.username,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (err) {
      console.error("Erro ao enviar:", err);
    }
  };

  // TELA DE LOGIN
  if (!activeUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black font-mono p-4">
        <div className="w-full max-w-sm border border-emerald-900 bg-zinc-950 p-8 shadow-2xl">
          <h1 className="text-emerald-500 text-center mb-8 tracking-[0.3em] text-sm animate-pulse">TERMINAL_ACESSO_RESTRITO</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="text" 
              placeholder="USUÁRIO" 
              className="w-full bg-black border-b border-emerald-900 p-2 outline-none focus:border-emerald-500 text-emerald-500"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="SENHA (8 DÍGITOS)" 
              maxLength={8}
              className="w-full bg-black border-b border-emerald-900 p-2 outline-none focus:border-emerald-500 text-emerald-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-700 text-[10px] text-center">{error}</p>}
            <button className="w-full border border-emerald-800 py-3 hover:bg-emerald-500 hover:text-black transition-all text-xs uppercase tracking-widest">Entrar</button>
          </form>
        </div>
      </main>
    );
  }

  // TELA DO CHAT (ESTILO WHATSAPP)
  return (
    <main className="flex flex-col h-screen bg-[#050505] font-sans">
      {/* Header do Chat */}
      <header className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center text-emerald-300 font-bold">
            {activeUser.username[0]}
          </div>
          <div>
            <h2 className="text-white text-sm font-semibold">Cofre de Comunicação</h2>
            <p className="text-[10px] text-emerald-500">10 Membros Ativos</p>
          </div>
        </div>
        <button onClick={() => setActiveUser(null)} className="text-zinc-500 hover:text-white text-xs">SAIR</button>
      </header>

      {/* Área das Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
        {messages.map((msg) => {
          const isMe = msg.sender === activeUser.username;
          const date = msg.timestamp instanceof Timestamp ? msg.timestamp.toDate() : new Date();
          const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-3 py-2 rounded-lg shadow-sm relative ${
                isMe ? "bg-emerald-800 text-white rounded-tr-none" : "bg-zinc-800 text-zinc-100 rounded-tl-none"
              }`}>
                {!isMe && <p className="text-[10px] font-bold text-emerald-400 mb-1">{msg.sender}</p>}
                <p className="text-sm leading-relaxed pr-8">{msg.text}</p>
                <span className="text-[9px] opacity-60 absolute bottom-1 right-2">
                  {timeString}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Barra de Input */}
      <form onSubmit={sendMessage} className="p-3 bg-zinc-900 flex gap-2 items-center">
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mensagem criptografada..."
          className="flex-1 bg-zinc-800 border-none rounded-full px-4 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button type="submit" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
        </button>
      </form>
    </main>
  );
}
