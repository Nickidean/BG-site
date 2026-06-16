"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type FuelType = "dual" | "gas" | "electric";
type SmartDevice = "heat_pump" | "ev" | "solar" | "battery";
type TariffType = "fix" | "var";

// ── Step progress bar ─────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          style={{
            height: 4,
            flex: 1,
            borderRadius: 4,
            background: n <= step ? "#b2f53d" : "rgba(255,255,255,0.2)",
            transition: "background 0.3s",
          }}
        />
      ))}
    </div>
  );
}

// ── Step 1: Address ───────────────────────────────────────────────────────────

function Step1({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <div style={{ background: "#1a4fd6", borderRadius: 20, padding: "28px 24px 24px" }}>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.65)", fontSize: 13, marginBottom: 10 }}>Step 1 of 4</div>
        <div style={{ textAlign: "center", color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Let&apos;s find your address</div>
        <input
          type="text"
          placeholder="Enter your postcode e.g. DT6 3HY"
          style={{ display: "block", width: "100%", padding: "13px 14px", borderRadius: 10, border: "none", background: "#fff", fontSize: 15, color: "#0b1f3a", outline: "none", marginBottom: 12, boxSizing: "border-box" }}
        />
        <select
          style={{ display: "block", width: "100%", padding: "13px 14px", borderRadius: 10, border: "none", background: "#fff", fontSize: 15, color: "#0b1f3a", outline: "none", marginBottom: 4, boxSizing: "border-box" }}
          defaultValue="24"
        >
          <option value="">Select address</option>
          <option value="24">24 Millstream, Maidenhead Rd</option>
          <option value="12">12 Millstream, Maidenhead Rd</option>
          <option value="8">8 Millstream, Maidenhead Rd</option>
        </select>
        <button
          onClick={onNext}
          style={{ display: "block", width: "100%", marginTop: 16, padding: 15, background: "#b2f53d", color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
        >
          Choose this address
        </button>
      </div>
      <TrustpilotBadge />
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

function Step2({
  fuel,
  setFuel,
  smartDevices,
  setSmartDevices,
  onNext,
  onBack,
}: {
  fuel: FuelType;
  setFuel: (f: FuelType) => void;
  smartDevices: Set<SmartDevice>;
  setSmartDevices: (s: Set<SmartDevice>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  function toggleSmart(id: SmartDevice) {
    const next = new Set(smartDevices);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSmartDevices(next);
  }

  return (
    <div>
      <div style={{ background: "#1a4fd6", borderRadius: 20, padding: "28px 24px 24px" }}>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.65)", fontSize: 13, marginBottom: 10 }}>Step 2 of 4</div>
        <div style={{ textAlign: "center", color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 24 }}>What fuel do you need?</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {FUEL_OPTIONS.map(({ id, label }) => {
            const selected = fuel === id;
            return (
              <div
                key={id}
                onClick={() => setFuel(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "13px 14px",
                  borderRadius: 10, cursor: "pointer", fontSize: 15, color: "#fff",
                  border: selected ? "2px solid #b2f53d" : "2px solid rgba(255,255,255,0.15)",
                  background: selected ? "rgba(178,245,61,0.1)" : "rgba(255,255,255,0.08)",
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                  border: selected ? "2px solid #b2f53d" : "2px solid rgba(255,255,255,0.4)",
                  background: selected ? "#b2f53d" : "transparent",
                }} />
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
              <div
                key={id}
                onClick={() => toggleSmart(id)}
                style={{
                  padding: "11px 10px", borderRadius: 10, cursor: "pointer", fontSize: 14, color: "#fff",
                  border: on ? "2px solid #b2f53d" : "2px solid rgba(255,255,255,0.15)",
                  background: on ? "rgba(178,245,61,0.1)" : "rgba(255,255,255,0.08)",
                }}
              >
                {emoji} {label}
              </div>
            );
          })}
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
      <TrustpilotBadge />
    </div>
  );
}

// ── Step 3: Usage ─────────────────────────────────────────────────────────────

function Step3({
  elec,
  setElec,
  gas,
  setGas,
  onNext,
  onBack,
}: {
  elec: number;
  setElec: (v: number) => void;
  gas: number;
  setGas: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [elecDraft, setElecDraft] = useState(String(elec));
  const [gasDraft, setGasDraft] = useState(String(gas));

  function saveUsage() {
    setElec(parseInt(elecDraft) || 1800);
    setGas(parseInt(gasDraft) || 6700);
    setEditOpen(false);
  }

  return (
    <div>
      <div style={{ background: "#1a4fd6", borderRadius: 20, padding: "28px 24px 24px" }}>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.65)", fontSize: 13, marginBottom: 10 }}>Step 3 of 4</div>
        <div style={{ textAlign: "center", color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 24 }}>How much energy do you use a year?</div>

        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, textAlign: "center", marginBottom: 14 }}>We&apos;ve found the energy usage at the property</div>
          <Row label="Address" value="24 Millstream, Maidenhead Rd" border />
          <Row label="Electricity per year" value={`${elec.toLocaleString()} kWh`} border />
          <Row label="Gas per year" value={`${gas.toLocaleString()} kWh`} />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 10 }}>
            We&apos;ve used the latest yearly energy estimate for this property.
          </div>
        </div>

        <button
          onClick={() => setEditOpen((o) => !o)}
          style={{ display: "block", width: "100%", padding: 13, background: "#fff", color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}
        >
          Edit usage
        </button>

        {editOpen && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Electricity (kWh)</div>
                <input
                  type="number"
                  value={elecDraft}
                  onChange={(e) => setElecDraft(e.target.value)}
                  style={{ width: "100%", padding: "11px 12px", borderRadius: 8, border: "none", background: "#fff", fontSize: 14, color: "#0b1f3a", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Gas (kWh)</div>
                <input
                  type="number"
                  value={gasDraft}
                  onChange={(e) => setGasDraft(e.target.value)}
                  style={{ width: "100%", padding: "11px 12px", borderRadius: 8, border: "none", background: "#fff", fontSize: 14, color: "#0b1f3a", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>
            <button
              onClick={saveUsage}
              style={{ display: "block", width: "100%", padding: 13, background: "#b2f53d", color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
            >
              Save usage
            </button>
          </div>
        )}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
      <TrustpilotBadge />
    </div>
  );
}

function Row({ label, value, border }: { label: string; value: string; border?: boolean }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 14,
      borderBottom: border ? "1px solid rgba(255,255,255,0.1)" : "none",
    }}>
      <span style={{ color: "#93c5fd" }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

// ── Step 4: Tariffs ───────────────────────────────────────────────────────────

function Step4({
  elec,
  gas,
  onBack,
  onSelectTariff,
}: {
  elec: number;
  gas: number;
  onBack: () => void;
  onSelectTariff: (t: TariffType) => void;
}) {
  const [ratesOpen, setRatesOpen] = useState<"fix" | "var" | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  return (
    <div>
      <div style={{ textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 8 }}>Step 4 of 4</div>
      <div style={{ textAlign: "center", color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Your tariff options</div>

      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>
        <div><strong style={{ color: "#fff" }}>Address</strong> 24 Millstream, Maidenhead Rd, Windsor, SL4 5GD</div>
        <div style={{ marginTop: 4 }}>
          <strong style={{ color: "#fff" }}>Fuel</strong> Gas &amp; electricity &nbsp;·&nbsp;{" "}
          <strong style={{ color: "#fff" }}>Usage</strong> Elec: {elec.toLocaleString()} kWh · Gas: {gas.toLocaleString()} kWh &nbsp;
          <span onClick={onBack} style={{ color: "#b2f53d", cursor: "pointer", textDecoration: "underline" }}>Edit</span>
        </div>
      </div>

      {/* Fix & Fall */}
      <div style={{ background: "rgba(255,255,255,0.07)", border: "2px solid #b2f53d", borderRadius: 16, padding: 20, position: "relative", marginBottom: 12 }}>
        <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: "#b2f53d", color: "#0b1f3a", fontSize: 11, fontWeight: 700, padding: "3px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>
          Most popular
        </div>
        <TariffHeader name="Fix & Fall tariff" price="£103.28" />
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 12, lineHeight: 1.5 }}>
          Your rate&apos;s fixed — but if prices fall, yours will too. Certainty with upside.
        </p>
        <TariffMeta duration="12 months" exitFee="£75 per fuel" />
        <button onClick={() => onSelectTariff("fix")} style={selectBtnStyle}>Select this tariff</button>
        <button onClick={() => setRatesOpen(ratesOpen === "fix" ? null : "fix")} style={viewRatesBtnStyle}>
          View rates {ratesOpen === "fix" ? "▴" : "▾"}
        </button>
        {ratesOpen === "fix" && (
          <RatesPanel
            elecUnit="25.79p per kWh" elecStanding="47.632p per day" elecExit="£75 per fuel"
            gasUnit="6.642p per kWh" gasStanding="28.262p per day" gasExit="£75 per fuel"
          />
        )}
      </div>

      {/* Standard Variable */}
      <div style={{ background: "rgba(255,255,255,0.07)", border: "2px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <TariffHeader name="Standard Variable tariff" price="£98.01" />
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 12, lineHeight: 1.5 }}>
          Prices move with the Ofgem price cap. No lock-in, no exit fee.
        </p>
        <TariffMeta exitFee="£0 per fuel" />
        <button onClick={() => onSelectTariff("var")} style={selectBtnStyle}>Select this tariff</button>
        <button onClick={() => setRatesOpen(ratesOpen === "var" ? null : "var")} style={viewRatesBtnStyle}>
          View rates {ratesOpen === "var" ? "▴" : "▾"}
        </button>
        {ratesOpen === "var" && (
          <RatesPanel
            elecUnit="24.936p per kWh" elecStanding="53.937p per day" elecExit="£0"
            gasUnit="5.673p per kWh" gasStanding="28.744p per day" gasExit="£0"
          />
        )}
      </div>

      <button
        onClick={() => setOverlayOpen(true)}
        style={{ display: "block", width: "100%", padding: 14, background: "transparent", color: "rgba(255,255,255,0.8)", border: "2px solid rgba(255,255,255,0.25)", borderRadius: 10, fontSize: 14, cursor: "pointer" }}
      >
        Not sure which is right for you? Help me choose
      </button>

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

const selectBtnStyle: React.CSSProperties = {
  display: "block", width: "100%", padding: 13, background: "#b2f53d", color: "#0b1f3a",
  border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 8,
};

const viewRatesBtnStyle: React.CSSProperties = {
  display: "block", width: "100%", padding: 11, background: "transparent", color: "rgba(255,255,255,0.8)",
  border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, fontSize: 14, cursor: "pointer",
};

function TariffHeader({ name, price }: { name: string; price: string }) {
  return (
    <>
      <div style={{ color: "#93c5fd", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: "#fff" }}>{price}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>per month estimate</div>
    </>
  );
}

function TariffMeta({ duration, exitFee }: { duration?: string; exitFee: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {duration && (
        <div style={{ fontSize: 13, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Duration</span>
          <span style={{ fontWeight: 600 }}>{duration}</span>
        </div>
      )}
      <div style={{ fontSize: 13, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "rgba(255,255,255,0.5)" }}>Exit fee</span>
        <span style={{ fontWeight: 600 }}>{exitFee}</span>
      </div>
    </div>
  );
}

function RatesPanel({ elecUnit, elecStanding, elecExit, gasUnit, gasStanding, gasExit }: {
  elecUnit: string; elecStanding: string; elecExit: string;
  gasUnit: string; gasStanding: string; gasExit: string;
}) {
  return (
    <div style={{ marginTop: 12, background: "rgba(0,0,0,0.25)", borderRadius: 10, padding: 14 }}>
      <div style={{ color: "#93c5fd", fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Electricity</div>
      <RateRow label="Unit rate" value={elecUnit} border />
      <RateRow label="Standing charge" value={elecStanding} border />
      <RateRow label="Early exit fee" value={elecExit} bottomBorder />
      <div style={{ color: "#93c5fd", fontSize: 12, fontWeight: 600, margin: "12px 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Gas</div>
      <RateRow label="Unit rate" value={gasUnit} border />
      <RateRow label="Standing charge" value={gasStanding} border />
      <RateRow label="Early exit fee" value={gasExit} />
    </div>
  );
}

function RateRow({ label, value, border, bottomBorder }: { label: string; value: string; border?: boolean; bottomBorder?: boolean }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13,
      borderBottom: border ? "1px solid rgba(255,255,255,0.08)" : bottomBorder ? "1px solid rgba(255,255,255,0.15)" : "none",
    }}>
      <span style={{ color: "rgba(255,255,255,0.6)" }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

// ── Help me choose overlay ────────────────────────────────────────────────────

function HelpOverlay({ onSelectFix, onSelectVar, onClose }: {
  onSelectFix: () => void; onSelectVar: () => void; onClose: () => void;
}) {
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 10 }}
      />
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "#0f2d5e", borderRadius: "20px 20px 0 0", zIndex: 20, padding: "24px 20px 32px",
      }}>
        <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.25)", borderRadius: 4, margin: "0 auto 20px" }} />
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Help me choose</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 24 }}>Here&apos;s what makes each tariff different</div>

        <div style={{ background: "rgba(178,245,61,0.08)", border: "1px solid rgba(178,245,61,0.3)", borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Fix &amp; Fall</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>£103.28<span style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>/mo</span></div>
          </div>
          <ComparisonPoint icon="✓" text="Rate fixed for 12 months — no surprise rises" />
          <ComparisonPoint icon="✓" text="If prices fall, your rate falls too" />
          <ComparisonPoint icon="✗" text="£75 exit fee per fuel if you leave early" negative />
          <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.45)", fontStyle: "italic" }}>Good if you want certainty and protection against price rises</div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: 16, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Standard Variable</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>£98.01<span style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>/mo</span></div>
          </div>
          <ComparisonPoint icon="✓" text="Cheaper right now — saves ~£5 a month" />
          <ComparisonPoint icon="✓" text="No exit fee — leave any time" />
          <ComparisonPoint icon="✗" text="Prices can rise with the Ofgem price cap" negative />
          <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.45)", fontStyle: "italic" }}>Good if you want flexibility and aren&apos;t worried about price changes</div>
        </div>

        <button onClick={onSelectFix} style={{ display: "block", width: "100%", padding: 14, background: "#b2f53d", color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
          Select Fix &amp; Fall — £103.28/mo
        </button>
        <button onClick={onSelectVar} style={{ display: "block", width: "100%", padding: 14, background: "#ffffff", color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>
          Select Standard Variable — £98.01/mo
        </button>
        <button onClick={onClose} style={{ display: "block", width: "100%", padding: 12, background: "transparent", color: "rgba(255,255,255,0.5)", border: "none", fontSize: 14, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </>
  );
}

function ComparisonPoint({ icon, text, negative }: { icon: string; text: string; negative?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 8 }}>
      <span style={{ color: negative ? "rgba(255,100,100,0.9)" : "#b2f53d", flexShrink: 0 }}>{icon}</span>
      {text}
    </div>
  );
}

// ── Shared components ─────────────────────────────────────────────────────────

function NavButtons({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
      <button onClick={onBack} style={{ padding: "15px 24px", background: "#ffffff", color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
        Previous
      </button>
      <button onClick={onNext} style={{ flex: 1, padding: 15, background: "#b2f53d", color: "#0b1f3a", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
        Continue
      </button>
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

// ── Confirmation screen ───────────────────────────────────────────────────────

function Confirmation({ tariff }: { tariff: TariffType }) {
  const isFixed = tariff === "fix";
  return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
        {isFixed ? "Fix & Fall tariff selected" : "Standard Variable tariff selected"}
      </div>
      <div style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
        {isFixed
          ? "Great choice. Your rate is locked in — and if prices fall, yours will too."
          : "No problem. You're on the flexible tariff with no lock-in."}
      </div>
      <div style={{ marginTop: 32, fontSize: 28, fontWeight: 800, color: "#b2f53d" }}>
        {isFixed ? "£103.28" : "£98.01"}<span style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>/mo estimated</span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function QuoteJourney() {
  const [step, setStep] = useState(1);
  const [fuel, setFuel] = useState<FuelType>("dual");
  const [smartDevices, setSmartDevices] = useState<Set<SmartDevice>>(new Set());
  const [elec, setElec] = useState(1800);
  const [gas, setGas] = useState(6700);
  const [selectedTariff, setSelectedTariff] = useState<TariffType | null>(null);

  function handleSelectTariff(t: TariffType) {
    setSelectedTariff(t);
    setStep(5);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b1f3a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px 60px" }}>
      <div style={{ width: "100%", maxWidth: 480, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#fff" }}>
        {step < 5 && <ProgressBar step={step} />}

        {step === 1 && <Step1 onNext={() => setStep(2)} />}
        {step === 2 && (
          <Step2
            fuel={fuel} setFuel={setFuel}
            smartDevices={smartDevices} setSmartDevices={setSmartDevices}
            onNext={() => setStep(3)} onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step3
            elec={elec} setElec={setElec}
            gas={gas} setGas={setGas}
            onNext={() => setStep(4)} onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <Step4
            elec={elec} gas={gas}
            onBack={() => setStep(3)}
            onSelectTariff={handleSelectTariff}
          />
        )}
        {step === 5 && selectedTariff && <Confirmation tariff={selectedTariff} />}
      </div>
    </div>
  );
}
