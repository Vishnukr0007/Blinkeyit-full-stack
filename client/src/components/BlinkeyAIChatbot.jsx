import { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane, FaTimes, FaMicrophone, FaShoppingCart, FaPlus, FaCheck } from "react-icons/fa";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useGlobalContext } from "../provider/GlobalProvider";
import toast from "react-hot-toast";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";

const BlinkeyAIChatbot = () => {
  const { fetchCartItems } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hi! I'm Blinkey AI, your personal instant shopping assistant. Ask me anything about recipes, deals, or grocery recommendations!"
    }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    setInputMsg("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const response = await Axios({
        ...SummaryApi.aiChat,
        data: { message: userText }
      });

      if (response.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: response.data.reply,
            products: response.data.suggestedProducts || []
          }
        ]);
      }
    } catch (error) {
      console.warn("AI Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `I'm here to help you order groceries in 10 minutes! Try asking for fresh dairy, fruits, or instant recipes.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        toast.success("🎙️ Listening... Speak your query!");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMsg(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error("Could not capture audio. Please try typing.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      console.error("Speech recognition error:", err);
    }
  };

  const handleAddToCart = async (productId, name) => {
    try {
      await Axios({
        ...SummaryApi.addToCart,
        data: { productId }
      });
      if (fetchCartItems) fetchCartItems();
      toast.success(`🛒 Added ${name} to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:scale-105 text-white p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-3 cursor-pointer border-2 border-emerald-300/40 animate-bounce"
        >
          <FaRobot size={24} className="text-amber-300" />
          <span className="font-extrabold text-sm hidden sm:inline pr-1">Blinkey AI</span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-ping" />
        </button>
      )}

      {/* CHAT MODAL WINDOW */}
      {isOpen && (
        <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl w-[92vw] sm:w-96 h-[520px] flex flex-col overflow-hidden animate-fade-in">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-emerald-700 via-slate-900 to-indigo-900 p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-amber-300">
                <FaRobot size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Blinkey AI Shopping Agent</h3>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Assistant
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-2 rounded-xl transition cursor-pointer"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* MESSAGES CONTAINER */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-slate-900 text-slate-200 rounded-bl-none border border-slate-800 shadow-md"
                  }`}
                >
                  {msg.text}
                </div>

                {/* SUGGESTED PRODUCT CARDS */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2.5 w-full space-y-2">
                    {msg.products.map((prod) => (
                      <div
                        key={prod._id}
                        className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          {prod.image?.[0] && (
                            <img
                              src={prod.image[0]}
                              alt={prod.name}
                              className="w-8 h-8 object-cover rounded-lg border border-slate-700"
                            />
                          )}
                          <div className="truncate">
                            <p className="font-bold text-white text-[11px] truncate">{prod.name}</p>
                            <p className="text-emerald-400 font-extrabold text-[10px]">
                              {DisplayPriceInRupees(prod.price)}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddToCart(prod._id, prod.name)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2.5 py-1.5 rounded-lg font-bold text-[10px] flex items-center gap-1 transition cursor-pointer shrink-0"
                        >
                          <FaPlus size={9} /> Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-900/60 p-2.5 rounded-xl w-fit">
                <FaRobot className="animate-spin text-emerald-400" /> Blinkey AI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BAR */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-xl transition cursor-pointer ${
                isListening ? "bg-red-500 text-white animate-pulse" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
              title="Voice Search"
            >
              <FaMicrophone size={14} />
            </button>

            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask Blinkey AI..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />

            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-2.5 rounded-xl font-bold transition disabled:opacity-40 cursor-pointer"
            >
              <FaPaperPlane size={13} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BlinkeyAIChatbot;
