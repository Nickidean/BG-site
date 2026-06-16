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
      <div style={{ background: "#060f1e", padding: "8px 24px", display: "flex", gap: 24 }}>
        {["Offers", "Business", "Landlord", "Accessibility toolbar"].map((l) => (
          <a key={l} href="#" style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, textDecoration: "none" }}>{l}</a>
        ))}
      </div>
      <div style={{ background: "#0b1f3a", padding: "0 24px", display: "flex", alignItems: "center", height: 64, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 32, flexShrink: 0 }}>
          <Image src="/bg-flame.png" alt="" width={32} height={32} style={{ objectFit: "contain" }} />
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>British Gas</span>
        </div>
        <nav style={{ display: "flex", gap: 28, flex: 1 }}>
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
        {/* Fix: explicit white text inside the box */}
        <div style={{ fontSize: 14, fontWeight: 600, textAlign: "center", marginBottom: 14, color: "#fff" }}>We&apos;ve found the energy usage at the property</div>
        <URow label="Address" value="24 Millstream, Maidenhead Rd" border />
        <URow label="Electricity per year" value={`${elec.toLocaleString()} kWh`} border />
        <URow label="Gas per year" value={`${gas.toLocaleString()} kWh`} />
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 10 }}>We&apos;ve used the latest yearly energy estimate for this property.</div>
      </div>

      {/* Less prominent edit button */}
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
      {/* Fix: explicit white on values */}
      <span style={{ fontWeight: 600, color: "#fff" }}>{value}</span>
    </div>
  );
}

// ── Step 4: Tariffs ───────────────────────────────────────────────────────────

function Step4({ elec, gas, onBack, onSelectTariff }: {
  elec: number; gas: number; onBack: () => void; onSelectTariff: (t: TariffType) => void;
}) {
  // Single toggle — opens rates on BOTH cards simultaneously
  const [allRatesOpen, setAllRatesOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  return (
    <div style={{ flex: 1, padding: "48px 32px 64px", maxWidth: 1100, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <h1 style={{ color: "#fff", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, marginBottom: 20, lineHeight: 1.1 }}>Your tariff options</h1>

      {/* Summary — all white text, no black */}
      <div style={{ marginBottom: 36, fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 2.2 }}>
        <div><span style={{ color: "rgba(255,255,255,0.45)" }}>Address: </span><span style={{ color: "#fff" }}>24 Millstream, Maidenhead Rd, Windsor, Berkshire, SL4 5GD</span></div>
        <div><span style={{ color: "rgba(255,255,255,0.45)" }}>Fuel type: </span><span style={{ color: "#fff" }}>Gas and electricity</span></div>
        <div>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>Energy usage: </span>
          <span style={{ color: "#fff" }}>Electricity: {elec.toLocaleString()} kWh &nbsp;·&nbsp; Gas: {gas.toLocaleString()} kWh</span>
          &nbsp;&nbsp;<span onClick={onBack} style={{ color: CTA, cursor: "pointer", textDecoration: "underline" }}>Edit</span>
        </div>
      </div>

      <div className="tariff-grid">
        <TariffCard
          name="Fix & Fall tariff" price="£103.28"
          description="Your rate's fixed, but if prices fall, yours will too. That's peace of mind with a bonus upside."
          duration="12 months" exitFee="£75 per fuel"
          ratesOpen={allRatesOpen}
          onToggleRates={() => setAllRatesOpen(o => !o)}
          onSelect={() => onSelectTariff("fix")}
          ratesPanel={<RatesPanel elecUnit="25.79p per kWh" elecStanding="47.632p per day" elecExit="£75 per fuel" gasUnit="6.642p per kWh" gasStanding="28.262p per day" gasExit="£75 per fuel" />}
        />
        <TariffCard
          name="Standard Variable tariff" price="£98.01"
          description="Your energy prices aren't fixed. They can increase or decrease in line with the Ofgem price cap"
          exitFee="£0 per fuel"
          ratesOpen={allRatesOpen}
          onToggleRates={() => setAllRatesOpen(o => !o)}
          onSelect={() => onSelectTariff("var")}
          ratesPanel={<RatesPanel elecUnit="24.936p per kWh" elecStanding="53.937p per day" elecExit="£0" gasUnit="5.673p per kWh" gasStanding="28.744p per day" gasExit="£0" />}
        />
      </div>

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginBottom: 14 }}>Not sure which one&apos;s right for you?</div>
        <button onClick={() => setOverlayOpen(true)} style={{ padding: "14px 36px", background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.35)", borderRadius: 28, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
          Help me choose
        </button>
      </div>

      <HelpPanel
        open={overlayOpen}
        onSelectFix={() => { onSelectTariff("fix"); setOverlayOpen(false); }}
        onSelectVar={() => { onSelectTariff("var"); setOverlayOpen(false); }}
        onClose={() => setOverlayOpen(false)}
      />
    </div>
  );
}

function TariffCard({ name, price, description, duration, exitFee, ratesOpen, onToggleRates, onSelect, ratesPanel }: {
  name: string; price: string; description: string; duration?: string; exitFee: string;
  ratesOpen: boolean; onToggleRates: () => void; onSelect: () => void; ratesPanel: React.ReactNode;
}) {
  return (
    <div style={{ background: "rgba(10,30,80,0.6)", border: "1.5px solid #2a5bc4", borderRadius: 16, padding: "32px 28px 24px", display: "flex", flexDirection: "column", backdropFilter: "blur(8px)" }}>
      <div style={{ color: "#60a5fa", fontSize: 16, fontWeight: 600, marginBottom: 10, textAlign: "center" }}>{name}</div>
      <div style={{ fontSize: 54, fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1, letterSpacing: "-1px" }}>{price}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textAlign: "center", marginBottom: 20, marginTop: 4 }}>Monthly estimate</div>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 24, lineHeight: 1.7, textAlign: "center", flex: 1 }}>{description}</p>
      {duration && (
        <div style={{ fontSize: 13, marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#60a5fa" }}>Duration:</span>
          <span style={{ color: "#fff", fontWeight: 600 }}>{duration}</span>
        </div>
      )}
      <div style={{ fontSize: 13, marginBottom: 28, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#60a5fa" }}>Early exit fee:</span>
        <span style={{ color: "#fff", fontWeight: 600 }}>{exitFee}</span>
      </div>
      <button onClick={onSelect} style={{ display: "block", width: "100%", padding: "16px", background: CTA, color: "#0b1f3a", border: "none", borderRadius: 28, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
        Select this tariff
      </button>
      <button onClick={onToggleRates} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", padding: "12px", background: "transparent", color: "rgba(255,255,255,0.65)", border: "none", fontSize: 14, cursor: "pointer" }}>
        View rates
        {/* Solid filled triangle — matches mockup */}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          {ratesOpen
            ? <path d="M6 3L11 9H1L6 3Z"/>
            : <path d="M6 9L1 3H11L6 9Z"/>}
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

// ── Help me choose panel ──────────────────────────────────────────────────────
// Desktop: right-side drawer. Mobile: bottom sheet. Both CSS-driven.

function HelpPanel({ open, onSelectFix, onSelectVar, onClose }: {
  open: boolean; onSelectFix: () => void; onSelectVar: () => void; onClose: () => void;
}) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 30 }} />

      {/* Desktop drawer — right side */}
      <div className="help-drawer-desktop" style={{ position: "fixed", top: 0, right: 0, height: "100%", width: 420, background: "#0c2550", zIndex: 40, padding: "32px 28px 40px", overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,0.5)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", display: "flex" }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
        </button>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6, marginTop: 8 }}>Help me choose</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>Here&apos;s what makes each tariff different</div>
        <HelpContent onSelectFix={onSelectFix} onSelectVar={onSelectVar} onClose={onClose} />
      </div>

      {/* Mobile bottom sheet */}
      <div className="help-drawer-mobile" style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 520, background: "#0c2550", borderRadius: "20px 20px 0 0", zIndex: 40, padding: "24px 24px 36px", overflowY: "auto", maxHeight: "90vh" }}>
        <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.25)", borderRadius: 4, margin: "0 auto 20px" }} />
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Help me choose</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>Here&apos;s what makes each tariff different</div>
        <HelpContent onSelectFix={onSelectFix} onSelectVar={onSelectVar} onClose={onClose} />
      </div>
    </>
  );
}

function HelpContent({ onSelectFix, onSelectVar, onClose }: {
  onSelectFix: () => void; onSelectVar: () => void; onClose: () => void;
}) {
  return (
    <>
      <div style={{ background: "rgba(170,255,31,0.07)", border: "1px solid rgba(170,255,31,0.25)", borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Fix &amp; Fall</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>£103.28<span style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.45)" }}>/mo</span></span>
        </div>
        <Pt icon="✓" text="Rate fixed for 12 months — no surprise rises" />
        <Pt icon="✓" text="If prices fall, your rate falls too" />
        <Pt icon="✗" text="£75 exit fee per fuel if you leave early" neg />
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontStyle: "italic", marginTop: 10 }}>Good if you want certainty and protection against price rises</div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 16, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Standard Variable</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>£98.01<span style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.45)" }}>/mo</span></span>
        </div>
        <Pt icon="✓" text="Cheaper right now — saves ~£5 a month" />
        <Pt icon="✓" text="No exit fee — leave any time" />
        <Pt icon="✗" text="Prices can rise with the Ofgem price cap" neg />
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontStyle: "italic", marginTop: 10 }}>Good if you want flexibility and aren&apos;t worried about price changes</div>
      </div>
      <button onClick={onSelectFix} style={{ display: "block", width: "100%", padding: 14, background: CTA, color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>Select Fix &amp; Fall — £103.28/mo</button>
      <button onClick={onSelectVar} style={{ display: "block", width: "100%", padding: 14, background: "#fff", color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>Select Standard Variable — £98.01/mo</button>
      <button onClick={onClose} style={{ display: "block", width: "100%", padding: 12, background: "transparent", color: "rgba(255,255,255,0.45)", border: "none", fontSize: 14, cursor: "pointer" }}>Close</button>
    </>
  );
}

function Pt({ icon, text, neg }: { icon: string; text: string; neg?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 7 }}>
      <span style={{ color: neg ? "rgba(255,100,100,0.85)" : CTA, flexShrink: 0 }}>{icon}</span>{text}
    </div>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────

function StepShell({ step, title, onBack, onNext, children }: {
  step: number; title: string; onBack: () => void; onNext: () => void; children: React.ReactNode;
}) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px 60px" }}>
      <div style={{ width: "100%", maxWidth: 540 }}>
        <ProgressBar step={step} />
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 8 }}>Step {step} of 4</div>
        <div style={{ background: "#1a4fd6", borderRadius: 20, padding: "28px 28px 24px" }}>
          <div style={{ textAlign: "center", color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 24 }}>{title}</div>
          {children}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={onBack} style={{ padding: "14px 24px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Previous</button>
            <button onClick={onNext} style={{ flex: 1, padding: 14, background: CTA, color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Continue</button>
          </div>
        </div>
        <TrustpilotBadge />
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
    <div style={{ minHeight: "100vh", background: "#0b1f3a", display: "flex", flexDirection: "column" }}>
      <Nav />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {step === 1 && <Step1 onNext={() => setStep(2)} />}
        {step === 2 && <Step2 fuel={fuel} setFuel={setFuel} smartDevices={smartDevices} setSmartDevices={setSmartDevices} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <Step3 elec={elec} setElec={setElec} gas={gas} setGas={setGas} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <Step4 elec={elec} gas={gas} onBack={() => setStep(3)} onSelectTariff={handleSelectTariff} />}
        {step === 5 && selectedTariff && <Confirmation tariff={selectedTariff} />}
      </div>
    </div>
  );
}
