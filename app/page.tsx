"use client";

import { useState, useCallback } from "react";
import { calcFlesch } from "@/lib/flesch";

// ── Types ─────────────────────────────────────────────────────────────────────

type IssueType = "error" | "warn" | "tip";

interface Issue {
  type: IssueType;
  title: string;
  detail: string;
  suggestion?: string;
}

interface RewriteSection {
  label: string;
  text: string;
}

interface CheckResult {
  overallScore: number;
  verdict: string;
  summary: string;
  warmScore: number;
  workingScore: number;
  issues: Issue[];
  rewriteSections: RewriteSection[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CONTENT_TYPES = [
  "Sales web page",
  "Help & support",
  "Customer journey / transactional",
  "Email or letter",
  "Error message",
  "Onboarding / confirmation",
  "Marketing / campaign",
  "Social media",
  "Debt or important comms",
];

const AUDIENCES = [
  "General customers",
  "Existing customers",
  "New / prospective customers",
  "Vulnerable customers",
  "Business customers",
];

// Warm/working targets per content type (warm %)
const WARM_TARGET: Record<string, number> = {
  "Sales web page": 60,
  "Help & support": 30,
  "Customer journey / transactional": 20,
  "Email or letter": 50,
  "Error message": 10,
  "Onboarding / confirmation": 50,
  "Marketing / campaign": 80,
  "Social media": 80,
  "Debt or important comms": 20,
};

// ── Colour helpers ─────────────────────────────────────────────────────────────

function scoreColour(score: number) {
  if (score >= 7) return { bg: "bg-[#1D9E75]", text: "text-[#1D9E75]", ring: "ring-[#1D9E75]" };
  if (score >= 5) return { bg: "bg-[#BA7517]", text: "text-[#BA7517]", ring: "ring-[#BA7517]" };
  return { bg: "bg-[#A32D2D]", text: "text-[#A32D2D]", ring: "ring-[#A32D2D]" };
}

function issueColour(type: IssueType) {
  if (type === "error") return { bg: "bg-[#A32D2D]/8", border: "border-[#A32D2D]/20", text: "text-[#A32D2D]", badge: "pill-error" };
  if (type === "warn") return { bg: "bg-[#BA7517]/8", border: "border-[#BA7517]/20", text: "text-[#BA7517]", badge: "pill-warn" };
  return { bg: "bg-[#0085CA]/8", border: "border-[#0085CA]/20", text: "text-[#0085CA]", badge: "pill-tip" };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <ChevronIcon open={open} />
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100">{children}</div>}
    </div>
  );
}

function ScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const c = scoreColour(score);
  const sizes = { sm: "text-lg font-bold w-9 h-9", md: "text-2xl font-bold w-14 h-14", lg: "text-5xl font-black w-24 h-24" };
  return (
    <div className={`rounded-full ${c.bg} text-white flex items-center justify-center ${sizes[size]} flex-shrink-0`}>
      {score}
    </div>
  );
}

function ToneBar({
  warmScore,
  workingScore,
  contentType,
}: {
  warmScore: number;
  workingScore: number;
  contentType: string;
}) {
  const warmPct = (warmScore / 10) * 100;
  const workingPct = (workingScore / 10) * 100;
  const warmTarget = WARM_TARGET[contentType] ?? 50;

  return (
    <div className="space-y-4 mt-4">
      {/* Warm */}
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-medium text-gray-700">Warm</span>
          <span className="text-gray-500">{warmScore}/10</span>
        </div>
        <div className="relative h-2.5 rounded-full bg-gray-100 overflow-visible">
          <div
            className="h-full rounded-full bg-[#0085CA] transition-all duration-700"
            style={{ width: `${warmPct}%` }}
          />
          {/* target marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gray-400 rounded-full"
            style={{ left: `${warmTarget}%` }}
            title={`Target: ${warmTarget}%`}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">Target: {warmTarget}%</div>
      </div>

      {/* Working */}
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-medium text-gray-700">Working</span>
          <span className="text-gray-500">{workingScore}/10</span>
        </div>
        <div className="relative h-2.5 rounded-full bg-gray-100 overflow-visible">
          <div
            className="h-full rounded-full bg-[#1D9E75] transition-all duration-700"
            style={{ width: `${workingPct}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gray-400 rounded-full"
            style={{ left: `${100 - warmTarget}%` }}
            title={`Target: ${100 - warmTarget}%`}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">Target: {100 - warmTarget}%</div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [copy, setCopy] = useState("");
  const [contentType, setContentType] = useState("");
  const [audience, setAudience] = useState("General customers");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const flesch = copy.length > 0 ? calcFlesch(copy) : null;
  const canSubmit = copy.trim().length > 20 && !loading;

  const handleCheck = useCallback(async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          copy,
          contentType,
          audience,
          fleschAge: flesch?.age ?? 0,
          fleschScore: flesch?.score ?? 0,
          avgSentenceLength: flesch?.avgSentenceLength ?? 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setResult(data as CheckResult);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [canSubmit, copy, contentType, audience, flesch]);

  const handleCopyRewrite = async () => {
    if (!result?.rewriteSections?.length) return;
    const plain = result.rewriteSections.map((s) => s.text).join("\n\n");
    await navigator.clipboard.writeText(plain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen relative flex flex-col"
      style={{
        backgroundImage: "url('/bg-texture.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen items-center justify-center px-6 py-12">
        {/* Header */}
        <header className="w-full max-w-2xl mb-6">
          <div className="flex items-center gap-4">
            <img src="/bg-flame.png" alt="British Gas" className="w-16 h-16 object-contain flex-shrink-0" />
            <h1 className="text-white font-bold text-2xl leading-tight">Tone of Voice Checker</h1>
          </div>
        </header>

        <main className="w-full max-w-2xl space-y-4">

          {/* Input card */}
          <div className="bg-white rounded-3xl shadow-2xl p-7 space-y-5">
            {/* Selectors row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Content type
                </label>
                <div className="relative">
                  <select
                    className="select-field pr-10"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                  >
                    <option value="">Select a type…</option>
                    {CONTENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Audience</label>
                <div className="relative">
                  <select
                    className="select-field pr-10"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                  >
                    {AUDIENCES.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Copy to check</label>
              <textarea
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none
                           focus:outline-none focus:ring-2 focus:ring-[#0085CA] focus:border-transparent
                           transition-all duration-150 min-h-[180px]"
                placeholder="Paste your copy here…"
                value={copy}
                onChange={(e) => setCopy(e.target.value)}
              />
              <div className="flex items-center justify-between mt-1.5">
                <div className="flex gap-3 text-xs text-gray-400">
                  {flesch && copy.trim().length > 20 && (
                    <>
                      <span>Reading age: ~{flesch.age}</span>
                      <span>·</span>
                      <span>Avg sentence: {flesch.avgSentenceLength} words</span>
                      <span>·</span>
                      <span className={flesch.avgSentenceLength > 15 ? "text-[#BA7517] font-medium" : "text-[#1D9E75] font-medium"}>
                        {flesch.avgSentenceLength > 15 ? "Sentences too long" : "Sentence length OK"}
                      </span>
                    </>
                  )}
                </div>
                <span className={`text-xs ${copy.length > 5000 ? "text-[#A32D2D]" : "text-gray-400"}`}>
                  {copy.length} chars
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4">
              <button className="btn-primary flex items-center gap-2" onClick={handleCheck} disabled={!canSubmit}>
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Checking…
                  </>
                ) : (
                  "Check copy"
                )}
              </button>
              {copy.trim().length <= 20 && (
                <span className="text-xs text-gray-400">Add more copy to check (min 20 chars)</span>
              )}
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-white rounded-2xl px-6 py-4 border border-[#A32D2D]/30 text-[#A32D2D] text-sm flex items-start gap-3 shadow-lg">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <strong className="font-semibold">Error: </strong>{error}
              </div>
            </div>
          )}

          {/* ── Results ──────────────────────────────────────────────────────── */}
          {result && (
            <div className="space-y-3">

              {/* 1. Overall panel */}
              <div className="bg-white rounded-3xl shadow-2xl p-6">
                <div className="flex items-start gap-5">
                  <ScoreBadge score={result.overallScore} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h2 className={`text-xl font-bold ${scoreColour(result.overallScore).text}`}>
                      {result.verdict}
                    </h2>
                    <p className="text-gray-600 text-sm mt-2 leading-relaxed">{result.summary}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {result.issues.filter(i => i.type === "error").length > 0 && <span className="pill-error">{result.issues.filter(i => i.type === "error").length} error{result.issues.filter(i => i.type === "error").length !== 1 ? "s" : ""}</span>}
                      {result.issues.filter(i => i.type === "warn").length > 0 && <span className="pill-warn">{result.issues.filter(i => i.type === "warn").length} warning{result.issues.filter(i => i.type === "warn").length !== 1 ? "s" : ""}</span>}
                      {result.issues.filter(i => i.type === "tip").length > 0 && <span className="pill-tip">{result.issues.filter(i => i.type === "tip").length} tip{result.issues.filter(i => i.type === "tip").length !== 1 ? "s" : ""}</span>}
                      {result.issues.length === 0 && <span className="pill-tip">No issues found</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Readability & tone */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <CollapsibleSection title="Readability & tone">
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <div className={`text-3xl font-black ${flesch && flesch.age <= 11 ? "text-[#1D9E75]" : flesch && flesch.age <= 14 ? "text-[#BA7517]" : "text-[#A32D2D]"}`}>
                        ~{flesch?.age ?? result.overallScore}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Reading age</div>
                      <div className="text-xs text-gray-400 mt-0.5">Target: ~9</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <div className={`text-3xl font-black ${flesch && flesch.avgSentenceLength <= 15 ? "text-[#1D9E75]" : "text-[#BA7517]"}`}>
                        {flesch?.avgSentenceLength ?? "—"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Avg sentence length</div>
                      <div className="text-xs text-gray-400 mt-0.5">Target: ≤15 words</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <div className={`text-3xl font-black ${scoreColour(result.overallScore).text}`}>
                        {result.overallScore}/10
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Brand fit score</div>
                      <div className="text-xs text-gray-400 mt-0.5">Overall</div>
                    </div>
                  </div>
                  <ToneBar warmScore={result.warmScore} workingScore={result.workingScore} contentType={contentType} />
                </CollapsibleSection>
              </div>

              {/* 3. Findings */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <CollapsibleSection title={`Findings (${result.issues.length})`}>
                  {result.issues.length === 0 ? (
                    <p className="text-sm text-gray-500 pt-4">No issues found — great work!</p>
                  ) : (
                    <ul className="space-y-3 pt-4">
                      {result.issues.map((issue, i) => {
                        const c = issueColour(issue.type);
                        return (
                          <li key={i} className={`rounded-xl border p-4 ${c.bg} ${c.border}`}>
                            <div className="flex items-start gap-3">
                              <span className={issue.type === "error" ? "pill-error" : issue.type === "warn" ? "pill-warn" : "pill-tip"}>
                                {issue.type}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className={`font-semibold text-sm ${c.text}`}>{issue.title}</p>
                                <p className="text-gray-600 text-sm mt-1 leading-relaxed">{issue.detail}</p>
                                {issue.suggestion && (
                                  <div className="mt-2 p-3 bg-white/60 rounded-lg border border-white/80">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Suggested: </span>
                                    <span className="text-sm text-gray-700 italic">"{issue.suggestion}"</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CollapsibleSection>
              </div>

              {/* 4. Suggested rewrite */}
              {result.rewriteSections?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <CollapsibleSection title="Suggested rewrite">
                    <div className="pt-4 space-y-3">
                      <p className="text-xs text-gray-400 italic">Tone edits only — no new facts have been added.</p>
                      {result.rewriteSections.map((section, i) => (
                        <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
                          <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{section.label}</span>
                          </div>
                          <div className="px-4 py-3 bg-gray-50 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {section.text}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={handleCopyRewrite}
                        className="mt-1 flex items-center gap-2 text-sm font-medium text-[#0085CA] hover:text-[#006ba3] transition-colors"
                      >
                        {copied ? (
                          <>
                            <svg className="w-4 h-4 text-[#1D9E75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-[#1D9E75]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy rewrite
                          </>
                        )}
                      </button>
                    </div>
                  </CollapsibleSection>
                </div>
              )}

            </div>
          )}
        </main>

        {/* How does this work — footnote */}
        <div className="w-full max-w-2xl mt-4">
          <details className="group">
            <summary className="cursor-pointer text-white/60 text-xs font-medium hover:text-white transition-colors select-none list-none flex items-center gap-1.5 justify-center">
              <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              How do we review your copy?
            </summary>

            <div className="mt-3 bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-5 space-y-6 text-sm">

                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Overall score (1–10)</h3>
                  <p className="text-gray-600 leading-relaxed">Your copy is reviewed by AI against British Gas tone of voice guidelines. The score reflects how well it balances warmth, usefulness, and clear writing — 7+ is on-brand, 5–6 needs work, below 5 has significant issues.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Warm score (1–10)</h3>
                  <p className="text-gray-600 leading-relaxed mb-3">Warm copy sounds like a real person talking. Think contractions, direct language, and the occasional grounded British humour rooted in home life.</p>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-[#1D9E75]/30 bg-[#1D9E75]/5 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#1D9E75] mb-1">Good</p>
                      <p className="text-gray-700 italic">"Great. Your Gas Safety Check's all booked in. We'll see you then."</p>
                      <p className="text-gray-500 text-xs mt-1">"Nothing says Happy New Year like a meter reading."</p>
                    </div>
                    <div className="rounded-lg border border-[#A32D2D]/20 bg-[#A32D2D]/5 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#A32D2D] mb-1">Too cold</p>
                      <p className="text-gray-700 italic">"Your Gas Safety Check has been successfully booked."</p>
                      <p className="text-gray-500 text-xs mt-1">Faceless and corporate — no sense of a person behind it.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Working score (1–10)</h3>
                  <p className="text-gray-600 leading-relaxed mb-3">Working copy takes things off the customer's hands. It's specific, action-led, and tells them exactly what happens next — not vague reassurance.</p>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-[#1D9E75]/30 bg-[#1D9E75]/5 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#1D9E75] mb-1">Good</p>
                      <p className="text-gray-700 italic">"Right, let's get that sorted."</p>
                      <p className="text-gray-500 text-xs mt-1">"Your engineer is on the way and will be with you by 12pm."</p>
                    </div>
                    <div className="rounded-lg border border-[#A32D2D]/20 bg-[#A32D2D]/5 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#A32D2D] mb-1">Too passive</p>
                      <p className="text-gray-700 italic">"If you're having issues, we're here to help."</p>
                      <p className="text-gray-500 text-xs mt-1">Vague and uncommitted — doesn't tell the customer what actually happens.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Tone target by content type</h3>
                  <div className="rounded-xl border border-gray-200 overflow-hidden text-xs">
                    <div className="grid grid-cols-3 bg-gray-100 px-4 py-2 font-semibold text-gray-500 uppercase tracking-wider">
                      <span>Content type</span><span className="text-center">Warm</span><span className="text-center">Working</span>
                    </div>
                    {[
                      ["Marketing / campaign",      "80%", "20%"],
                      ["Social media",              "80%", "20%"],
                      ["Sales web page",            "60%", "40%"],
                      ["Email or letter",           "50%", "50%"],
                      ["Onboarding / confirmation", "50%", "50%"],
                      ["Help & support",            "30%", "70%"],
                      ["Customer journey",          "20%", "80%"],
                      ["Debt or important comms",   "20%", "80%"],
                      ["Error message",             "10%", "90%"],
                    ].map(([type, warm, working]) => (
                      <div key={type} className="grid grid-cols-3 px-4 py-2 border-t border-gray-100 text-gray-600">
                        <span>{type}</span>
                        <span className="text-center text-[#0085CA] font-medium">{warm}</span>
                        <span className="text-center text-[#1D9E75] font-medium">{working}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Reading age</h3>
                  <p className="text-gray-600 leading-relaxed mb-2">Calculated using the <strong>SMOG index</strong> (Simple Measure of Gobbledygook). Unlike other readability formulas that average syllables across all words, SMOG counts every word with 3 or more syllables individually. That means words like <em>installations</em> (4), <em>assessment</em> (3), and <em>rigorous</em> (3) each directly raise the score — they can't be hidden by surrounding simple words.</p>
                  <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-xs text-gray-600 font-mono">
                    SMOG grade = 3 + √(polysyllabic words × 30 ÷ sentences)<br />
                    Reading age = SMOG grade + 5
                  </div>
                  <p className="text-gray-600 leading-relaxed mt-2">We aim for a reading age of around 9 for most British Gas copy.</p>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">Note: SMOG is most accurate with 10+ sentences. For very short copy — a single headline or CTA — treat the score as a rough guide. It also can't detect conceptual complexity, so jargon like <em>kWh</em> (1 syllable) won't be flagged even though customers may not know what it means.</p>
                </div>

              </div>
            </div>
          </details>
        </div>

        <footer className="w-full max-w-2xl mt-4 text-center text-xs space-y-1">
          <p className="text-white/30">British Gas internal tool · not for external use</p>
          <p className="text-white/60 font-medium">Have feedback? <a href="mailto:nick.peasant@britishgas.co.uk" className="hover:text-white underline transition-colors">Let Nick know</a></p>
        </footer>
      </div>
    </div>
  );
}
