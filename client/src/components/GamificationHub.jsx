import { useState, useEffect } from "react";
import { FaTrophy, FaCoins, FaFire, FaGift, FaMedal, FaCrown, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const wheelPrizes = ["50 Coins", "10% OFF", "Free Delivery", "100 Coins", "Mystery Gift", "25 Coins"];

const GamificationHub = () => {
  const [coins, setCoins] = useState(() => {
    return Number(localStorage.getItem("blinkey_coins")) || 250;
  });
  const [streak, setStreak] = useState(4);
  const [level, setLevel] = useState("Gold Member");
  const [spinning, setSpinning] = useState(false);
  const [spinDeg, setSpinDeg] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);
  const [claimedDaily, setClaimedDaily] = useState(false);

  useEffect(() => {
    localStorage.setItem("blinkey_coins", coins.toString());
  }, [coins]);

  const handleClaimDailyReward = () => {
    if (claimedDaily) return;
    setCoins((prev) => prev + 50);
    setStreak((prev) => prev + 1);
    setClaimedDaily(true);
    toast.success("🎉 Daily Login Reward claimed! +50 Blinkey Coins & +1 Day Streak!");
  };

  const handleSpinWheel = () => {
    if (spinning) return;
    if (coins < 20) {
      toast.error("Need at least 20 Blinkey Coins to spin!");
      return;
    }

    setCoins((prev) => prev - 20);
    setSpinning(true);
    setWonPrize(null);

    const randomDegrees = 1440 + Math.floor(Math.random() * 360);
    setSpinDeg((prev) => prev + randomDegrees);

    setTimeout(() => {
      setSpinning(false);
      const prizeIndex = Math.floor(Math.random() * wheelPrizes.length);
      const prize = wheelPrizes[prizeIndex];
      setWonPrize(prize);

      if (prize.includes("Coins")) {
        const rewardCoins = parseInt(prize) || 50;
        setCoins((prev) => prev + rewardCoins);
      }
      toast.success(`🎰 Congratulations! You won: ${prize}`);
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl my-8 relative overflow-hidden">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

      {/* HEADER */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/20 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <FaTrophy className="text-yellow-200" /> Blinkey Loyalty Rewards
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            Spin, Win & Earn Cashback!
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1">
            Earn coins on every order, level up your badge, and unlock instant discounts.
          </p>
        </div>

        {/* REWARDS STATS PILLS */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-300/30 flex items-center gap-2">
            <FaCoins className="text-amber-400 size-5 animate-pulse" />
            <div>
              <p className="text-[10px] text-amber-200 font-bold uppercase">Coins Balance</p>
              <p className="text-lg font-black text-white leading-none">{coins}</p>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-300/30 flex items-center gap-2">
            <FaCrown className="text-yellow-400 size-5" />
            <div>
              <p className="text-[10px] text-amber-200 font-bold uppercase">Member Tier</p>
              <p className="text-sm font-extrabold text-amber-300 leading-none">{level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* BODY GRID */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* LEFT: DAILY STREAK & LEVEL REWARDS */}
        <div className="space-y-4">
          <div className="bg-slate-900/70 backdrop-blur-md p-5 rounded-2xl border border-amber-300/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold uppercase text-amber-300">
                <FaFire className="text-orange-400" /> {streak}-Day Order Streak
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded font-bold">
                Level 2 Member
              </span>
            </div>

            <p className="text-xs text-amber-100/90">
              Keep ordering daily to maintain your streak and unlock <strong>Free Delivery Forever</strong>!
            </p>

            {/* STREAK DAYS PROGRESS */}
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div
                  key={day}
                  className={`p-2 rounded-xl text-center text-xs font-bold border transition-all ${
                    day <= streak
                      ? "bg-amber-400 text-slate-950 border-amber-300"
                      : "bg-slate-800/80 text-amber-200/50 border-white/10"
                  }`}
                >
                  <p className="text-[9px] uppercase font-normal">Day {day}</p>
                  <p className="mt-0.5">{day <= streak ? "✓" : "+20"}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleClaimDailyReward}
              disabled={claimedDaily}
              className={`w-full mt-2 py-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                claimedDaily
                  ? "bg-slate-800 text-amber-300 cursor-not-allowed"
                  : "bg-amber-400 hover:bg-amber-300 text-slate-950 hover:shadow-lg active:scale-95"
              }`}
            >
              {claimedDaily ? (
                <>
                  <FaCheckCircle /> Daily Reward Claimed (+50 Coins)
                </>
              ) : (
                <>
                  <FaGift /> Claim Today's 50 Coins Reward
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT: SPIN THE WHEEL */}
        <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-amber-300/30 flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300 uppercase">
            <FaMedal /> Spin Wheel of Fortune (20 Coins/Spin)
          </div>

          {/* ROTATING WHEEL VISUAL */}
          <div className="relative w-40 h-40 flex items-center justify-center my-2">
            <div
              style={{ transform: `rotate(${spinDeg}deg)` }}
              className="w-full h-full rounded-full border-4 border-amber-400 bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 shadow-xl transition-transform duration-[3000ms] ease-out flex items-center justify-center relative overflow-hidden"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-300 z-10 flex items-center justify-center text-amber-400 font-extrabold text-[10px]">
                SPIN
              </div>
            </div>
            {/* WHEEL POINTER */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-[14px] border-t-amber-300 z-20" />
          </div>

          {wonPrize && (
            <div className="bg-amber-400/20 border border-amber-300 text-amber-200 px-4 py-1.5 rounded-xl text-xs font-bold animate-bounce">
              🎉 You Won: {wonPrize}!
            </div>
          )}

          <button
            onClick={handleSpinWheel}
            disabled={spinning}
            className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3 rounded-xl text-xs transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            {spinning ? "Spinning Wheel..." : "Spin Now for 20 Coins"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamificationHub;
