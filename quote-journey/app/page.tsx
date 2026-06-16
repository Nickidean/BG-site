"use client";

import { useState } from "react";
import Image from "next/image";

type FuelType = "dual" | "gas" | "electric";
type SmartDevice = "heat_pump" | "ev" | "solar" | "battery";
type TariffType = "fix" | "var";

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
          <button style={{ background: "#b2f53d", color: "#0b1f3a", border: "none", borderRadius: 24, padding: "9px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Login
          </button>
        </div>
      </div>
    </header>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
      {[1, 2, 3, 4].map((n) => (
        <div key={n} style={{ height: 4, flex: 1, borderRadius: 4, background: n <= step ? "#b2f53d" : "rgba(255,255,255,0.2)", transition: "background 0.3s" }} />
      ))}
    </div>
  );
}

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
            <button onClick={onNext} style={{ padding: "14px 28px", background: "#b2f53d", color: "#0b1f3a", border: "none", borderRadius: 24, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Choose this address
            </button>
          </div>
        </div>
        <TrustpilotBadge />
      </div>
    </div>
  );
}

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
            <div key={id} onClick={() => setFuel(id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderRadius: 10, cursor: "pointer", fontSize: 15, color: "#fff", border: sel ? "2px solid #b2f53d" : "2px solid rgba(255,255,255,0.15)", background: sel ? "rgba(178,245,61,0.1)" : "rgba(255,255,255,0.08)" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, border: sel ? "2px solid #b2f53d" : "2px solid rgba(255,255,255,0.4)", background: sel ? "#b2f53d" : "transparent" }} />
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
            <div key={id} onClick={() => toggleSmart(id)} style={{ padding: "11px 10px", borderRadius: 10, cursor: "pointer", fontSize: 14, color: "#fff", border: on ? "2px solid #b2f53d" : "2px solid rgba(255,255,255,0.15)", background: on ? "rgba(178,245,61,0.1)" : "rgba(255,255,255,0.08)" }}>
              {emoji} {label}
            </div>
          );
        })}
      </div>
    </StepShell>
  );
}

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
        <div style={{ fontSize: 14, fontWeight: 600, textAlign: "center", marginBottom: 14 }}>We&apos;ve found the energy usage at the property</div>
        <URow label="Address" value="24 Millstream, Maidenhead Rd" border />
        <URow label="Electricity per year" value={`${elec.toLocaleString()} kWh`} border />
        <URow label="Gas per year" value={`${gas.toLocaleString()} kWh`} />
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 10 }}>We&apos;ve used the latest yearly energy estimate for this property.</div>
      </div>
      <button onClick={() => setEditOpen(o => !o)} style={{ display: "block", width: "100%", padding: 13, background: "#fff", color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Edit usage</button>
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
          <button onClick={saveUsage} style={{ display: "block", width: "100%", padding: 13, background: "#b2f53d", color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Save usage</button>
        </div>
      )}
    </StepShell>
  );
}

function URow({ label, value, border }: { label: string; value: string; border?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 14, borderBottom: border ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
      <span style={{ color: "#93c5fd" }}>{label}</span><span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function Step4({ elec, gas, onBack, onSelectTariff }: {
  elec: number; gas: number; onBack: () => void; onSelectTariff: (t: TariffType) => void;
}) {
  const [ratesOpen, setRatesOpen] = useState<"fix" | "var" | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  return (
    <div style={{ flex: 1, padding: "48px 32px 64px", maxWidth: 1100, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <h1 style={{ color: "#fff", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, marginBottom: 20, lineHeight: 1.1 }}>Your tariff options</h1>
      <div style={{ marginBottom: 36, fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 2.2 }}>
        <div><strong style={{ color: "#fff" }}>Address: </strong>24 Millstream, Maidenhead Rd, Windsor, Berkshire, SL4 5GD</div>
        <div><strong style={{ color: "#fff" }}>Fuel type: </strong>Gas and electricity</div>
        <div>
          <strong style={{ color: "#fff" }}>Energy usage at address: </strong>
          <strong style={{ color: "#fff" }}>Electricity: </strong>{elec.toLocaleString()} kWh,&nbsp;
          <strong style={{ color: "#fff" }}>Gas: </strong>{gas.toLocaleString()} kWh&nbsp;&nbsp;
          <span onClick={onBack} style={{ color: "#b2f53d", cursor: "pointer", textDecoration: "underline" }}>Edit</span>
        </div>
      </div>

      <div className="tariff-grid">
        <TariffCard
          name="Fix & Fall tariff" price="£103.28"
          description="Your rate's fixed, but if prices fall, yours will too. That's peace of mind with a bonus upside."
          duration="12 months" exitFee="£75 per fuel"
          ratesOpen={ratesOpen === "fix"}
          onToggleRates={() => setRatesOpen(ratesOpen === "fix" ? null : "fix")}
          onSelect={() => onSelectTariff("fix")}
          ratesPanel={<RatesPanel elecUnit="25.79p per kWh" elecStanding="47.632p per day" elecExit="£75 per fuel" gasUnit="6.642p per kWh" gasStanding="28.262p per day" gasExit="£75 per fuel" />}
        />
        <TariffCard
          name="Standard Variable tariff" price="£98.01"
          description="Your energy prices aren't fixed. They can increase or decrease in line with the Ofgem price cap"
          exitFee="£0 per fuel"
          ratesOpen={ratesOpen === "var"}
          onToggleRates={() => setRatesOpen(ratesOpen === "var" ? null : "var")}
          onSelect={() => onSelectTariff("var")}
          ratesPanel={<RatesPanel elecUnit="24.936p per kWh" elecStanding="53.937p per day" elecExit="£0" gasUnit="5.673p per kWh" gasStanding="28.744p per day" gasExit="£0" />}
        />
      </div>

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, marginBottom: 14 }}>Not sure which one&apos;s right for you?</div>
        <button onClick={() => setOverlayOpen(true)} style={{ padding: "14px 36px", background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.35)", borderRadius: 28, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
          Help me choose
        </button>
      </div>

      {overlayOpen && (
        <HelpOverlay
          onSelectFix={() => { onSelectTariff("fix"); setOverlayOpen(false); }}
          onSelectVar={() => { onSelectTariff("var"); setOverlayOpen(false); }}
          onClose={() => setOverlayOpen(false)}
        />
      )}
    </div>
  );
}

function TariffCard({ name, price, description, duration, exitFee, ratesOpen, onToggleRates, onSelect, ratesPanel }: {
  name: string; price: string; description: string; duration?: string; exitFee: string;
  ratesOpen: boolean; onToggleRates: () => void; onSelect: () => void; ratesPanel: React.ReactNode;
}) {
  return (
    <div style={{ background: "rgba(255,255,255,0.05)", border: "2px solid #3b6fd4", borderRadius: 16, padding: "28px 28px 24px", display: "flex", flexDirection: "column" }}>
      <div style={{ color: "#93c5fd", fontSize: 16, fontWeight: 600, marginBottom: 8, textAlign: "center" }}>{name}</div>
      <div style={{ fontSize: 52, fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1 }}>{price}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 20 }}>Monthly estimate</div>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginBottom: 24, lineHeight: 1.7, textAlign: "center", flex: 1 }}>{description}</p>
      {duration && <div style={{ fontSize: 13, color: "#93c5fd", marginBottom: 6 }}>Duration: <strong style={{ color: "#fff" }}>{duration}</strong></div>}
      <div style={{ fontSize: 13, color: "#93c5fd", marginBottom: 24 }}>Early exit fee: <strong style={{ color: "#fff" }}>{exitFee}</strong></div>
      <button onClick={onSelect} style={{ display: "block", width: "100%", padding: "16px", background: "#b2f53d", color: "#0b1f3a", border: "none", borderRadius: 28, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
        Select this tariff
      </button>
      <button onClick={onToggleRates} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "12px", background: "transparent", color: "rgba(255,255,255,0.7)", border: "none", fontSize: 14, cursor: "pointer" }}>
        View rates
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" viewBox="0 0 24 24">
          <path d={ratesOpen ? "M19 15l-7-7-7 7" : "M19 9l-7 7-7-7"} />
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
    <div style={{ marginTop: 12, background: "rgba(0,0,0,0.25)", borderRadius: 10, padding: 14 }}>
      <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Electricity</div>
      <RR label="Unit rate" value={elecUnit} border />
      <RR label="Standing charge" value={elecStanding} border />
      <RR label="Early exit fee" value={elecExit} bb />
      <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700, margin: "12px 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Gas</div>
      <RR label="Unit rate" value={gasUnit} border />
      <RR label="Standing charge" value={gasStanding} border />
      <RR label="Early exit fee" value={gasExit} />
    </div>
  );
}

function RR({ label, value, border, bb }: { label: string; value: string; border?: boolean; bb?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, borderBottom: border ? "1px solid rgba(255,255,255,0.08)" : bb ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
      <span style={{ color: "rgba(255,255,255,0.6)" }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function HelpOverlay({ onSelectFix, onSelectVar, onClose }: {
  onSelectFix: () => void; onSelectVar: () => void; onClose: () => void;
}) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 10 }} />
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 520, background: "#0f2d5e", borderRadius: "20px 20px 0 0", zIndex: 20, padding: "24px 24px 32px" }}>
        <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.25)", borderRadius: 4, margin: "0 auto 20px" }} />
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Help me choose</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 20 }}>Here&apos;s what makes each tariff different</div>
        <div style={{ background: "rgba(178,245,61,0.08)", border: "1px solid rgba(178,245,61,0.3)", borderRadius: 14, padding: 16, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Fix &amp; Fall</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>£103.28<span style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>/mo</span></span>
          </div>
          <Pt icon="✓" text="Rate fixed for 12 months — no surprise rises" />
          <Pt icon="✓" text="If prices fall, your rate falls too" />
          <Pt icon="✗" text="£75 exit fee per fuel if you leave early" neg />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontStyle: "italic", marginTop: 8 }}>Good if you want certainty and protection against price rises</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Standard Variable</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>£98.01<span style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>/mo</span></span>
          </div>
          <Pt icon="✓" text="Cheaper right now — saves ~£5 a month" />
          <Pt icon="✓" text="No exit fee — leave any time" />
          <Pt icon="✗" text="Prices can rise with the Ofgem price cap" neg />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontStyle: "italic", marginTop: 8 }}>Good if you want flexibility and aren&apos;t worried about price changes</div>
        </div>
        <button onClick={onSelectFix} style={{ display: "block", width: "100%", padding: 14, background: "#b2f53d", color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>Select Fix &amp; Fall — £103.28/mo</button>
        <button onClick={onSelectVar} style={{ display: "block", width: "100%", padding: 14, background: "#fff", color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>Select Standard Variable — £98.01/mo</button>
        <button onClick={onClose} style={{ display: "block", width: "100%", padding: 12, background: "transparent", color: "rgba(255,255,255,0.5)", border: "none", fontSize: 14, cursor: "pointer" }}>Close</button>
      </div>
    </>
  );
}

function Pt({ icon, text, neg }: { icon: string; text: string; neg?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 6 }}>
      <span style={{ color: neg ? "rgba(255,100,100,0.9)" : "#b2f53d", flexShrink: 0 }}>{icon}</span>{text}
    </div>
  );
}

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
            <button onClick={onBack} style={{ padding: "14px 24px", background: "#fff", color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Previous</button>
            <button onClick={onNext} style={{ flex: 1, padding: 14, background: "#b2f53d", color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Continue</button>
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

function Confirmation({ tariff }: { tariff: TariffType }) {
  const fix = tariff === "fix";
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 12 }}>{fix ? "Fix & Fall tariff selected" : "Standard Variable tariff selected"}</div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{fix ? "Great choice. Your rate is locked in — and if prices fall, yours will too." : "No problem. You're on the flexible tariff with no lock-in."}</div>
        <div style={{ marginTop: 32, fontSize: 36, fontWeight: 800, color: "#b2f53d" }}>{fix ? "£103.28" : "£98.01"}<span style={{ fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>/mo estimated</span></div>
      </div>
    </div>
  );
}

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
