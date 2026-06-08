import React, { useState } from "react";
import { BookOpen, ShieldCheck, Scale, AlertTriangle, ChevronRight, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function EducationalGuide() {
  const [activeTab, setActiveTab] = useState<"overview" | "standards" | "ratios" | "purification">("overview");

  return (
    <div id="educational-guide" className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Tab bar header */}
      <div className="bg-slate-50/50 border-b border-slate-200/80 p-4 sm:px-6 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <h2 className="font-heading text-lg font-semibold text-slate-800">Shariah Screening Guide</h2>
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === "overview"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("standards")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === "standards"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Standards
          </button>
          <button
            onClick={() => setActiveTab("ratios")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === "ratios"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Financial Ratios
          </button>
          <button
            onClick={() => setActiveTab("purification")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === "purification"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Purification
          </button>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <p className="text-slate-600 text-sm leading-relaxed">
                Investing in global equities can be aligned with Islamic principles by applying a system of ethical screens. 
                Shariah-compliant investing excludes companies involved in prohibited activities and filters out those with excessive leverage or high cash/interest asset accumulation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="border border-emerald-100 bg-emerald-50/25 rounded-xl p-4 flex gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 h-fit">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm mb-1">Sector / Business Screening</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Filters out sectors classified as non-compliant (e.g. alcohol, gambling, conventional banking, pig-farming products, tobacco, weapons, adult entertainment).
                    </p>
                  </div>
                </div>

                <div className="border border-blue-100 bg-blue-50/25 rounded-xl p-4 flex gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600 h-fit">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm mb-1">Financial Ratio Screening</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Ensures debt, liquid interest-bearing securities, and accounts receivable remain within reasonable bounds (usually less than 33% of appropriate base).
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "standards" && (
            <motion.div
              key="standards"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <h3 className="font-heading font-semibold text-slate-800 text-sm mb-2">Primary Global Methodologies</h3>
              <div className="space-y-3">
                <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/30">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-semibold text-slate-800 text-xs px-2 py-0.5 bg-slate-200/60 rounded text-mono">AAOIFI</span>
                    <span className="text-[11px] text-slate-500 font-medium">Standard for Islamic Financial Institutions</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Excludes companies with non-compliant revenue exceeding <strong>5%</strong>. Debt-to-Equity/Assets/MarketCap, Cash-to-Equity/Assets, and Receivables-to-Equity/Assets ratios must be strictly below <strong>33%</strong> calculated on average or spot Market Cap.
                  </p>
                </div>

                <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/30">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-semibold text-slate-800 text-xs px-2 py-0.5 bg-slate-200/60 rounded text-mono">S&P Shariah</span>
                    <span className="text-[11px] text-slate-500 font-medium">Standard & Poor's Islamic Indices</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Uses **Total Assets** as the denominator for all screens (rather than market capitalization) to reduce volatility. Debt-to-Assets ratio <strong className="text-indigo-600">33.3%</strong>, cash ratio <strong className="text-indigo-600">33.3%</strong>, and accounts receivable/assets <strong className="text-indigo-700">49%</strong>.
                  </p>
                </div>

                <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/30">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-semibold text-slate-800 text-xs px-2 py-0.5 bg-slate-200/60 rounded text-mono">Dow Jones (DJIM)</span>
                    <span className="text-[11px] text-slate-500 font-medium">Dow Jones Islamic Market</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Filters using **Trailing 24-Month Average Market Capitalization** as the denominator denominator. Same 33% threshold rules for Debt, Cash/Yielding, and Receivables.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "ratios" && (
            <motion.div
              key="ratios"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="text-emerald-600 shrink-0 font-mono text-xs font-semibold bg-emerald-50 px-2 py-1 h-fit rounded">Ratio 1</div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-xs">Debt screening ratio</h4>
                    <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                      Measures interest-bearing leverage. Standard: <strong className="text-rose-600">{"< 33%"}</strong> of Market Capitalization or Total Assets. Un-serviced debts are viewed cautiously as they breed interest-based leverage.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="text-emerald-600 shrink-0 font-mono text-xs font-semibold bg-emerald-50 px-2 py-1 h-fit rounded">Ratio 2</div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-xs">Interest-bearing cash assets ratio</h4>
                    <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                      Measures liquidity. Cash in interest accounts and short-term debt securities must be <strong className="text-rose-600">{"< 33%"}</strong>. Cash cannot earn conventional, risk-free interest.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="text-emerald-600 shrink-0 font-mono text-xs font-semibold bg-emerald-50 px-2 py-1 h-fit rounded">Ratio 3</div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-xs">Accounts Receivables ratio</h4>
                    <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                      Measures receivables. Trading debt must not exceed <strong className="text-rose-600">{"< 33%"}</strong> (or 49% depending on standards like S&P) as debt cannot be traded for deferred value above par values.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "purification" && (
            <motion.div
              key="purification"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <p className="text-slate-600 text-sm leading-relaxed">
                If a company is cleared as compliant overall but derives a small percentage (less than 5%) of its revenues from non-halal activities (e.g., interest income on cash holdings or incidental logistics representing side lines), investors must still <strong>"purify"</strong> their investment.
              </p>
              
              <div className="bg-amber-50/50 border border-amber-200/80 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-amber-800 text-xs font-semibold">How to purify dividends:</h4>
                  <p className="text-amber-700/90 text-[11.5px] leading-relaxed">
                    Multiply your total received dividend payment by the non-compliant revenue percentage. That exact dollar amount must be donated to charitable causes strictly without expecting spiritual rewards or tax tax benefits.
                  </p>
                  <p className="text-amber-950 font-medium text-[11px] mt-1">
                    Purification Formula: Dividend Donated = Dividend Received × Non-Compliant Percentage
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
