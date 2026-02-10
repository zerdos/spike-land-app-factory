import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  TrendingUp,
  X,
  AlertCircle,
  ChevronRight,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans text-foreground">
      {/* Background UI Mockup */}
      <div className="max-w-md w-full space-y-4 sm:space-y-6 opacity-40 select-none pointer-events-none">
        <div className="h-36 sm:h-48 bg-card rounded-2xl shadow-sm border border-border p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="h-8 w-2/3 bg-muted rounded" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-14 sm:h-20 bg-muted/50 rounded-lg" />
            <div className="h-14 sm:h-20 bg-muted/50 rounded-lg" />
            <div className="h-14 sm:h-20 bg-muted/50 rounded-lg" />
          </div>
        </div>
        <div className="h-48 sm:h-64 bg-card rounded-2xl shadow-sm border border-border p-4 sm:p-6">
          <div className="h-4 w-1/2 bg-muted rounded mb-3 sm:mb-4" />
          <div className="space-y-2 sm:space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 sm:h-10 bg-muted/50 rounded flex items-center px-3"
              >
                <div className="h-4 w-4 bg-muted-foreground/20 rounded-full mr-3" />
                <div className="h-2 w-full bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Trigger Button */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 sm:mt-8"
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="px-5 sm:px-6 py-3 rounded-full font-medium shadow-lg flex items-center gap-2 text-sm sm:text-base h-auto"
          >
            <AlertCircle size={18} />
            View Price Update
          </Button>
        </motion.div>
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
            role="dialog"
            aria-label="Subscription price update"
          >
            <div className="bg-card w-full max-w-xl rounded-t-[28px] sm:rounded-t-[32px] shadow-2xl border-t border-border max-h-[92vh] flex flex-col">
              {/* Handle Bar */}
              <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 sm:w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
              </div>

              {/* Scrollable Content */}
              <div className="px-4 sm:px-6 pb-6 sm:pb-10 pt-2 sm:pt-4 overflow-y-auto overscroll-contain">
                {/* Header */}
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="p-2 sm:p-2.5 bg-amber-500/10 rounded-xl">
                      <TrendingUp className="text-amber-500" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground">
                        Subscription Update
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        Starting next billing cycle
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close dialog"
                    className="p-2 hover:bg-muted rounded-full transition-colors -mr-1"
                  >
                    <X size={20} className="text-muted-foreground" />
                  </button>
                </div>

                {/* Price Comparison Card */}
                <div className="bg-muted/50 rounded-2xl p-4 sm:p-6 border border-border mb-5 sm:mb-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Current Price
                      </p>
                      <div className="text-xl sm:text-2xl font-bold text-muted-foreground line-through">
                        ${BEFORE_PRICE}
                      </div>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <div className="h-px w-6 sm:w-8 bg-border mb-2" />
                      <ArrowUpRight className="text-destructive" size={18} />
                    </div>

                    <div className="space-y-1 text-right">
                      <p className="text-[10px] sm:text-xs font-semibold text-destructive uppercase tracking-wider">
                        New Price
                      </p>
                      <div className="text-3xl sm:text-4xl font-black text-foreground">
                        ${AFTER_PRICE}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                      <Calendar size={14} className="shrink-0" />
                      <span className="text-xs sm:text-sm">
                        Effective next billing cycle
                      </span>
                    </div>
                    <div className="px-2.5 sm:px-3 py-1 bg-destructive/10 text-destructive rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">
                      +{PERCENT_INCREASE}% Change
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-8">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    To continue providing world-class features and maintaining
                    high-speed server infrastructure, we&apos;re adjusting our
                    monthly subscription rate.
                  </p>
                  <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <ShieldCheck
                      className="text-primary mt-0.5 shrink-0"
                      size={16}
                    />
                    <p className="text-xs sm:text-sm text-foreground">
                      <strong>Price Lock:</strong> As a loyal member, you can
                      lock in the current{" "}
                      <span className="font-bold text-primary">
                        ${BEFORE_PRICE}
                      </span>{" "}
                      rate for the next 12 months by switching to annual billing
                      today.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl font-bold h-auto text-sm sm:text-base"
                  >
                    Lock Current Rate
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl font-bold h-auto text-sm sm:text-base"
                  >
                    I Understand
                  </Button>
                </div>

                <p className="text-center mt-4 sm:mt-6 text-[10px] sm:text-xs text-muted-foreground pb-[env(safe-area-inset-bottom)]">
                  Questions? Contact our{" "}
                  <span className="underline cursor-pointer hover:text-foreground transition-colors">Support Team</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
