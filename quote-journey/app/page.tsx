"use client";

import { useState } from "react";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────────────────────

type FuelType = "dual" | "gas" | "electric";
type SmartDevice = "heat_pump" | "ev" | "solar" | "battery";
type TariffType = "fix" | "var";

const CTA = "#AAFF1F";

// ── Tariff rate data ──────────────────────────────────────────────────────────

const TARIFF_RATES = {
  fix: {
    elecUnit: 25.79,       // p/kWh — Fix & Fall Jun28 v6
    elecStanding: 47.632,  // p/day
    gasUnit: 6.642,        // p/kWh
    gasStanding: 28.262,   // p/day
    exitFee: 75,
  },
  var: {
    elecUnit: 26.381,      // p/kWh — Standard Variable Tariff v26
    elecStanding: 53.944,  // p/day
    gasUnit: 7.26,         // p/kWh
    gasStanding: 28.703,   // p/day
    exitFee: 0,
  },
} as const;

type TariffRates = { elecUnit: number; elecStanding: number; gasUnit: number; gasStanding: number; exitFee: number };
function calcMonthly(elec: number, gas: number, r: TariffRates): number {
  return (
    (elec * r.elecUnit / 100) +
    (365 * r.elecStanding / 100) +
    (gas * r.gasUnit / 100) +
    (365 * r.gasStanding / 100)
  ) / 12;
}

function fmtPrice(n: number): string {
  return `£${n.toFixed(2)}`;
}

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
  const [postcode, setPostcode] = useState("DT63HY");
  const [searched, setSearched] = useState(true);
  const [address, setAddress] = useState("24");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 16px 64px", minHeight: "calc(100vh - 100px)", position: "relative", background: "radial-gradient(ellipse at 65% 50%, #0d3068 0%, #071628 100%)" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: 560, position: "relative", zIndex: 1 }}>
        <ProgressBar step={1} />
        <div style={{ background: "#1a4fd6", borderRadius: 20, padding: "36px 32px 32px" }}>
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.65)", fontSize: 13, marginBottom: 8 }}>Step 1 of 4</div>
          <div style={{ textAlign: "center", color: "#fff", fontSize: 26, fontWeight: 700, marginBottom: 28 }}>Let&apos;s find your address</div>

          {/* Postcode row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "stretch" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#0b1f3a", opacity: 0.4, display: "flex" }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              </span>
              <input
                type="text"
                value={postcode}
                onChange={e => { setPostcode(e.target.value.toUpperCase()); setSearched(false); }}
                placeholder="Enter postcode"
                style={{ display: "block", width: "100%", padding: "14px 14px 14px 38px", borderRadius: 10, border: "none", background: "#fff", fontSize: 15, color: "#0b1f3a", outline: "none", boxSizing: "border-box", height: "100%" }}
              />
            </div>
            <button
              onClick={() => postcode.trim() && setSearched(true)}
              style={{ padding: "0 20px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "2px solid rgba(255,255,255,0.3)", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              {searched ? "Search again" : "Find address"}
            </button>
          </div>

          {/* Address selector — only shown after a search */}
          {searched && (
            <div style={{ position: "relative", marginBottom: 4 }}>
              <select
                value={address}
                onChange={e => setAddress(e.target.value)}
                style={{ display: "block", width: "100%", padding: "14px 40px 14px 14px", borderRadius: 10, border: "none", background: "#fff", fontSize: 15, color: "#0b1f3a", outline: "none", appearance: "none", boxSizing: "border-box" }}
              >
                <option value="">Select address</option>
                <option value="24">24 Millstream, Maidenhead Rd</option>
                <option value="12">12 Millstream, Maidenhead Rd</option>
                <option value="8">8 Millstream, Maidenhead Rd</option>
              </select>
              <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#0b1f3a", opacity: 0.5, display: "flex" }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </span>
            </div>
          )}

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: 24, paddingTop: 20 }}>
            <button
              onClick={onNext}
              disabled={!searched || !address}
              style={{ display: "block", width: "100%", padding: 14, background: searched && address ? CTA : "rgba(255,255,255,0.2)", color: searched && address ? "#0b1f3a" : "rgba(255,255,255,0.4)", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: searched && address ? "pointer" : "not-allowed", transition: "background 0.2s" }}
            >
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

// ── Step 3: Usage (confirm-style) ────────────────────────────────────────────

type HomeType = "flat" | "terraced" | "semi" | "detached";
type HeatingType = "gas" | "electricity" | "heat_pump" | "other";
type BigMover = "ev" | "electricHeat" | "morePeople" | "homeDuringDay";
type UsageSubView = "estimate" | "adjust" | "detail" | "rawkwh";

// Industry-average figures for a 2-3 bed home with 2-3 people
const EPC_ELEC = 2700;
const EPC_GAS = 11500;

// Illustrative estimation model — real coefficients to come from data team
function computeFromDetail(opts: {
  homeType: HomeType; bedrooms: number; heating: HeatingType;
  people: number; ev: boolean; homeDuringDay: boolean;
}): { elec: number; gas: number } {
  const typeMult: Record<HomeType, number> = { flat: 0.58, terraced: 0.78, semi: 1.0, detached: 1.35 };
  let e = 2700 * typeMult[opts.homeType];
  let g = 11500 * typeMult[opts.homeType];
  const bd = (opts.bedrooms - 3) * 0.1;
  const pd = (opts.people - 2.4) * 0.07;
  e *= (1 + bd) * (1 + pd);
  g *= (1 + bd) * (1 + pd);
  if (opts.heating === "electricity") { e += g; g = 0; }
  else if (opts.heating === "heat_pump") { e += g / 2.8; g = 0; }
  if (opts.ev) e += 2200;
  if (opts.homeDuringDay) { e += 350; g += 550; }
  return { elec: Math.round(e / 50) * 50, gas: Math.round(g / 50) * 50 };
}

function applyMovers(movers: Set<BigMover>): { elec: number; gas: number } {
  let e = EPC_ELEC, g = EPC_GAS;
  if (movers.has("ev")) e += 2200;
  if (movers.has("electricHeat")) { e += Math.round(g / 2.8); g = 0; }
  if (movers.has("morePeople")) { e += 250; g += 450; }
  if (movers.has("homeDuringDay")) { e += 350; g += 550; }
  return { elec: Math.round(e / 50) * 50, gas: Math.round(g / 50) * 50 };
}

const BIG_MOVER_OPTIONS: { id: BigMover; label: string }[] = [
  { id: "ev", label: "We've got an electric vehicle" },
  { id: "electricHeat", label: "We heat the home with electricity or a heat pump" },
  { id: "morePeople", label: "More or fewer people live here now" },
  { id: "homeDuringDay", label: "Someone's usually home during the day" },
];

function Step3({ elec, setElec, gas, setGas, onNext, onBack }: {
  elec: number; setElec: (v: number) => void;
  gas: number; setGas: (v: number) => void;
  onNext: () => void; onBack: () => void;
}) {
  const [subView, setSubView] = useState<UsageSubView>("estimate");
  const [preRawView, setPreRawView] = useState<UsageSubView>("estimate");

  // Big movers
  const [bigMovers, setBigMovers] = useState<Set<BigMover>>(new Set());

  // Detail inputs — seeded from typical semi
  const [homeType, setHomeType] = useState<HomeType>("semi");
  const [bedrooms, setBedrooms] = useState(3);
  const [heating, setHeating] = useState<HeatingType>("gas");
  const [people, setPeople] = useState(3);
  const [hasEV, setHasEV] = useState(false);
  const [homeDuringDay, setHomeDuringDay] = useState(false);

  // Raw kWh override
  const [rawElec, setRawElec] = useState(String(elec));
  const [rawGas, setRawGas] = useState(String(gas));

  const moverEst = applyMovers(bigMovers);
  const detailEst = computeFromDetail({ homeType, bedrooms, heating, people, ev: hasEV, homeDuringDay });

  function confirm(e: number, g: number) { setElec(e); setGas(g); onNext(); }

  function toggleMover(m: BigMover) {
    const next = new Set(bigMovers);
    if (next.has(m)) next.delete(m); else next.add(m);
    setBigMovers(next);
    if (m === "ev") setHasEV(next.has(m));
    if (m === "electricHeat") setHeating(next.has(m) ? "heat_pump" : "gas");
    if (m === "homeDuringDay") setHomeDuringDay(next.has(m));
  }

  function handleBack() {
    if (subView === "rawkwh") { setSubView(preRawView); return; }
    if (subView === "adjust") { setSubView("estimate"); return; }
    if (subView === "detail") { setSubView("estimate"); return; }
    onBack();
  }

  function openRaw() {
    setPreRawView(subView);
    setSubView("rawkwh");
  }

  const TITLES: Record<UsageSubView, string> = {
    estimate: "Here's the energy this home usually uses",
    adjust: "Has anything changed?",
    detail: "Tell us about your home",
    rawkwh: "Enter your exact usage",
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div className="progress-sticky">
        <div style={{ maxWidth: 540, margin: "0 auto", width: "100%", padding: "0 16px" }}>
          <ProgressBar step={3} />
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 8 }}>Step 3 of 4</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px 100px" }} className="step-content">
        <div style={{ width: "100%", maxWidth: 540 }}>
          <div style={{ background: "#1a4fd6", borderRadius: 20, padding: "28px 28px 24px" }}>
            <div style={{ textAlign: "center", color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 24, lineHeight: 1.3 }}>
              {TITLES[subView]}
            </div>

            {subView === "estimate" && <EstimateView />}
            {subView === "adjust" && <AdjustView bigMovers={bigMovers} toggleMover={toggleMover} estimate={moverEst} />}
            {subView === "detail" && (
              <DetailView
                homeType={homeType} setHomeType={setHomeType}
                bedrooms={bedrooms} setBedrooms={setBedrooms}
                heating={heating} setHeating={setHeating}
                people={people} setPeople={setPeople}
                hasEV={hasEV} setHasEV={setHasEV}
                homeDuringDay={homeDuringDay} setHomeDuringDay={setHomeDuringDay}
                estimate={detailEst}
              />
            )}
            {subView === "rawkwh" && (
              <RawKwhView rawElec={rawElec} setRawElec={setRawElec} rawGas={rawGas} setRawGas={setRawGas} />
            )}

            <div className="nav-buttons-sticky nav-buttons-in-card">
              {subView === "estimate" && (
                <>
                  <button onClick={() => confirm(EPC_ELEC, EPC_GAS)} style={{ display: "block", width: "100%", padding: 14, background: CTA, color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
                    Yes that looks right
                  </button>
                  <button onClick={() => setSubView("detail")} style={{ display: "block", width: "100%", padding: 13, background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                    Something&apos;s changed
                  </button>
                </>
              )}
              {subView === "adjust" && (
                <>
                  <button onClick={() => confirm(moverEst.elec, moverEst.gas)} style={{ display: "block", width: "100%", padding: 14, background: CTA, color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
                    Confirm this estimate
                  </button>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={handleBack} style={{ padding: "13px 20px", background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Previous</button>
                    <button onClick={() => setSubView("detail")} style={{ flex: 1, padding: 13, background: "transparent", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, fontSize: 14, cursor: "pointer" }}>
                      Adjust in more detail
                    </button>
                  </div>
                </>
              )}
              {subView === "detail" && (
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handleBack} style={{ padding: "13px 20px", background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Previous</button>
                  <button onClick={() => confirm(detailEst.elec, detailEst.gas)} style={{ flex: 1, padding: 14, background: CTA, color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                    Confirm this estimate
                  </button>
                </div>
              )}
              {subView === "rawkwh" && (
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handleBack} style={{ padding: "13px 20px", background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Back</button>
                  <button onClick={() => confirm(parseInt(rawElec) || EPC_ELEC, parseInt(rawGas) || EPC_GAS)} style={{ flex: 1, padding: 14, background: CTA, color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                    Use these figures
                  </button>
                </div>
              )}

              {subView !== "rawkwh" && (
                <button onClick={openRaw} style={{ display: "block", width: "100%", marginTop: 14, background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 12, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, padding: "4px 0" }}>
                  I know my exact usage
                </button>
              )}
            </div>
          </div>
          <TrustpilotBadge />
        </div>
      </div>
    </div>
  );
}

function EstimateView() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: "#93c5fd" }}>
          <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1"/>
            <path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Based on records for this property
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        {([
          { label: "Gas", value: EPC_GAS, color: "#fb923c" },
          { label: "Electricity", value: EPC_ELEC, color: "#60a5fa" },
        ] as { label: string; value: number; color: string }[]).map(({ label, value, color }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.07em", color, marginBottom: 8, fontWeight: 700 }}>{label}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>kWh a year</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginBottom: 6, textAlign: "center" }}>
        Typical for a 2–3 bedroom home with 2–3 people, heated by gas.
      </p>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 0, textAlign: "center" }}>
        This is an estimate — worth a quick check.
      </p>
    </>
  );
}

function AdjustView({ bigMovers, toggleMover, estimate }: {
  bigMovers: Set<BigMover>; toggleMover: (m: BigMover) => void; estimate: { elec: number; gas: number };
}) {
  return (
    <>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 16, textAlign: "center" }}>
        Tick anything that applies — we&apos;ll update the estimate.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {BIG_MOVER_OPTIONS.map(({ id, label }) => {
          const on = bigMovers.has(id);
          return (
            <div key={id} onClick={() => toggleMover(id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderRadius: 10, cursor: "pointer", border: on ? `2px solid ${CTA}` : "2px solid rgba(255,255,255,0.15)", background: on ? "rgba(170,255,31,0.1)" : "rgba(255,255,255,0.08)" }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, border: on ? `2px solid ${CTA}` : "2px solid rgba(255,255,255,0.4)", background: on ? CTA : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {on && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 3.5-4" stroke="#0b1f3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span style={{ fontSize: 14, color: "#fff" }}>{label}</span>
            </div>
          );
        })}
      </div>
      <EstimateSummary elec={estimate.elec} gas={estimate.gas} updated={bigMovers.size > 0} />
    </>
  );
}

function DetailView({ homeType, setHomeType, bedrooms, setBedrooms, heating, setHeating, people, setPeople, hasEV, setHasEV, homeDuringDay, setHomeDuringDay, estimate }: {
  homeType: HomeType; setHomeType: (v: HomeType) => void;
  bedrooms: number; setBedrooms: (v: number) => void;
  heating: HeatingType; setHeating: (v: HeatingType) => void;
  people: number; setPeople: (v: number) => void;
  hasEV: boolean; setHasEV: (v: boolean) => void;
  homeDuringDay: boolean; setHomeDuringDay: (v: boolean) => void;
  estimate: { elec: number; gas: number };
}) {
  return (
    <>
      <QLabel>What kind of home is it?</QLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        {(["flat", "terraced", "semi", "detached"] as HomeType[]).map(t => (
          <OptionBtn key={t} selected={homeType === t} onClick={() => setHomeType(t)}>
            {{ flat: "Flat", terraced: "Terraced", semi: "Semi-detached", detached: "Detached" }[t]}
          </OptionBtn>
        ))}
      </div>

      <QLabel>How many bedrooms?</QLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <OptionBtn key={n} selected={bedrooms === n} onClick={() => setBedrooms(n)} xstyle={{ flex: 1 }}>{n === 5 ? "5+" : String(n)}</OptionBtn>
        ))}
      </div>

      <QLabel>How is it heated?</QLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        {([
          { id: "gas", label: "Gas" }, { id: "electricity", label: "Electricity" },
          { id: "heat_pump", label: "Heat pump" }, { id: "other", label: "Other" },
        ] as { id: HeatingType; label: string }[]).map(({ id, label }) => (
          <OptionBtn key={id} selected={heating === id} onClick={() => setHeating(id)}>{label}</OptionBtn>
        ))}
      </div>

      <QLabel>How many people live there?</QLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <OptionBtn key={n} selected={people === n} onClick={() => setPeople(n)} xstyle={{ flex: 1 }}>{n === 5 ? "5+" : String(n)}</OptionBtn>
        ))}
      </div>

      <QLabel>Electric vehicle?</QLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <OptionBtn selected={hasEV} onClick={() => setHasEV(true)} xstyle={{ flex: 1 }}>Yes</OptionBtn>
        <OptionBtn selected={!hasEV} onClick={() => setHasEV(false)} xstyle={{ flex: 1 }}>No</OptionBtn>
      </div>

      <QLabel>Someone home during the day?</QLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <OptionBtn selected={homeDuringDay} onClick={() => setHomeDuringDay(true)} xstyle={{ flex: 1 }}>Usually yes</OptionBtn>
        <OptionBtn selected={!homeDuringDay} onClick={() => setHomeDuringDay(false)} xstyle={{ flex: 1 }}>Mostly out</OptionBtn>
      </div>

      <EstimateSummary elec={estimate.elec} gas={estimate.gas} updated={true} />
    </>
  );
}

function RawKwhView({ rawElec, setRawElec, rawGas, setRawGas }: {
  rawElec: string; setRawElec: (v: string) => void;
  rawGas: string; setRawGas: (v: string) => void;
}) {
  return (
    <>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginBottom: 20, lineHeight: 1.65 }}>
        You&apos;ll find your annual usage on a recent energy bill or your online account.
      </p>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Electricity (kWh per year)</div>
        <input type="number" value={rawElec} onChange={e => setRawElec(e.target.value)} placeholder="e.g. 1800" style={{ width: "100%", padding: "13px 14px", borderRadius: 10, border: "none", background: "#fff", fontSize: 15, color: "#0b1f3a", outline: "none", boxSizing: "border-box" }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Gas (kWh per year)</div>
        <input type="number" value={rawGas} onChange={e => setRawGas(e.target.value)} placeholder="e.g. 6700" style={{ width: "100%", padding: "13px 14px", borderRadius: 10, border: "none", background: "#fff", fontSize: 15, color: "#0b1f3a", outline: "none", boxSizing: "border-box" }} />
      </div>
    </>
  );
}

function EstimateSummary({ elec, gas, updated }: { elec: number; gas: number; updated: boolean }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 16px", marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 12, color: updated ? CTA : "rgba(255,255,255,0.45)", marginBottom: 3, fontWeight: updated ? 700 : 400 }}>
          {updated ? "Updated estimate" : "Current estimate"}
        </div>
        <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>
          {gas > 0 ? `Gas ${gas.toLocaleString()} kWh · ` : ""}Elec {elec.toLocaleString()} kWh
        </div>
      </div>
      {updated && (
        <div style={{ background: "rgba(170,255,31,0.12)", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: CTA, fontWeight: 700, flexShrink: 0 }}>Updated</div>
      )}
    </div>
  );
}

function QLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 10 }}>{children}</div>;
}

function OptionBtn({ selected, onClick, children, xstyle }: {
  selected: boolean; onClick: () => void; children: React.ReactNode; xstyle?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "11px 8px", borderRadius: 8, cursor: "pointer", fontSize: 14,
        color: "#fff",
        border: selected ? "2px solid rgba(255,255,255,0.75)" : "2px solid rgba(255,255,255,0.15)",
        background: selected ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.07)",
        fontWeight: selected ? 600 : 400,
        flex: 1,
        ...xstyle,
      }}
    >
      {children}
    </button>
  );
}

// ── Step 4: Tariffs ───────────────────────────────────────────────────────────

function Step4({ elec, gas, onBack, onSelectTariff }: {
  elec: number; gas: number; onBack: () => void; onSelectTariff: (t: TariffType) => void;
}) {
  const [allRatesOpen, setAllRatesOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const fixPrice = calcMonthly(elec, gas, TARIFF_RATES.fix);
  const varPrice = calcMonthly(elec, gas, TARIFF_RATES.var);
  const priceDiff = Math.abs(fixPrice - varPrice);

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
          price={fixPrice}
          priceDiff={priceDiff}
          ratesOpen={allRatesOpen}
          onToggleRates={() => setAllRatesOpen(o => !o)}
          onSelect={() => onSelectTariff("fix")}
          ratesPanel={<RatesPanel
            elecUnit={`${TARIFF_RATES.fix.elecUnit}p per kWh`}
            elecStanding={`${TARIFF_RATES.fix.elecStanding}p per day`}
            elecExit="£75 per fuel"
            gasUnit={`${TARIFF_RATES.fix.gasUnit}p per kWh`}
            gasStanding={`${TARIFF_RATES.fix.gasStanding}p per day`}
            gasExit="£75 per fuel"
          />}
        />
        <AlternativeCard
          price={varPrice}
          ratesOpen={allRatesOpen}
          onToggleRates={() => setAllRatesOpen(o => !o)}
          onSelect={() => onSelectTariff("var")}
          ratesPanel={<RatesPanel
            elecUnit={`${TARIFF_RATES.var.elecUnit}p per kWh`}
            elecStanding={`${TARIFF_RATES.var.elecStanding}p per day`}
            elecExit="£0"
            gasUnit={`${TARIFF_RATES.var.gasUnit}p per kWh`}
            gasStanding={`${TARIFF_RATES.var.gasStanding}p per day`}
            gasExit="£0"
          />}
        />
      </div>

      {/* Help me choose trigger */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, marginBottom: 14 }}>Still not sure which one&apos;s right for you?</div>
        <button
          onClick={() => setHelpOpen(true)}
          style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 24px 8px 8px", background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.35)", borderRadius: 28, fontSize: 15, fontWeight: 600, cursor: "pointer" }}
        >
          <Image src="/advisor.jpg" alt="" width={36} height={36} style={{ borderRadius: "50%", objectFit: "cover", objectPosition: "center top", flexShrink: 0 }} />
          Help me choose
        </button>
      </div>

      <HelpPanel
        open={helpOpen}
        fixPrice={fixPrice}
        varPrice={varPrice}
        onSelectTariff={(t) => { onSelectTariff(t); setHelpOpen(false); }}
        onClose={() => setHelpOpen(false)}
      />
    </div>
  );
}

// ── Suggestion card (Fix & Fall) ─────────────────────────────────────────────

function SuggestionCard({ price, priceDiff, ratesOpen, onToggleRates, onSelect, ratesPanel }: {
  price: number; priceDiff: number;
  ratesOpen: boolean; onToggleRates: () => void; onSelect: () => void; ratesPanel: React.ReactNode;
}) {
  const [exitOpen, setExitOpen] = useState(false);

  return (
    <div
      style={{
        background: "rgba(10,30,80,0.7)",
        border: `1.5px solid ${CTA}`,
        borderRadius: 20,
        padding: "40px 32px 28px",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(8px)",
        position: "relative",
        boxShadow: `0 0 24px rgba(170,255,31,0.05)`,
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
      <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Fix &amp; Fall Jun28</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>Peace of mind, without the usual catch.</div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 50, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-1px" }}>{fmtPrice(price)}</span>
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Monthly estimate (inc. VAT)</div>

      {/* Body */}
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.75, marginBottom: 16, flex: 1 }}>
        Your rate&apos;s fixed until June 2028, so a price rise won&apos;t touch you. And if prices fall, yours falls too. You get certainty now, with a bit of upside if the market drops.
      </p>

      {/* Trade-off line */}
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 20 }}>
        It&apos;s around {fmtPrice(priceDiff)} a month more than our variable tariff today, with a £75 per fuel charge if you leave early. That&apos;s the cost of locking in your protection.
      </p>

      {/* Meta */}
      <div style={{ fontSize: 13, marginBottom: 6, display: "flex", gap: 8 }}>
        <span style={{ color: "#60a5fa", width: 110, flexShrink: 0 }}>Duration:</span>
        <span style={{ color: "#fff", fontWeight: 600 }}>12 months</span>
      </div>
      <div style={{ fontSize: 13, marginBottom: 28, display: "flex", gap: 8 }}>
        <span style={{ color: "#60a5fa", width: 110, flexShrink: 0 }}>Early exit fee:</span>
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

function AlternativeCard({ price, ratesOpen, onToggleRates, onSelect, ratesPanel }: {
  price: number;
  ratesOpen: boolean; onToggleRates: () => void; onSelect: () => void; ratesPanel: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "rgba(10,25,65,0.6)",
        border: "1.5px solid rgba(255,255,255,0.18)",
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
        <span style={{ fontSize: 48, fontWeight: 900, color: "rgba(255,255,255,0.85)", lineHeight: 1, letterSpacing: "-1px" }}>{fmtPrice(price)}</span>
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Monthly estimate (inc. VAT)</div>

      {/* Body */}
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 20, flex: 1 }}>
        Your prices aren&apos;t fixed. They move up or down in line with the Ofgem price cap. There&apos;s no exit fee, so you&apos;re free to leave whenever you like.
      </p>

      {/* Meta */}
      <div style={{ fontSize: 13, marginBottom: 28, display: "flex", gap: 8 }}>
        <span style={{ color: "rgba(148,197,253,0.7)", width: 110, flexShrink: 0 }}>Early exit fee:</span>
        <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>£0 per fuel</span>
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

const RATE_TIPS: Record<string, string> = {
  "Unit rate": "The price you pay per kWh of energy you actually use.",
  "Standing charge": "A fixed daily charge just for being connected to the grid — applies whether you use energy or not.",
  "Early exit fee": "A charge if you leave this tariff before the end of the contract period.",
};

function RR({ label, value, border, bb }: { label: string; value: string; border?: boolean; bb?: boolean }) {
  const tip = RATE_TIPS[label];
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", fontSize: 13, borderBottom: border ? "1px solid rgba(255,255,255,0.08)" : bb ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
      <span style={{ color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 5 }}>
        {label}
        {tip && <Tooltip text={tip} />}
      </span>
      <span style={{ fontWeight: 600, color: "#fff" }}>{value}</span>
    </div>
  );
}

function Tooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, color: "rgba(255,255,255,0.35)", display: "flex", lineHeight: 1 }}
        aria-label={`What is ${text}`}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="6.5" cy="6.5" r="6" stroke="currentColor" strokeWidth="1.2"/>
          <text x="6.5" y="9.5" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="700" fontFamily="sans-serif">i</text>
        </svg>
      </button>
      {visible && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
          background: "#0a1e4a", border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.85)", fontSize: 12, lineHeight: 1.5,
          padding: "8px 10px", borderRadius: 8, width: 200, zIndex: 99,
          pointerEvents: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

// ── Help me choose — two-question guided flow ─────────────────────────────────

type Q1Answer = "reliable" | "cheap" | null;
type Q2Answer = "settled" | "flexible" | null;
type HelpView = "questions" | "result";

function HelpMeChoose({ fixPrice, varPrice, onSelectTariff, onClose }: {
  fixPrice: number; varPrice: number;
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
        ? "You want a bill you can count on and you're staying put. Fixing your rate until June 2028 gives you that, and it still drops if prices fall."
        : "A reliable bill matters most to you. Fix & Fall locks your rate until June 2028 and still falls if prices drop. Just note the £75 per fuel exit fee if you move before then.";
    } else {
      return q2 === "flexible"
        ? "Lowest price matters most and you want to stay flexible. Standard Variable is cheaper right now, with no exit fee, so you can leave whenever you like."
        : "You're after the lowest price today. Standard Variable is the cheaper option now, with no exit fee, though the rate can move up or down with the price cap.";
    }
  }

  const suggestedName = suggestedTariff === "fix" ? "Fix & Fall Jun28" : "Standard Variable";
  const suggestedPrice = fmtPrice(suggestedTariff === "fix" ? fixPrice : varPrice);

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
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Monthly estimate (inc. VAT)</div>

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

function HelpPanel({ open, fixPrice, varPrice, onSelectTariff, onClose }: {
  open: boolean; fixPrice: number; varPrice: number;
  onSelectTariff: (t: TariffType) => void; onClose: () => void;
}) {
  if (!open) return null;
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 55 }}
        aria-hidden="true"
      />

      {/* Desktop drawer */}
      <div
        className="help-drawer-desktop"
        role="dialog"
        aria-modal="true"
        aria-label="Help me choose"
        style={{ position: "fixed", top: 0, right: 0, height: "100%", width: 460, background: "#0c2550", zIndex: 60, padding: "32px 28px 48px", overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,0.5)" }}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", display: "flex" }} aria-label="Close">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
        </button>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6, marginTop: 8 }}>Help me choose</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>Answer two quick questions and we&apos;ll suggest the right tariff for you.</div>
        <HelpMeChoose fixPrice={fixPrice} varPrice={varPrice} onSelectTariff={onSelectTariff} onClose={onClose} />
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
        <HelpMeChoose fixPrice={fixPrice} varPrice={varPrice} onSelectTariff={onSelectTariff} onClose={onClose} />
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
            {/* Nav buttons — inside card on desktop, fixed bottom on mobile */}
            <div className="nav-buttons-sticky nav-buttons-in-card">
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onBack} style={{ padding: "14px 24px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Previous</button>
                <button onClick={onNext} style={{ flex: 1, padding: 14, background: CTA, color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Continue</button>
              </div>
            </div>
          </div>
          <TrustpilotBadge />
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

function Confirmation({ tariff, elec, gas }: { tariff: TariffType; elec: number; gas: number }) {
  const fix = tariff === "fix";
  const price = fmtPrice(calcMonthly(elec, gas, fix ? TARIFF_RATES.fix : TARIFF_RATES.var));
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 12 }}>{fix ? "Fix & Fall Jun28 selected" : "Standard Variable selected"}</div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{fix ? "Great choice. Your rate is locked in — and if prices fall, yours will too." : "No problem. You're on the flexible tariff with no lock-in."}</div>
        <div style={{ marginTop: 32, fontSize: 36, fontWeight: 800, color: CTA }}>{price}<span style={{ fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>/mo estimated</span></div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function QuoteJourney() {
  const [step, setStep] = useState(1);
  const [fuel, setFuel] = useState<FuelType>("dual");
  const [smartDevices, setSmartDevices] = useState<Set<SmartDevice>>(new Set());
  const [elec, setElec] = useState(2700);
  const [gas, setGas] = useState(11500);
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
          {step === 5 && selectedTariff && <Confirmation tariff={selectedTariff} elec={elec} gas={gas} />}
        </div>
      </div>
    </div>
  );
}
