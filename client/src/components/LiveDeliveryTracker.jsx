import { useState, useEffect } from "react";
import { FaMotorcycle, FaCheckCircle, FaPhoneAlt, FaCommentDots, FaClock, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";

const steps = [
  { id: 1, title: "Order Confirmed", time: "Just now" },
  { id: 2, title: "Packing at Dark Store", time: "2 mins ago" },
  { id: 3, title: "Driver Assigned", time: "3 mins ago" },
  { id: 4, title: "Out for Delivery", time: "In Progress" },
  { id: 5, title: "Delivered", time: "ETA 8 Mins" }
];

const LiveDeliveryTracker = ({ orderId = "ORD-8921" }) => {
  const [currentStep, setCurrentStep] = useState(4);
  const [progressPercent, setProgressPercent] = useState(70);
  const [etaSeconds, setEtaSeconds] = useState(480); // 8 minutes
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "driver", text: "Hello! I have picked up your fresh groceries and am on my way." }
  ]);
  const [userMsg, setUserMsg] = useState("");

  // Countdown timer for ETA
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatEta = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    const newMsgs = [...chatMessages, { sender: "user", text: userMsg }];
    setChatMessages(newMsgs);
    setUserMsg("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: "driver", text: "Got it! Reaching your gate in 2 minutes." }
      ]);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-xl my-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live Tracking
            </span>
            <span className="text-xs text-gray-500 font-medium">Order #{orderId}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
            Arriving in <span className="text-emerald-600">{formatEta(etaSeconds)}</span>
          </h3>
        </div>

        {/* ETA TIMER CARD */}
        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl flex items-center gap-3">
          <FaMotorcycle className="text-emerald-600 size-6 animate-bounce" />
          <div>
            <p className="text-[10px] text-emerald-800 font-bold uppercase">Superfast Express</p>
            <p className="text-sm font-black text-gray-900">8 Minute Delivery</p>
          </div>
        </div>
      </div>

      {/* SIMULATED MAP ROUTE VISUAL */}
      <div className="relative h-44 w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
        {/* MAP BACKGROUND PATTERN */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* SIMULATED ROUTE PATH */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1.5 bg-slate-800 rounded-full">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 relative"
          >
            {/* MOVING BIKE ICON */}
            <div className="absolute -right-4 -top-3.5 bg-emerald-500 text-slate-950 p-2 rounded-full shadow-lg animate-pulse">
              <FaMotorcycle size={14} />
            </div>
          </div>
        </div>

        {/* DARK STORE PIN */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center text-xs text-emerald-400 font-bold">
            🏬
          </div>
          <span className="text-[10px] text-slate-400 font-bold mt-1">Dark Store</span>
        </div>

        {/* HOME PIN */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-bold shadow-lg shadow-emerald-500/30">
            🏠
          </div>
          <span className="text-[10px] text-emerald-400 font-bold mt-1">Your Home</span>
        </div>
      </div>

      {/* STEPPER TIMELINE */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
        {steps.map((step) => {
          const isCompleted = step.id <= currentStep;
          return (
            <div
              key={step.id}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isCompleted
                  ? "bg-emerald-50/80 border-emerald-200 text-emerald-950 shadow-2xs"
                  : "bg-gray-50 border-gray-100 text-gray-400"
              }`}
            >
              <div className="flex justify-center mb-1">
                {isCompleted ? (
                  <FaCheckCircle className="text-emerald-600" />
                ) : (
                  <FaClock className="text-gray-300" />
                )}
              </div>
              <p className="text-xs font-bold leading-tight">{step.title}</p>
              <p className="text-[10px] opacity-75 mt-0.5">{step.time}</p>
            </div>
          );
        })}
      </div>

      {/* DRIVER PARTNER INFO CARD */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-base border-2 border-emerald-400">
            RK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-gray-900">Rahul Kumar</h4>
              <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                <FaStar size={9} /> 4.9
              </span>
            </div>
            <p className="text-xs text-gray-500">Delivery Executive • Electric Scooter</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => toast.success("Calling delivery partner Rahul (+91 98765 43210)...")}
            className="flex-1 sm:flex-none bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <FaPhoneAlt className="text-emerald-600" /> Call
          </button>
          <button
            onClick={() => setShowChat((prev) => !prev)}
            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <FaCommentDots /> {showChat ? "Close Chat" : "Live Chat"}
          </button>
        </div>
      </div>

      {/* DRIVER CHAT MODAL */}
      {showChat && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              💬 Chat with Delivery Partner
            </span>
            <span className="text-[10px] text-slate-400">Online</span>
          </div>

          <div className="h-32 overflow-y-auto space-y-2 text-xs p-1">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Type message to driver..."
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-400 cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LiveDeliveryTracker;
