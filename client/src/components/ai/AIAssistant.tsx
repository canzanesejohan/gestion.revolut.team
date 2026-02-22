import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, Loader2, Maximize2, Minimize2 } from "lucide-react";
import api from "../../services/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", {
        message: userMsg.content,
        history: messages.slice(-10),
      });
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      setConfigured(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      const errorMsg = error?.response?.data?.error || "Error al comunicar con Claude AI";
      if (errorMsg.includes("no esta configurado")) {
        setConfigured(false);
      }
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: "Estado del equipo", prompt: "Dame un resumen del estado actual del equipo y los proyectos" },
    { label: "Detectar riesgos", prompt: "Analiza posibles riesgos y cuellos de botella en los proyectos actuales" },
    { label: "Recomendaciones", prompt: "Dame recomendaciones para mejorar la productividad del equipo" },
    { label: "Planificar sprint", prompt: "Ayudame a planificar el proximo sprint basandote en las entregas pendientes" },
  ];

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-violet-500/30 active:scale-95"
        title="Claude AI Assistant"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className={`fixed z-50 flex flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all ${
      expanded
        ? "bottom-4 left-4 right-4 top-4 md:bottom-6 md:left-auto md:right-6 md:top-6 md:h-[calc(100vh-48px)] md:w-[600px]"
        : "bottom-6 right-6 h-[560px] w-[400px]"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Claude Assistant</h3>
            <p className="text-[11px] text-white/70">IA para gestion de proyectos</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => { setOpen(false); setExpanded(false); }}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100">
                <Sparkles className="h-8 w-8 text-violet-600" />
              </div>
              <h4 className="mt-3 font-semibold text-gray-900">Hola, soy Claude</h4>
              <p className="mt-1 text-sm text-gray-500">
                Tu asistente de IA para gestion de proyectos. Preguntame lo que necesites.
              </p>
            </div>

            {!configured && (
              <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                Claude AI no esta configurado. Agrega tu ANTHROPIC_API_KEY en el archivo .env del servidor.
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => { setInput(action.prompt); }}
                  className="rounded-xl border border-gray-200 p-3 text-left text-xs text-gray-600 transition-all hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === "user"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="mb-3 flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Claude esta pensando...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escribe tu pregunta..."
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white transition-all hover:shadow-md disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
