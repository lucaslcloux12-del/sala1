"use client";

import { useState, useEffect, useRef } from "react";
import { USER_DATABASE, UserProfile } from "../lib/users";
import { db } from "../lib/firebase";
import { 
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp 
} from "firebase/firestore";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // CONTEÚDO DO TERMINAL (Onde você coloca os conhecimentos)
  const KNOWLEDGE_BASE = [
    { title: "CRIPTOGRAFIA QUÂNTICA", content: "Métodos de interceptação de chaves RSA em ambientes de baixa latência..." },
    { title: "ARQUIVOS DESCLASSIFICADOS", content: "Documentos recuperados de servidores antigos sobre engenharia social reversa." },
    { title: "OSINT AVANÇADO", content: "Técnicas de rastreamento de pegada digital sem deixar logs em servidores DNS." },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = USER_DATABASE.find(u => u.username === username && u.passkey === password);
    if (found) { setActiveUser(found); } else { setError("ACESSO NEGADO."); }
  };

  useEffect(() => {
    if (activeUser) {
      const q = query(collection(db, "chat"), orderBy("timestamp", "asc"));
      return onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    }
  }, [activeUser]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUser) return;
    await addDoc(collection(db, "chat"), {
      text: newMessage,
      sender: activeUser.username,
      timestamp: serverTimestamp(),
    });
    setNewMessage("");
  };

  if (!activeUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black font-mono">
        <div className="border border-emerald-900 bg-zinc-950 p-8 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <h1 className="text-emerald-500 mb-6 text-center tracking-[0.5em]">ROOT_ACCESS</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="USER" className="w-full bg-black border border-emerald-900 p-2 text-emerald-500 outline-none focus:border-emerald-400" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="PASS" className="w-full bg-black border border-emerald-900 p-2 text-emerald-500 outline-none focus:border-emerald-400" onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="text-red-500 text-[10px]">{error}</p>}
            <button className="w-full bg-emerald-900/20 border border-emerald-500 py-2 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all">INFILTRAR</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen bg-black text-emerald-500 font-mono">
      
      {/* SEÇÃO 1: TERMINAL DE CONHECIMENTO (O SITE) */}
      <section className="flex-1 overflow-y-auto p-8 border-r border-emerald-900/30">
        <header className="mb-12 border-b border-emerald-900 pb-4">
          <h1 className="text-2xl font-bold tracking-tighter">BIBLIOTECA_OBSCURA.v2</h1>
          <p className="text-xs opacity-60">Sessão ativa como: {activeUser.username}</p>
        </header>

        <div className="space-y-12 max-w-3xl">
          {KNOWLEDGE_BASE.map((item, idx) => (
            <article key={idx} className="group">
              <h2 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                <span className="text-[10px] bg-emerald-900 px-1 text-black">0{idx + 1}</span>
                {item.title}
              </h2>
              <p className="text-emerald-800 leading-relaxed text-sm group-hover:text-emerald-600 transition-colors">
                {item.content}
              </p>
              <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-emerald-900/50 to-transparent" />
            </article>
          ))}
          
          <div className="p-4 border border-dashed border-emerald-900/50 text-[10px] text-emerald-900 uppercase italic">
            Aguardando novas entradas de dados dos administradores...
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: CHAT ESTILO ZAP (INTERNET DARK) */}
      <section className="w-96 flex flex-col bg-zinc-950">
        <div className="p-4 bg-emerald-900/10 border-b border-emerald-900/30 flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-widest">Chat em Tempo Real</h2>
        </div>

        {/* Mensagens (Onde o "Zap" acontece) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          {messages.map((msg) => {
            const isMe = msg.sender === activeUser.username;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-lg p-2 text-xs border ${
                  isMe 
                    ? "bg-emerald-600/20 border-emerald-500 text-emerald-100 rounded-tr-none" 
                    : "bg-zinc-900 border-zinc-700 text-zinc-300 rounded-tl-none"
                }`}>
                  {!isMe && <p className="font-bold text-[9px] text-emerald-500 mb-1">{msg.sender}</p>}
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 bg-zinc-950 border-t border-emerald-900/30">
          <div className="flex gap-2">
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite uma mensagem..."
              className="flex-1 bg-black border border-emerald-900 px-3 py-2 text-xs outline-none focus:border-emerald-500"
            />
            <button className="bg-emerald-900 px-4 text-black font-bold hover:bg-emerald-400 transition-colors">
              {">"}
            </button>
          </div>
          <button onClick={() => setActiveUser(null)} className="mt-4 w-full text-[9px] opacity-40 hover:opacity-100 uppercase underline">Encerrar Conexão</button>
        </form>
      </section>
    </main>
  );
}
