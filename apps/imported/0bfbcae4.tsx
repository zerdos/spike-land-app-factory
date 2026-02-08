import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  X,
  AlertCircle,
  ChevronRight,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  const BEFORE_PRICE = 100;
  const AFTER_PRICE = 104;
  const PERCENT_INCREASE =
    (((AFTER_PRICE - BEFORE_PRICE) / BEFORE_PRICE) * 100).toFixed(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      {/* Background UI Mockup */}
      <div className="max-w-md w-full space-y-4 sm:space-y-6 opacity-40 select-none pointer-events-none">
        <div className="h-36 sm:h-48 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="h-4 w-1/3 bg-slate-100 rounded" />
          <div className="h-8 w-2/3 bg-slate-100 rounded" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-14 sm:h-20 bg-slate-50 rounded-lg" />
            <div className="h-14 sm:h-20 bg-slate-50 rounded-lg" />
            <div className="h-14 sm:h-20 bg-slate-50 rounded-lg" />
          </div>
        </div>
        <div className="h-48 sm:h-64 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="h-4 w-1/2 bg-slate-100 rounded mb-3 sm:mb-4" />
          <div className="space-y-2 sm:space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 sm:h-10 bg-slate-50 rounded flex items-center px-3"
              >
                <div className="h-4 w-4 bg-slate-200 rounded-full mr-3" />
                <div className="h-2 w-full bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(true)}
          className="mt-6 sm:mt-8 px-5 sm:px-6 py-3 bg-indigo-600 text-white rounded-full font-medium shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm sm:text-base"
        >
          <AlertCircle size={18} />
          View Price Update
        </motion.button>
      )}

      {/* Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Bottom Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
          >
            <div className="bg-white w-full max-w-xl rounded-t-[28px] sm:rounded-t-[32px] shadow-2xl border-t border-slate-200 max-h-[92vh] flex flex-col">
              {/* Handle Bar */}
              <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 sm:w-12 h-1.5 bg-slate-200 rounded-full cursor-grab active:cursor-grabbing" />
              </div>

              {/* Scrollable Content */}
              <div className="px-4 sm:px-6 pb-6 sm:pb-10 pt-2 sm:pt-4 overflow-y-auto overscroll-contain">
                {/* Header */}
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="p-2 sm:p-2.5 bg-amber-50 rounded-xl">
                      <TrendingUp className="text-amber-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                        Subscription Update
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        Starting next billing cycle
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors -mr-1"
                  >
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                {/* Price Comparison Card */}
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100 mb-5 sm:mb-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Current Price
                      </p>
                      <div className="text-xl sm:text-2xl font-bold text-slate-400 line-through">
                        ${BEFORE_PRICE}
                      </div>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <div className="h-px w-6 sm:w-8 bg-slate-200 mb-2" />
                      <ArrowUpRight className="text-rose-500" size={18} />
                    </div>

                    <div className="space-y-1 text-right">
                      <p className="text-[10px] sm:text-xs font-semibold text-rose-500 uppercase tracking-wider">
                        New Price
                      </p>
                      <div className="text-3xl sm:text-4xl font-black text-slate-900">
                        ${AFTER_PRICE}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600">
                      <Calendar size={14} className="shrink-0" />
                      <span className="text-xs sm:text-sm">
                        Effective July 1st, 2024
                      </span>
                    </div>
                    <div className="px-2.5 sm:px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">
                      +{PERCENT_INCREASE}% Change
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-8">
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    To continue providing world-class features and maintaining
                    high-speed server infrastructure, we&apos;re adjusting our
                    monthly subscription rate.
                  </p>
                  <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    <ShieldCheck
                      className="text-indigo-600 mt-0.5 shrink-0"
                      size={16}
                    />
                    <p className="text-xs sm:text-sm text-indigo-900">
                      <strong>Price Lock:</strong> As a loyal member, you can
                      lock in the current{" "}
                      <span className="font-bold text-indigo-700">
                        ${BEFORE_PRICE}
                      </span>{" "}
                      rate for the next 12 months by switching to annual billing
                      today.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3.5 sm:py-4 px-5 sm:px-6 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    Lock Current Rate
                    <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3.5 sm:py-4 px-5 sm:px-6 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm sm:text-base"
                  >
                    I Understand
                  </button>
                </div>

                <p className="text-center mt-4 sm:mt-6 text-[10px] sm:text-xs text-slate-400 pb-[env(safe-area-inset-bottom)]">
                  Questions? Contact our{" "}
                  <span className="underline cursor-pointer">Support Team</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
