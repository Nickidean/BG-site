"use client";

import { useState } from "react";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────────────────────

type FuelType = "dual" | "gas" | "electric";
type SmartDevice = "heat_pump" | "ev" | "solar" | "battery";
type TariffType = "fix" | "var";

const CTA = "#AAFF1F";

// ── Nav ───────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ background: "#001029", padding: "8px 32px", display: "flex", gap: 24 }}>
        {["Offers", "Business", "Landlord", "Accessibility toolbar"].map((l) => (
          <a key={l} href="#" style={{ color: "#83B5FF", fontSize: 12, textDecoration: "none" }}>{l}</a>
        ))}
      </div>
      <div style={{ background: "#0b1f3a", padding: "0 32px", display: "flex", alignItems: "center", height: 64, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Image src="/bg-logo.png" alt="British Gas" width={120} height={40} style={{ objectFit: "contain" }} />
        </div>
        <nav style={{ display: "flex", gap: 28, flex: 1, justifyContent: "center" }}>
          {["Energy", "Products", "Servicing", "Repairs", "Cover", "Help"].map((l) => (
            <a key={l} href="#" className="nav-link">{l}</a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", padding: 4, display: "flex" }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></svg>
          </button>
          <button style={{ background: CTA, color: "#0b1f3a", border: "none", borderRadius: 24, padding: "9px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Login</button>
        </div>
      </div>
    </header>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
      {[1, 2, 3, 4].map((n) => (
        <div key={n} style={{ height: 4, flex: 1, borderRadius: 4, background: n <= step ? CTA : "rgba(255,255,255,0.2)", transition: "background 0.3s" }} />
      ))}
    </div>
  );
}

// ── Step 1: Address ───────────────────────────────────────────────────────────

function Step1({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 16px 64px", minHeight: "calc(100vh - 100px)", position: "relative", background: "radial-gradient(ellipse at 65% 50%, #0d3068 0%, #071628 100%)" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 560, position: "relative", zIndex: 1 }}>
        <ProgressBar step={1} />
        <div style={{ background: "#1a4fd6", borderRadius: 20, padding: "36px 32px 32px" }}>
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.65)", fontSize: 13, marginBottom: 8 }}>Step 1 of 4</div>
          <div style={{ textAlign: "center", color: "#fff", fontSize: 26, fontWeight: 700, marginBottom: 28 }}>Let&apos;s find your address</div>
          <div style={{ position: "relative", marginBottom: 14 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#0b1f3a", opacity: 0.4, display: "flex" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            </span>
            <input type="text" defaultValue="DT63HY" style={{ display: "block", width: "100%", padding: "14px 14px 14px 38px", borderRadius: 10, border: "none", background: "#fff", fontSize: 15, color: "#0b1f3a", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ position: "relative", marginBottom: 4 }}>
            <select defaultValue="24" style={{ display: "block", width: "100%", padding: "14px 40px 14px 14px", borderRadius: 10, border: "none", background: "#fff", fontSize: 15, color: "#0b1f3a", outline: "none", appearance: "none", boxSizing: "border-box" }}>
              <option value="">Select address</option>
              <option value="24">24 Millstream, Maidenhead Rd</option>
              <option value="12">12 Millstream, Maidenhead Rd</option>
              <option value="8">8 Millstream, Maidenhead Rd</option>
            </select>
            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#0b1f3a", opacity: 0.5, display: "flex" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <button onClick={onNext} style={{ padding: "14px 28px", background: CTA, color: "#0b1f3a", border: "none", borderRadius: 24, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Choose this address
            </button>
          </div>
        </div>
        <TrustpilotBadge />
      </div>
    </div>
  );
}

// ── Step 2: Fuel ──────────────────────────────────────────────────────────────

const FUEL_OPTIONS: { id: FuelType; label: string }[] = [
  { id: "dual", label: "Gas & Electricity" },
  { id: "gas", label: "Gas only" },
  { id: "electric", label: "Electricity only" },
];

const SMART_OPTIONS: { id: SmartDevice; emoji: string; label: string }[] = [
  { id: "heat_pump", emoji: "🔥", label: "Heat pump" },
  { id: "ev", emoji: "🚗", label: "Electric Vehicle" },
  { id: "solar", emoji: "☀️", label: "Solar panels" },
  { id: "battery", emoji: "🔋", label: "Battery" },
];

function Step2({ fuel, setFuel, smartDevices, setSmartDevices, onNext, onBack }: {
  fuel: FuelType; setFuel: (f: FuelType) => void;
  smartDevices: Set<SmartDevice>; setSmartDevices: (s: Set<SmartDevice>) => void;
  onNext: () => void; onBack: () => void;
}) {
  function toggleSmart(id: SmartDevice) {
    const next = new Set(smartDevices);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSmartDevices(next);
  }
  return (
    <StepShell step={2} title="What fuel do you need?" onBack={onBack} onNext={onNext}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {FUEL_OPTIONS.map(({ id, label }) => {
          const sel = fuel === id;
          return (
            <div key={id} onClick={() => setFuel(id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderRadius: 10, cursor: "pointer", fontSize: 15, color: "#fff", border: sel ? `2px solid ${CTA}` : "2px solid rgba(255,255,255,0.15)", background: sel ? "rgba(170,255,31,0.1)" : "rgba(255,255,255,0.08)" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, border: sel ? `2px solid ${CTA}` : "2px solid rgba(255,255,255,0.4)", background: sel ? CTA : "transparent" }} />
              {label}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>
        Do you have any smart products? <span style={{ color: "rgba(255,255,255,0.4)" }}>(optional)</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {SMART_OPTIONS.map(({ id, emoji, label }) => {
          const on = smartDevices.has(id);
          return (
            <div key={id} onClick={() => toggleSmart(id)} style={{ padding: "11px 10px", borderRadius: 10, cursor: "pointer", fontSize: 14, color: "#fff", border: on ? `2px solid ${CTA}` : "2px solid rgba(255,255,255,0.15)", background: on ? "rgba(170,255,31,0.1)" : "rgba(255,255,255,0.08)" }}>
              {emoji} {label}
            </div>
          );
        })}
      </div>
    </StepShell>
  );
}

// ── Step 3: Usage ─────────────────────────────────────────────────────────────

function Step3({ elec, setElec, gas, setGas, onNext, onBack }: {
  elec: number; setElec: (v: number) => void;
  gas: number; setGas: (v: number) => void;
  onNext: () => void; onBack: () => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [elecDraft, setElecDraft] = useState(String(elec));
  const [gasDraft, setGasDraft] = useState(String(gas));
  function saveUsage() { setElec(parseInt(elecDraft) || 1800); setGas(parseInt(gasDraft) || 6700); setEditOpen(false); }

  return (
    <StepShell step={3} title="How much energy do you use a year?" onBack={onBack} onNext={onNext}>
      <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 18, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, textAlign: "center", marginBottom: 14, color: "#fff" }}>We&apos;ve found the energy usage at the property</div>
        <URow label="Address" value="24 Millstream, Maidenhead Rd" border />
        <URow label="Electricity per year" value={`${elec.toLocaleString()} kWh`} border />
        <URow label="Gas per year" value={`${gas.toLocaleString()} kWh`} />
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 10 }}>We&apos;ve used the latest yearly energy estimate for this property.</div>
      </div>

      <button
        onClick={() => setEditOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "rgba(255,255,255,0.55)", fontSize: 13, cursor: "pointer", padding: "4px 0", textDecoration: "underline", textUnderlineOffset: 3 }}
      >
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Edit usage
      </button>

      {editOpen && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Electricity (kWh)</div>
              <input type="number" value={elecDraft} onChange={e => setElecDraft(e.target.value)} style={{ width: "100%", padding: "11px 12px", borderRadius: 8, border: "none", background: "#fff", fontSize: 14, color: "#0b1f3a", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Gas (kWh)</div>
              <input type="number" value={gasDraft} onChange={e => setGasDraft(e.target.value)} style={{ width: "100%", padding: "11px 12px", borderRadius: 8, border: "none", background: "#fff", fontSize: 14, color: "#0b1f3a", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          <button onClick={saveUsage} style={{ display: "block", width: "100%", padding: 13, background: CTA, color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Save usage</button>
        </div>
      )}
    </StepShell>
  );
}

function URow({ label, value, border }: { label: string; value: string; border?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 14, borderBottom: border ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
      <span style={{ color: "#93c5fd" }}>{label}</span>
      <span style={{ fontWeight: 600, color: "#fff" }}>{value}</span>
    </div>
  );
}

// ── Step 4: Tariffs ───────────────────────────────────────────────────────────

function Step4({ elec, gas, onBack, onSelectTariff }: {
  elec: number; gas: number; onBack: () => void; onSelectTariff: (t: TariffType) => void;
}) {
  const [allRatesOpen, setAllRatesOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div style={{ flex: 1, padding: "48px 32px 64px", maxWidth: 1100, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <h1 style={{ color: "#fff", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, marginBottom: 20, lineHeight: 1.1 }}>Your tariff options</h1>

      {/* Summary */}
      <div style={{ marginBottom: 36, fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 2.2 }}>
        <div><span style={{ color: "rgba(255,255,255,0.45)" }}>Address: </span><span style={{ color: "#fff" }}>24 Millstream, Maidenhead Rd, Windsor, Berkshire, SL4 5GD</span></div>
        <div><span style={{ color: "rgba(255,255,255,0.45)" }}>Fuel type: </span><span style={{ color: "#fff" }}>Gas and electricity</span></div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>Energy usage: </span>
          <span style={{ color: "#fff" }}>Electricity: {elec.toLocaleString()} kWh &nbsp;·&nbsp; Gas: {gas.toLocaleString()} kWh</span>
          &nbsp;&nbsp;<span onClick={onBack} style={{ color: CTA, cursor: "pointer", textDecoration: "underline" }}>Edit</span>
        </div>
      </div>

      {/* Cards — unequal weighting, suggestion first */}
      <div className="tariff-grid-step4">
        <SuggestionCard
          ratesOpen={allRatesOpen}
          onToggleRates={() => setAllRatesOpen(o => !o)}
          onSelect={() => onSelectTariff("fix")}
          ratesPanel={<RatesPanel elecUnit="25.79p per kWh" elecStanding="47.632p per day" elecExit="£75 per fuel" gasUnit="6.642p per kWh" gasStanding="28.262p per day" gasExit="£75 per fuel" />}
        />
        <AlternativeCard
          ratesOpen={allRatesOpen}
          onToggleRates={() => setAllRatesOpen(o => !o)}
          onSelect={() => onSelectTariff("var")}
          ratesPanel={<RatesPanel elecUnit="24.936p per kWh" elecStanding="53.937p per day" elecExit="£0" gasUnit="5.673p per kWh" gasStanding="28.744p per day" gasExit="£0" />}
        />
      </div>

      {/* Help me choose trigger */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginBottom: 14 }}>Still not sure which one&apos;s right for you?</div>
        <button
          onClick={() => setHelpOpen(true)}
          style={{ padding: "14px 36px", background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.35)", borderRadius: 28, fontSize: 15, fontWeight: 600, cursor: "pointer" }}
        >
          Help me choose
        </button>
      </div>

      <HelpPanel
        open={helpOpen}
        onSelectTariff={(t) => { onSelectTariff(t); setHelpOpen(false); }}
        onClose={() => setHelpOpen(false)}
      />
    </div>
  );
}

// ── Suggestion card (Fix & Fall) ─────────────────────────────────────────────

function SuggestionCard({ ratesOpen, onToggleRates, onSelect, ratesPanel }: {
  ratesOpen: boolean; onToggleRates: () => void; onSelect: () => void; ratesPanel: React.ReactNode;
}) {
  const [exitOpen, setExitOpen] = useState(false);

  return (
    <div
      style={{
        background: "rgba(10,30,80,0.7)",
        border: `2px solid ${CTA}`,
        borderRadius: 20,
        padding: "40px 32px 28px",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(8px)",
        position: "relative",
        boxShadow: `0 0 40px rgba(170,255,31,0.08)`,
      }}
    >
      {/* Badge */}
      <div style={{
        position: "absolute", top: -14, left: 28,
        background: CTA, color: "#0b1f3a",
        fontSize: 11, fontWeight: 800,
        padding: "5px 18px", borderRadius: 20,
        whiteSpace: "nowrap", letterSpacing: "0.06em", textTransform: "uppercase",
      }}>
        Our suggestion
      </div>

      {/* Name */}
      <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Fix &amp; Fall tariff</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>Peace of mind, without the usual catch.</div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 56, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-1px" }}>£103.28</span>
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Monthly estimate</div>

      {/* Body */}
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.75, marginBottom: 16, flex: 1 }}>
        Your rate&apos;s fixed for 12 months, so a price rise won&apos;t touch you. And if prices fall, yours falls too. You get certainty now, with a bit of upside if the market drops.
      </p>

      {/* Trade-off line */}
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 20 }}>
        It&apos;s around £5 a month more than our variable tariff today, with a £75 per fuel charge if you leave early. That&apos;s the cost of locking in your protection.
      </p>

      {/* Meta */}
      <div style={{ fontSize: 13, marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#60a5fa" }}>Duration:</span>
        <span style={{ color: "#fff", fontWeight: 600 }}>12 months</span>
      </div>
      <div style={{ fontSize: 13, marginBottom: 28, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#60a5fa" }}>Early exit fee:</span>
        <span style={{ color: "#fff", fontWeight: 600 }}>£75 per fuel</span>
      </div>

      {/* Primary CTA */}
      <button
        onClick={onSelect}
        style={{ display: "block", width: "100%", padding: "16px", background: CTA, color: "#0b1f3a", border: "none", borderRadius: 28, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}
      >
        Select this tariff
      </button>

      {/* Exit fee objection handler */}
      <button
        onClick={() => setExitOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "10px 0", background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer", marginBottom: 4 }}
      >
        Worried about the £75 exit fee?
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          {exitOpen ? <path d="M6 3L11 9H1L6 3Z"/> : <path d="M6 9L1 3H11L6 9Z"/>}
        </svg>
      </button>
      {exitOpen && (
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 14px", marginBottom: 10, fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>
          It only applies if you leave before your 12 months are up. Stay the year and there&apos;s nothing to pay. And because your rate drops when prices fall, you&apos;d rarely have a reason to leave early.
        </div>
      )}

      {/* View rates */}
      <button onClick={onToggleRates} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", padding: "12px", background: "transparent", color: "rgba(255,255,255,0.55)", border: "none", fontSize: 14, cursor: "pointer" }}>
        View rates
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          {ratesOpen ? <path d="M6 3L11 9H1L6 3Z"/> : <path d="M6 9L1 3H11L6 9Z"/>}
        </svg>
      </button>
      {ratesOpen && ratesPanel}
    </div>
  );
}

// ── Alternative card (Standard Variable) ─────────────────────────────────────

function AlternativeCard({ ratesOpen, onToggleRates, onSelect, ratesPanel }: {
  ratesOpen: boolean; onToggleRates: () => void; onSelect: () => void; ratesPanel: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "rgba(10,20,50,0.5)",
        border: "1.5px solid rgba(255,255,255,0.12)",
        borderRadius: 20,
        padding: "32px 28px 24px",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(8px)",
        position: "relative",
        alignSelf: "start",
        marginTop: 16,
      }}
      className="alt-card"
    >
      {/* Kicker */}
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Prefer to pay less now?</div>

      {/* Name */}
      <div style={{ fontSize: 17, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 20 }}>Standard Variable tariff</div>

      {/* Price — slightly smaller */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 44, fontWeight: 900, color: "rgba(255,255,255,0.75)", lineHeight: 1, letterSpacing: "-1px" }}>£98.01</span>
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Monthly estimate</div>

      {/* Body */}
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 20, flex: 1 }}>
        Your prices aren&apos;t fixed. They move up or down in line with the Ofgem price cap. There&apos;s no exit fee, so you&apos;re free to leave whenever you like.
      </p>

      {/* Meta */}
      <div style={{ fontSize: 13, marginBottom: 28, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "rgba(148,197,253,0.6)" }}>Early exit fee:</span>
        <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>£0 per fuel</span>
      </div>

      {/* Outline CTA */}
      <button
        onClick={onSelect}
        style={{ display: "block", width: "100%", padding: "15px", background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.35)", borderRadius: 28, fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 10 }}
      >
        Select this tariff
      </button>

      {/* View rates */}
      <button onClick={onToggleRates} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", padding: "12px", background: "transparent", color: "rgba(255,255,255,0.4)", border: "none", fontSize: 14, cursor: "pointer" }}>
        View rates
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          {ratesOpen ? <path d="M6 3L11 9H1L6 3Z"/> : <path d="M6 9L1 3H11L6 9Z"/>}
        </svg>
      </button>
      {ratesOpen && ratesPanel}
    </div>
  );
}

function RatesPanel({ elecUnit, elecStanding, elecExit, gasUnit, gasStanding, gasExit }: {
  elecUnit: string; elecStanding: string; elecExit: string;
  gasUnit: string; gasStanding: string; gasExit: string;
}) {
  return (
    <div style={{ marginTop: 14, background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 14 }}>
      <div style={{ color: "#60a5fa", fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.07em" }}>Electricity</div>
      <RR label="Unit rate" value={elecUnit} border />
      <RR label="Standing charge" value={elecStanding} border />
      <RR label="Early exit fee" value={elecExit} bb />
      <div style={{ color: "#60a5fa", fontSize: 11, fontWeight: 700, margin: "12px 0 8px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Gas</div>
      <RR label="Unit rate" value={gasUnit} border />
      <RR label="Standing charge" value={gasStanding} border />
      <RR label="Early exit fee" value={gasExit} />
    </div>
  );
}

function RR({ label, value, border, bb }: { label: string; value: string; border?: boolean; bb?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, borderBottom: border ? "1px solid rgba(255,255,255,0.08)" : bb ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
      <span style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
      <span style={{ fontWeight: 600, color: "#fff" }}>{value}</span>
    </div>
  );
}

// ── Help me choose — two-question guided flow ─────────────────────────────────

type Q1Answer = "reliable" | "cheap" | null;
type Q2Answer = "settled" | "flexible" | null;
type HelpView = "questions" | "result";

function HelpMeChoose({ onSelectTariff, onClose }: {
  onSelectTariff: (t: TariffType) => void; onClose: () => void;
}) {
  const [view, setView] = useState<HelpView>("questions");
  const [q1, setQ1] = useState<Q1Answer>(null);
  const [q2, setQ2] = useState<Q2Answer>(null);

  const canContinue = q1 !== null && q2 !== null;

  const suggestedTariff: TariffType = q1 === "reliable" ? "fix" : "var";

  function reason(): string {
    if (suggestedTariff === "fix") {
      return q2 === "settled"
        ? "You want a bill you can count on and you're staying put. Fixing your rate for 12 months gives you that, and it still drops if prices fall."
        : "A reliable bill matters most to you. Fix & Fall locks your rate for 12 months and still falls if prices drop. Just note the £75 per fuel exit fee if you move before then.";
    } else {
      return q2 === "flexible"
        ? "Lowest price matters most and you want to stay flexible. Standard Variable is cheaper right now, with no exit fee, so you can leave whenever you like."
        : "You're after the lowest price today. Standard Variable is the cheaper option now, with no exit fee, though the rate can move up or down with the price cap.";
    }
  }

  const suggestedName = suggestedTariff === "fix" ? "Fix & Fall" : "Standard Variable";
  const suggestedPrice = suggestedTariff === "fix" ? "£103.28" : "£98.01";

  if (view === "result") {
    return (
      <div>
        {/* Badge */}
        <div style={{ display: "inline-block", background: "rgba(170,255,31,0.15)", border: `1px solid ${CTA}`, color: CTA, fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, marginBottom: 20, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Based on what you told us
        </div>

        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 16 }}>
          We&apos;d suggest {suggestedName}
        </div>

        <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-1px", marginBottom: 4 }}>{suggestedPrice}</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Monthly estimate</div>

        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.75, marginBottom: 28 }}>{reason()}</p>

        <button
          onClick={() => onSelectTariff(suggestedTariff)}
          style={{ display: "block", width: "100%", padding: "16px", background: CTA, color: "#0b1f3a", border: "none", borderRadius: 28, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}
        >
          Select this tariff
        </button>

        <button
          onClick={() => { setView("questions"); setQ1(null); setQ2(null); }}
          style={{ display: "block", width: "100%", padding: "12px", background: "transparent", color: "rgba(255,255,255,0.5)", border: "none", fontSize: 14, cursor: "pointer" }}
        >
          Show me both options again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Q1 */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>What matters most to you?</div>
        {([
          { id: "reliable" as Q1Answer, label: "A bill I can rely on", sub: "I'd rather know what I'm paying" },
          { id: "cheap" as Q1Answer, label: "The lowest price now", sub: "I want to pay as little as possible today" },
        ] as { id: Q1Answer; label: string; sub: string }[]).map(({ id, label, sub }) => (
          <button
            key={id!}
            onClick={() => setQ1(id)}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "14px 16px", marginBottom: 8,
              background: q1 === id ? "rgba(170,255,31,0.1)" : "rgba(255,255,255,0.05)",
              border: q1 === id ? `2px solid ${CTA}` : "2px solid rgba(255,255,255,0.12)",
              borderRadius: 12, cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{sub}</div>
          </button>
        ))}
      </div>

      {/* Q2 */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>How long do you expect to stay?</div>
        {([
          { id: "settled" as Q2Answer, label: "A year or more", sub: "I'm settled here" },
          { id: "flexible" as Q2Answer, label: "Not sure / might move", sub: "I want to stay flexible" },
        ] as { id: Q2Answer; label: string; sub: string }[]).map(({ id, label, sub }) => (
          <button
            key={id!}
            onClick={() => setQ2(id)}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "14px 16px", marginBottom: 8,
              background: q2 === id ? "rgba(170,255,31,0.1)" : "rgba(255,255,255,0.05)",
              border: q2 === id ? `2px solid ${CTA}` : "2px solid rgba(255,255,255,0.12)",
              borderRadius: 12, cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{sub}</div>
          </button>
        ))}
      </div>

      <button
        onClick={() => canContinue && setView("result")}
        disabled={!canContinue}
        style={{
          display: "block", width: "100%", padding: "16px",
          background: canContinue ? CTA : "rgba(255,255,255,0.1)",
          color: canContinue ? "#0b1f3a" : "rgba(255,255,255,0.3)",
          border: "none", borderRadius: 28, fontSize: 15, fontWeight: 700,
          cursor: canContinue ? "pointer" : "not-allowed",
          transition: "background 0.2s, color 0.2s",
        }}
      >
        See my suggestion
      </button>
    </div>
  );
}

// ── Help panel shell (desktop drawer / mobile sheet) ─────────────────────────

function HelpPanel({ open, onSelectTariff, onClose }: {
  open: boolean; onSelectTariff: (t: TariffType) => void; onClose: () => void;
}) {
  if (!open) return null;
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 30 }}
        aria-hidden="true"
      />

      {/* Desktop drawer — right side */}
      <div
        className="help-drawer-desktop"
        role="dialog"
        aria-modal="true"
        aria-label="Help me choose"
        style={{ position: "fixed", top: 0, right: 0, height: "100%", width: 460, background: "#0c2550", zIndex: 40, padding: "32px 28px 48px", overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,0.5)" }}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", display: "flex" }} aria-label="Close">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
        </button>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6, marginTop: 8 }}>Help me choose</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>Answer two quick questions and we&apos;ll suggest the right tariff for you.</div>
        <HelpMeChoose onSelectTariff={onSelectTariff} onClose={onClose} />
      </div>

      {/* Mobile bottom sheet */}
      <div
        className="help-drawer-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Help me choose"
        style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 520, background: "#0c2550", borderRadius: "20px 20px 0 0", zIndex: 40, padding: "24px 24px 48px", overflowY: "auto", maxHeight: "90vh" }}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.25)", borderRadius: 4, margin: "0 auto 20px" }} />
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Help me choose</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>Answer two quick questions and we&apos;ll suggest the right tariff for you.</div>
        <HelpMeChoose onSelectTariff={onSelectTariff} onClose={onClose} />
      </div>
    </>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────

function StepShell({ step, title, onBack, onNext, children }: {
  step: number; title: string; onBack: () => void; onNext: () => void; children: React.ReactNode;
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div className="progress-sticky">
        <div style={{ maxWidth: 540, margin: "0 auto", width: "100%", padding: "0 16px" }}>
          <ProgressBar step={step} />
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 8 }}>Step {step} of 4</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px 100px" }} className="step-content">
        <div style={{ width: "100%", maxWidth: 540 }}>
          <div style={{ background: "#1a4fd6", borderRadius: 20, padding: "28px 28px 24px" }}>
            <div style={{ textAlign: "center", color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 24 }}>{title}</div>
            {children}
          </div>
          <TrustpilotBadge />
        </div>
      </div>

      <div className="nav-buttons-sticky">
        <div style={{ maxWidth: 540, margin: "0 auto", width: "100%", padding: "12px 16px", display: "flex", gap: 10 }}>
          <button onClick={onBack} style={{ padding: "14px 24px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Previous</button>
          <button onClick={onNext} style={{ flex: 1, padding: 14, background: CTA, color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Continue</button>
        </div>
      </div>
    </div>
  );
}

function TrustpilotBadge() {
  return (
    <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
      <span style={{ color: "#00b67a" }}>★★★★</span> GREAT · 198K reviews · Trustpilot
    </div>
  );
}

// ── Confirmation ──────────────────────────────────────────────────────────────

function Confirmation({ tariff }: { tariff: TariffType }) {
  const fix = tariff === "fix";
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 12 }}>{fix ? "Fix & Fall tariff selected" : "Standard Variable tariff selected"}</div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{fix ? "Great choice. Your rate is locked in — and if prices fall, yours will too." : "No problem. You're on the flexible tariff with no lock-in."}</div>
        <div style={{ marginTop: 32, fontSize: 36, fontWeight: 800, color: CTA }}>{fix ? "£103.28" : "£98.01"}<span style={{ fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>/mo estimated</span></div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function QuoteJourney() {
  const [step, setStep] = useState(1);
  const [fuel, setFuel] = useState<FuelType>("dual");
  const [smartDevices, setSmartDevices] = useState<Set<SmartDevice>>(new Set());
  const [elec, setElec] = useState(1800);
  const [gas, setGas] = useState(6700);
  const [selectedTariff, setSelectedTariff] = useState<TariffType | null>(null);

  function handleSelectTariff(t: TariffType) { setSelectedTariff(t); setStep(5); }

  return (
    <div style={{ minHeight: "100vh", background: "#001029", display: "flex", justifyContent: "center", padding: "0" }}>
      <div style={{ width: "100%", maxWidth: 1440, background: "#0b1f3a", display: "flex", flexDirection: "column", position: "relative", borderRadius: "0 0 48px 48px", overflow: "hidden" }}>
        <Nav />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {step === 1 && <Step1 onNext={() => setStep(2)} />}
          {step === 2 && <Step2 fuel={fuel} setFuel={setFuel} smartDevices={smartDevices} setSmartDevices={setSmartDevices} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <Step3 elec={elec} setElec={setElec} gas={gas} setGas={setGas} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <Step4 elec={elec} gas={gas} onBack={() => setStep(3)} onSelectTariff={handleSelectTariff} />}
          {step === 5 && selectedTariff && <Confirmation tariff={selectedTariff} />}
        </div>
      </div>
    </div>
  );
}
