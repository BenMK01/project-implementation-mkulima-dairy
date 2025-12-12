import React, { useState } from "react";
import api from "../api"; // your axios instance

type Message = {
  id: string;
  from: "user" | "bot";
  text: string;
  time: string;
};

type Recommendation = {
  id: number;
  name: string;
  feed_type: string;
  price_per_kg: number;
  available_quantity_kg: number;
  region: string;
};

const AIRecommendationsChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "m0", from: "bot", text: "Hello — tell me your cow breed, location and herd size, and I'll suggest a feeding plan.", time: new Date().toISOString() }
  ]);
  const [input, setInput] = useState("");
  const [breed, setBreed] = useState("");
  const [region, setRegion] = useState("");
  const [herdSize, setHerdSize] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [lastRecs, setLastRecs] = useState<Recommendation[]>([]);

  const addMessage = (from: Message["from"], text: string) => {
    const msg: Message = { id: `${Date.now()}-${Math.random()}`, from, text, time: new Date().toISOString() };
    setMessages(prev => [...prev, msg]);
  };

  const send = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() && !breed && !region && !herdSize) return;
    // send user message to chat
    addMessage("user", input || `breed:${breed} region:${region} herd:${herdSize}`);
    setLoading(true);
    try {
      const payload = {
        message: input || `Request recommendations`,
        breed: breed || "",
        region: region || "",
        herd_size: herdSize || 0,
      };
      const resp = await api.post("/api/recommendations/chat/", payload);
      const data = resp.data;
      const replyText = data.reply || "Sorry, I couldn't prepare a recommendation.";
      addMessage("bot", replyText);
      setLastRecs(data.recommendations || []);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || (err?.message || "Network error");
      addMessage("bot", `Error: ${msg}`);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-3">AI Feed Recommendations (Chat)</h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          placeholder="Breed (optional, e.g. Friesian)"
          className="border rounded p-2 col-span-1 md:col-span-1"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />
        <input
          placeholder="Region (optional, e.g. Nairobi)"
          className="border rounded p-2 col-span-1 md:col-span-1"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <input
          placeholder="Herd size (optional)"
          type="number"
          className="border rounded p-2 col-span-1 md:col-span-1"
          value={herdSize as any}
          onChange={(e) => setHerdSize(e.target.value ? Number(e.target.value) : "")}
        />
      </div>

      <div className="bg-white border rounded shadow p-4 mb-4 max-h-72 overflow-auto">
        {messages.map(m => (
          <div key={m.id} className={`mb-3 ${m.from === "user" ? "text-right" : "text-left"}`}>
            <div className={`${m.from === "user" ? "inline-block bg-blue-500 text-white" : "inline-block bg-gray-100 text-gray-900"} px-3 py-2 rounded`}>
              <div style={{whiteSpace: "pre-wrap"}}>{m.text}</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">{new Date(m.time).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question or leave blank to use filters above..."
          className="flex-1 border rounded p-2"
        />
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
          {loading ? "Thinking…" : "Send"}
        </button>
      </form>

      {lastRecs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Recommended feeds</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lastRecs.map(r => (
              <div key={r.id} className="border rounded p-3 bg-white">
                <div className="font-medium text-gray-900">{r.name}</div>
                <div className="text-sm text-gray-600">{r.feed_type} — {r.region}</div>
                <div className="mt-2 text-sm text-gray-800">Available: <strong>{r.available_quantity_kg}</strong> kg</div>
                <div className="text-sm text-gray-800">Price: <strong>KSh {r.price_per_kg}</strong>/kg</div>
                <div className="mt-2">
                  <a href={`/feed/${r.id}`} className="text-blue-600 hover:underline text-sm">View product</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationsChat;