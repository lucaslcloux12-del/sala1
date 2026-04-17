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
  serverTimestamp 
} from "firebase/firestore";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Escuta o chat em tempo real
  useEffect(() => {
    if (activeUser) {
      const q = query(collection(db, "chat"), orderBy("timestamp", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(msgData);
        // Scroll para o final automaticamente
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });
      return () => unsubscribe();
    }
  }, [activeUser]);

  // 2. Função para enviar mensagem
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    await addDoc(collection(db, "chat"), {
      text: newMessage,
      sender: activeUser?.username,
      timestamp: serverTimestamp(),
    });
    setNewMessage("");
  };

  // --- LÓGICA DE LOGIN (Mantenha a que já fizemos) ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = USER_DATABASE.find(u => u.username === username && u.passkey === password);
    if (found) setActiveUser(found);
  };

  if (!activeUser) {
    return (
      /* Mantenha aqui o código do FORMULÁRIO DE LOGIN que te enviei antes */
      <div className="p-20">Carregando formulário... (Use o código anterior aqui)</div>
    );
  }

  // --- INTERFACE DO CHAT ESTILO WHATSAPP ---
  return (
    <main className="flex flex-col h-screen bg-[#050505] font-mono">
      {/* Header */}
      <header className="p-4 border-b border-emerald-900 bg-black flex justify-between items-center">
        <div>
          <h1 className="text-emerald-500 font-bold text-xs">PROTOCOLO_CHAT_v1.0</h1>
          <p className="text-[10px] text-emerald-800 uppercase">Usuário: {activeUser.username}</p>
        </div>
        <button onClick={() => setActiveUser(null)} className="text-[10px] text-red-900 hover:text-red-500 underline">DESCONECTAR</button>
      </header>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender === activeUser.username;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] p-3 rounded-lg border ${
                isMe 
                ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200" 
                : "bg-zinc-900 border-zinc-700 text-zinc-300"
              }`}>
                <div className="flex justify-between items-center gap-4 mb-1">
                  <span className="text-[9px] font-bold uppercase text-emerald-600">{msg.sender}</span>
                  <span className="text-[8px] opacity-50">
                    {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm break-words">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input de Mensagem */}
      <form onSubmit={sendMessage} className="p-4 border-t border-emerald-900 bg-black flex gap-2">
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua transmissão..."
          className="flex-1 bg-zinc-950 border border-emerald-900 p-2 text-sm text-emerald-400 outline-none focus:border-emerald-500"
        />
        <button type="submit" className="bg-emerald-900 text-black px-4 py-2 text-xs font-bold hover:bg-emerald-500 transition-colors">
          ENVIAR
        </button>
      </form>
    </main>
  );
}
