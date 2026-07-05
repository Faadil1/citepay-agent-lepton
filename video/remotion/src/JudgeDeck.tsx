// video/remotion/src/JudgeDeck.tsx
// Premium judge-facing explainer — CitePay Agent
// 1920×1080 · 30fps · 120s

import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  spring,
} from "remotion";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:       "#0A0B0D",
  bg2:      "#0F1012",
  text:     "#ECEAE5",
  muted:    "#777B85",
  muted2:   "#4A4E57",
  open:     "#B8FF3D",
  openDim:  "rgba(184,255,61,0.07)",
  closed:   "#FF4444",
  closedDim:"rgba(255,68,68,0.07)",
  arc:      "#5B9BF8",
  arcDim:   "rgba(91,155,248,0.07)",
  amber:    "#E9A825",
  amberDim: "rgba(233,168,37,0.07)",
  border:   "#1C1E22",
  border2:  "#2A2D34",
};

const MONO  = "'IBM Plex Mono', 'Courier New', monospace";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS  = "'Inter', system-ui, sans-serif";

const FPS = 30;
const f   = (s: number) => Math.round(s * FPS);

// ─── Animation hooks ──────────────────────────────────────────────────────────

function useFadeIn(delayFrames = 0, durationFrames = 18): number {
  const frame = useCurrentFrame();
  return interpolate(
    frame,
    [delayFrames, delayFrames + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}

function useSpr(
  delayFrames = 0,
  cfg: { damping: number; stiffness: number } = { damping: 15, stiffness: 80 }
): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delayFrames, fps, config: { ...cfg, mass: 1 } });
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────

const SceneBg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: C.bg }}>{children}</AbsoluteFill>
);

const TopChrome: React.FC = () => {
  const op = useFadeIn(0, 12);
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 44,
      background: C.bg2, borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center",
      padding: "0 56px", justifyContent: "space-between",
      fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em",
      textTransform: "uppercase", color: C.muted,
      opacity: op, zIndex: 10,
    }}>
      <span>CITEPAY AGENT · LEPTON HACKATHON</span>
      <span style={{ color: C.arc }}>ARC TESTNET · EIP155:5042002</span>
    </div>
  );
};

// ─── Scene 1: Hook (0–8s = 240 frames) ───────────────────────────────────────

export const HookScene: React.FC = () => {
  const frame    = useCurrentFrame();
  const labelOp  = useFadeIn(0, 12);
  const titleOp  = useFadeIn(8, 22);
  const titleY   = interpolate(frame, [8, 30], [28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ruleOp   = useFadeIn(28, 14);
  const subOp    = useFadeIn(38, 18);
  const subY     = interpolate(frame, [38, 56], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneBg>
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "flex-start", justifyContent: "center",
        padding: "0 120px",
      }}>
        <div style={{
          fontFamily: MONO, fontSize: 11, letterSpacing: "0.26em",
          textTransform: "uppercase", color: C.open,
          marginBottom: 32, opacity: labelOp,
        }}>
          PAYMENT-GATED CITATION
        </div>

        <div style={{
          fontFamily: SERIF, fontSize: 108, fontWeight: 700,
          color: C.text, lineHeight: 1.0, letterSpacing: "-0.025em",
          opacity: titleOp, transform: `translateY(${titleY}px)`,
        }}>
          No pay,<br />no cite.
        </div>

        <div style={{
          width: 72, height: 3, background: C.open,
          borderRadius: 2, margin: "36px 0 32px 0", opacity: ruleOp,
        }} />

        <div style={{
          fontFamily: SANS, fontSize: 26, color: C.muted,
          lineHeight: 1.6, maxWidth: 780,
          opacity: subOp, transform: `translateY(${subY}px)`,
        }}>
          An agent should not cite a source it did not pay.
        </div>
      </AbsoluteFill>
    </SceneBg>
  );
};

// ─── Scene 2: Product promise (8–18s = 300 frames) ───────────────────────────

const StepCard: React.FC<{
  index: number;
  label: string;
  desc: string;
  delay: number;
}> = ({ index, label, desc, delay }) => {
  const prog = useSpr(delay, { damping: 16, stiffness: 80 });
  return (
    <div style={{
      flex: 1,
      background: C.bg2, border: `1px solid ${C.border2}`,
      borderRadius: 8, padding: "36px 30px",
      opacity: prog, transform: `translateY(${(1 - prog) * 24}px)`,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        fontFamily: MONO, fontSize: 10, color: C.muted,
        letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16,
      }}>
        STEP {index + 1}
      </div>
      <div style={{
        fontFamily: SANS, fontSize: 20, color: C.text,
        fontWeight: 600, marginBottom: 10, lineHeight: 1.35,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: MONO, fontSize: 12, color: C.muted,
        lineHeight: 1.6, whiteSpace: "pre-line",
      }}>
        {desc}
      </div>
    </div>
  );
};

const StepArrow: React.FC<{ delay: number }> = ({ delay }) => {
  const op = useFadeIn(delay, 14);
  return (
    <div style={{
      fontFamily: MONO, fontSize: 24, color: C.open,
      padding: "0 14px", opacity: op, flexShrink: 0,
      alignSelf: "center", lineHeight: 1,
    }}>
      →
    </div>
  );
};

const BadgeChip: React.FC<{ label: string; color: string; delay: number }> = ({ label, color, delay }) => {
  const op = useFadeIn(delay, 14);
  return (
    <div style={{
      fontFamily: MONO, fontSize: 10, letterSpacing: "0.14em",
      textTransform: "uppercase", color,
      border: `1px solid ${color}`, padding: "5px 14px",
      borderRadius: 3, opacity: op,
    }}>
      {label}
    </div>
  );
};

export const ProductPromiseScene: React.FC = () => {
  const headOp = useFadeIn(0, 14);
  return (
    <SceneBg>
      <TopChrome />
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "56px 80px 0 80px",
      }}>
        <div style={{
          fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em",
          textTransform: "uppercase", color: C.muted,
          marginBottom: 56, opacity: headOp,
        }}>
          HOW IT WORKS
        </div>

        <div style={{ display: "flex", alignItems: "stretch", width: "100%", maxWidth: 1280 }}>
          <StepCard index={0} label="Score sources" desc={"Relevance via token overlap\nPrice vs. fixed budget"} delay={0} />
          <StepArrow delay={12} />
          <StepCard index={1} label="Pay the winner" desc={"Circle Gateway x402\nArc Testnet · live settlement"} delay={14} />
          <StepArrow delay={26} />
          <StepCard index={2} label="Cite only paid source" desc={"Mechanical gate — not policy\nNo pay → no cite"} delay={28} />
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 52 }}>
          <BadgeChip label="Terminal-first agent"       color={C.muted} delay={50} />
          <BadgeChip label="Published judge proof viewer" color={C.arc} delay={58} />
          <BadgeChip label="Arc Testnet · Circle Gateway" color={C.arc} delay={66} />
        </div>
      </AbsoluteFill>
    </SceneBg>
  );
};

// ─── Scene 3: Gate logic (18–45s = 810 frames) ───────────────────────────────

const GateCard: React.FC<{
  id: string;
  title: string;
  price: string;
  extra: string;
  status: "selected" | "rejected";
  reason: string;
  delay: number;
}> = ({ id, title, price, extra, status, reason, delay }) => {
  const prog       = useSpr(delay, { damping: 14, stiffness: 75 });
  const isSelected = status === "selected";
  const col        = isSelected ? C.open : C.closed;
  const bg         = isSelected ? C.openDim : C.closedDim;

  return (
    <div style={{
      flex: 1,
      border: `1px solid ${col}`, borderRadius: 8, background: bg,
      padding: "28px 24px",
      display: "flex", flexDirection: "column", gap: 14,
      opacity: prog, transform: `translateY(${(1 - prog) * 32}px)`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: col }}>{id}</span>
        <span style={{
          fontFamily: MONO, fontSize: 9, color: col,
          border: `1px solid ${col}`, padding: "3px 8px",
          borderRadius: 2, letterSpacing: "0.14em", textTransform: "uppercase",
        }}>
          {isSelected ? "SELECTED" : "REJECTED"}
        </span>
      </div>

      <div style={{ fontFamily: SANS, fontSize: 15, color: C.text, lineHeight: 1.4 }}>
        {title}
      </div>

      <div style={{ height: 1, background: C.border }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        <div style={{ fontFamily: MONO, fontSize: 13, color: C.muted }}>
          Price <span style={{ color: C.text, marginLeft: 8 }}>{price}</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 12, color: C.muted }}>{extra}</div>
        <div style={{ fontFamily: MONO, fontSize: 13, color: col, marginTop: 4 }}>
          ↳ {reason}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
        <span style={{
          fontFamily: MONO, fontSize: 11, letterSpacing: "0.14em",
          color: col, textTransform: "uppercase", fontWeight: 600,
        }}>
          {isSelected ? "PAID · CITED" : "NOT PAID · NOT CITED"}
        </span>
      </div>
    </div>
  );
};

export const GateLogicScene: React.FC = () => {
  const headOp = useFadeIn(0, 18);
  const subOp  = useFadeIn(12, 14);

  return (
    <SceneBg>
      <TopChrome />
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "56px 64px 0 64px",
      }}>
        <div style={{
          fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em",
          textTransform: "uppercase", color: C.muted,
          marginBottom: 8, opacity: headOp,
        }}>
          CITATION GATE · AGENT V3
        </div>

        <div style={{
          fontFamily: SERIF, fontSize: 38, color: C.text, fontWeight: 700,
          marginBottom: 8, opacity: headOp, letterSpacing: "-0.01em",
        }}>
          Which source gets paid?
        </div>

        <div style={{
          fontFamily: MONO, fontSize: 13, color: C.muted,
          marginBottom: 44, opacity: subOp,
        }}>
          "How can AI agents compensate creators for cited evidence?" · Budget: 0.005 USDC
        </div>

        <div style={{ display: "flex", gap: 20, width: "100%", maxWidth: 1360 }}>
          <GateCard
            id="S1"
            title="Creator Citation Nanopayments"
            price="0.001 USDC"
            extra="Score 0.357 · Ratio 357.143"
            status="selected"
            reason="Highest relevance/price — paid"
            delay={80}
          />
          <GateCard
            id="S2"
            title="Expensive General Payments Overview"
            price="0.02 USDC"
            extra="Exceeds budget of 0.005 USDC"
            status="rejected"
            reason="OVER BUDGET"
            delay={170}
          />
          <GateCard
            id="S3"
            title="Secondary Creator Monetization Note"
            price="0.001 USDC"
            extra="Score 0 · Ratio 0"
            status="rejected"
            reason="LOWER RELEVANCE / PRICE"
            delay={260}
          />
        </div>
      </AbsoluteFill>
    </SceneBg>
  );
};

// ─── Scene 4: Sponsor tech (45–65s = 600 frames) ─────────────────────────────

const TechBox: React.FC<{
  title: string;
  sub?: string;
  borderColor?: string;
  bgColor?: string;
  minWidth?: number;
  delay: number;
}> = ({ title, sub, borderColor = C.arc, bgColor = C.arcDim, minWidth, delay }) => {
  const prog = useSpr(delay, { damping: 14, stiffness: 70 });
  return (
    <div style={{
      border: `1px solid ${borderColor}`, borderRadius: 8, background: bgColor,
      padding: "20px 28px", textAlign: "center",
      opacity: prog, transform: `translateY(${(1 - prog) * 20}px)`,
      minWidth, flexShrink: 0,
    }}>
      <div style={{ fontFamily: MONO, fontSize: 14, color: borderColor, letterSpacing: "0.06em" }}>
        {title}
      </div>
      {sub && (
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted, marginTop: 6 }}>
          {sub}
        </div>
      )}
    </div>
  );
};

const FlowArrow: React.FC<{ delay: number }> = ({ delay }) => {
  const op = useFadeIn(delay, 12);
  return (
    <div style={{
      fontFamily: MONO, fontSize: 22, color: C.open,
      padding: "0 16px", opacity: op,
      alignSelf: "center", flexShrink: 0, lineHeight: 1,
    }}>
      →
    </div>
  );
};

const EvidencePill: React.FC<{
  label: string;
  value: string;
  valueColor?: string;
  delay: number;
}> = ({ label, value, valueColor = C.open, delay }) => {
  const op = useFadeIn(delay, 14);
  return (
    <div style={{
      background: C.bg2, border: `1px solid ${C.border2}`,
      borderRadius: 6, padding: "14px 20px",
      opacity: op, textAlign: "center", flexShrink: 0,
    }}>
      <div style={{
        fontFamily: MONO, fontSize: 10, color: C.muted,
        letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 16, color: valueColor, letterSpacing: "0.04em" }}>
        {value}
      </div>
    </div>
  );
};

export const SponsorTechScene: React.FC = () => {
  const headOp = useFadeIn(0, 16);
  const subOp  = useFadeIn(10, 14);

  return (
    <SceneBg>
      <TopChrome />
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "56px 80px 0 80px",
      }}>
        <div style={{
          fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em",
          textTransform: "uppercase", color: C.muted,
          marginBottom: 8, opacity: headOp,
        }}>
          SETTLEMENT LAYER
        </div>

        <div style={{
          fontFamily: SERIF, fontSize: 38, color: C.text, fontWeight: 700,
          marginBottom: 4, opacity: headOp, letterSpacing: "-0.01em",
        }}>
          Circle Gateway x402 on Arc Testnet
        </div>

        <div style={{
          fontFamily: MONO, fontSize: 13, color: C.muted,
          marginBottom: 52, opacity: subOp,
        }}>
          Live settlement — not a simulation — testnet only
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: 48 }}>
          <TechBox title="CitePay Agent" sub="selects S1"             delay={20} minWidth={180} />
          <FlowArrow delay={40} />
          <TechBox title="Circle Gateway" sub="x402 payment request"  delay={50} minWidth={200} />
          <FlowArrow delay={70} />
          <TechBox title="Arc Testnet" sub="eip155:5042002"           delay={80} minWidth={180} />
          <FlowArrow delay={100} />
          <TechBox
            title="HTTP 200" sub="content unlocked"
            borderColor={C.open} bgColor={C.openDim}
            delay={110} minWidth={180}
          />
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <EvidencePill label="mode"   value="LIVE_GATEWAY" valueColor={C.open} delay={140} />
          <EvidencePill label="amount" value="0.001 USDC"   valueColor={C.open} delay={152} />
          <EvidencePill label="verify" value="true"         valueColor={C.open} delay={164} />
          <EvidencePill label="settle" value="true"         valueColor={C.open} delay={176} />
          <EvidencePill label="status" value="HTTP 200"     valueColor={C.open} delay={188} />
        </div>
      </AbsoluteFill>
    </SceneBg>
  );
};

// ─── Scene 5: Evidence cutaway (65–85s = 600 frames) ─────────────────────────

const EvidenceFrame: React.FC<{
  src: string;
  caption: string;
  delay: number;
}> = ({ src, caption, delay }) => {
  const prog = useSpr(delay, { damping: 16, stiffness: 80 });
  return (
    <div style={{
      flex: 1,
      border: `1px solid ${C.border2}`, borderRadius: 8, overflow: "hidden",
      background: C.bg2,
      opacity: prog, transform: `translateY(${(1 - prog) * 20}px)`,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        padding: "10px 16px", borderBottom: `1px solid ${C.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: MONO, fontSize: 13, letterSpacing: "0.14em",
        textTransform: "uppercase", color: C.muted, flexShrink: 0,
      }}>
        <span>EVIDENCE CUTAWAY</span>
        <span style={{ color: C.open }}>V3 · VERIFIED</span>
      </div>
      <div style={{
        flex: 1, padding: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <Img
          src={src}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 4 }}
        />
      </div>
      <div style={{
        padding: "12px 16px", borderTop: `1px solid ${C.border}`,
        fontFamily: MONO, fontSize: 13, color: C.muted,
        textAlign: "center", flexShrink: 0, lineHeight: 1.7,
        whiteSpace: "pre-line",
      }}>
        {caption}
      </div>
    </div>
  );
};

export const EvidenceCutawayScene: React.FC = () => {
  const headOp   = useFadeIn(0, 16);
  const titleOp  = useFadeIn(10, 16);
  const footerOp = useFadeIn(150, 16);

  return (
    <SceneBg>
      <TopChrome />
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "56px 64px 0 64px",
      }}>
        <div style={{
          fontFamily: MONO, fontSize: 12, letterSpacing: "0.22em",
          textTransform: "uppercase", color: C.muted,
          marginBottom: 6, opacity: headOp,
        }}>
          PUBLISHED PROOF VIEWER EVIDENCE
        </div>
        <div style={{
          fontFamily: SERIF, fontSize: 30, color: C.text, fontWeight: 700,
          marginBottom: 36, opacity: titleOp, letterSpacing: "-0.01em",
        }}>
          Same data as GitHub Pages proof page
        </div>

        <div style={{ display: "flex", gap: 20, width: "100%", maxWidth: 1400, flex: 1, maxHeight: 440 }}>
          <EvidenceFrame
            src={staticFile("03-live-gateway-arc-usdc.png")}
            caption={"LIVE_GATEWAY · eip155:5042002 · 0.001 USDC\nverify=true · settle=true · HTTP 200"}
            delay={20}
          />
          <EvidenceFrame
            src={staticFile("04-seller-receipt.png")}
            caption={"payTo · payer · amount · tx/ref\nfrom real seller logs"}
            delay={60}
          />
          <EvidenceFrame
            src={staticFile("06-ledger.png")}
            caption={"0.005 USDC before → 0.004 USDC after\nS1 debit: 0.001 USDC"}
            delay={100}
          />
        </div>

        <div style={{
          fontFamily: MONO, fontSize: 14, color: C.muted, marginTop: 20,
          opacity: footerOp, letterSpacing: "0.06em",
        }}>
          faadil1.github.io/citepay-agent-lepton — published judge proof viewer
        </div>
      </AbsoluteFill>
    </SceneBg>
  );
};

// ─── Scene 6: Impact (85–100s = 450 frames) ───────────────────────────────────

const ImpactCard: React.FC<{
  era: string;
  phrase: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
  delay: number;
}> = ({ era, phrase, textColor, borderColor, bgColor, delay }) => {
  const prog = useSpr(delay, { damping: 14, stiffness: 70 });
  return (
    <div style={{
      flex: 1, border: `1px solid ${borderColor}`, borderRadius: 8,
      background: bgColor, padding: "36px 36px",
      opacity: prog, transform: `translateY(${(1 - prog) * 24}px)`,
    }}>
      <div style={{
        fontFamily: MONO, fontSize: 10, color: C.muted,
        letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 20,
      }}>
        {era}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 20, color: textColor, lineHeight: 1.5 }}>
        citation = {phrase}
      </div>
    </div>
  );
};

export const ImpactScene: React.FC = () => {
  const frame   = useCurrentFrame();
  const headOp  = useFadeIn(0, 16);
  const stmtOp  = useFadeIn(10, 20);
  const arrowOp = useFadeIn(90, 14);
  const subOp   = useFadeIn(200, 18);
  const subY    = interpolate(frame, [200, 218], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneBg>
      <TopChrome />
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "56px 80px 0 80px",
      }}>
        <div style={{
          fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em",
          textTransform: "uppercase", color: C.muted,
          marginBottom: 8, opacity: headOp,
        }}>
          WHAT CHANGES
        </div>

        <div style={{
          fontFamily: SERIF, fontSize: 42, color: C.text, fontWeight: 700,
          marginBottom: 44, opacity: stmtOp, letterSpacing: "-0.02em",
          textAlign: "center",
        }}>
          Payment becomes the citation boundary.
        </div>

        <div style={{ display: "flex", width: "100%", maxWidth: 1100, alignItems: "center" }}>
          <ImpactCard
            era="BEFORE"
            phrase="text claim"
            textColor={C.muted}
            borderColor={C.border2}
            bgColor="transparent"
            delay={0}
          />
          <div style={{
            fontFamily: MONO, fontSize: 36, color: C.open,
            padding: "0 28px", opacity: arrowOp, flexShrink: 0,
          }}>
            →
          </div>
          <ImpactCard
            era="AFTER"
            phrase="paid evidence gate"
            textColor={C.open}
            borderColor={C.open}
            bgColor={C.openDim}
            delay={90}
          />
        </div>

        <div style={{
          fontFamily: SANS, fontSize: 18, color: C.muted,
          marginTop: 40, maxWidth: 780, textAlign: "center",
          lineHeight: 1.7,
          opacity: subOp, transform: `translateY(${subY}px)`,
        }}>
          No payment = no access = no citation. The gate is mechanical, not aspirational.
        </div>
      </AbsoluteFill>
    </SceneBg>
  );
};

// ─── Scene 7: Honest limitation (100–112s = 360 frames) ──────────────────────

export const HonestLimitationScene: React.FC = () => {
  const badgeOp = useFadeIn(0, 16);
  const imgProg = useSpr(20, { damping: 14, stiffness: 70 });
  const text1Op = useFadeIn(80, 16);
  const text2Op = useFadeIn(96, 16);

  return (
    <SceneBg>
      <TopChrome />
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "56px 100px 0 100px",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          marginBottom: 36, opacity: badgeOp,
        }}>
          <div style={{ width: 4, height: 40, background: C.amber, borderRadius: 2 }} />
          <div>
            <div style={{
              fontFamily: MONO, fontSize: 11, color: C.amber,
              letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 4,
            }}>
              HONEST LIMITATION
            </div>
            <div style={{ fontFamily: SANS, fontSize: 14, color: C.muted }}>
              Stated in the published proof viewer and evidence files
            </div>
          </div>
        </div>

        <div style={{
          border: `1px solid ${C.amber}`,
          borderRadius: 8, overflow: "hidden",
          background: C.amberDim,
          maxWidth: 1000, width: "100%",
          opacity: imgProg, transform: `translateY(${(1 - imgProg) * 20}px)`,
          marginBottom: 32,
        }}>
          <div style={{
            padding: "10px 20px",
            borderBottom: "1px solid rgba(233,168,37,0.2)",
            display: "flex", justifyContent: "space-between",
            fontFamily: MONO, fontSize: 10, color: C.amber,
            letterSpacing: "0.14em", textTransform: "uppercase",
          }}>
            <span>EVIDENCE CUTAWAY · 05-limitations-card.png</span>
            <span>HONEST LIMITATION</span>
          </div>
          <div style={{ padding: 20, display: "flex", justifyContent: "center" }}>
            <Img
              src={staticFile("05-limitations-card.png")}
              style={{ maxWidth: "100%", maxHeight: 140, objectFit: "contain", borderRadius: 4 }}
            />
          </div>
        </div>

        <div style={{ maxWidth: 900, textAlign: "center" }}>
          <div style={{
            fontFamily: MONO, fontSize: 21, color: C.text,
            lineHeight: 1.6, marginBottom: 14, opacity: text1Op,
          }}>
            No measured seller balance delta is claimed.
          </div>
          <div style={{
            fontFamily: MONO, fontSize: 17, color: C.muted,
            lineHeight: 1.7, opacity: text2Op,
          }}>
            Seller-side logs verify: payTo · payer · amount · tx/ref · verify=true · settle=true
          </div>
        </div>
      </AbsoluteFill>
    </SceneBg>
  );
};

// ─── Scene 8: End card (112–120s = 240 frames) ───────────────────────────────

export const EndCardJudge: React.FC = () => {
  const frame = useCurrentFrame();

  const lines: Array<{
    text: string; color: string; size: number;
    mono: boolean; delay: number; bold: boolean;
  }> = [
    { text: "CitePay Agent",                                    color: C.text,  size: 44, mono: false, delay: 0,  bold: true  },
    { text: "Lepton Agents Hackathon",                          color: C.muted, size: 14, mono: true,  delay: 10, bold: false },
    { text: "",                                                   color: C.muted, size: 12, mono: true,  delay: 0,  bold: false },
    { text: "faadil1.github.io/citepay-agent-lepton",           color: C.arc,   size: 22, mono: true,  delay: 20, bold: false },
    { text: "",                                                   color: C.muted, size: 12, mono: true,  delay: 0,  bold: false },
    { text: "Arc Testnet  ·  Circle Gateway x402  ·  0.001 USDC", color: C.muted, size: 14, mono: true, delay: 32, bold: false },
    { text: "Testnet only — no mainnet claim",                   color: C.amber, size: 17, mono: true,  delay: 40, bold: false },
  ];

  return (
    <SceneBg>
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 80,
      }}>
        {lines.map((line, i) => {
          const opacity =
            line.text === ""
              ? 0
              : interpolate(frame, [line.delay, line.delay + 16], [0, 1], {
                  extrapolateLeft: "clamp", extrapolateRight: "clamp",
                });
          return (
            <div
              key={i}
              style={{
                fontFamily:    line.mono ? MONO : SERIF,
                fontSize:      line.size,
                color:         line.color,
                fontWeight:    line.bold ? 700 : 400,
                opacity,
                marginBottom:  line.size > 20 ? 12 : 5,
                letterSpacing: line.mono ? "0.04em" : "-0.01em",
                textAlign:     "center",
                lineHeight:    1.4,
              }}
            >
              {line.text}
            </div>
          );
        })}

        <div style={{
          position: "absolute", bottom: 40, left: 80, right: 80,
          borderTop: `1px solid ${C.border}`,
          paddingTop: 16, textAlign: "center",
          opacity: interpolate(frame, [50, 64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <span style={{
            fontFamily: MONO, fontSize: 10, color: C.muted2,
            letterSpacing: "0.18em", textTransform: "uppercase",
          }}>
            faadil1/citepay-agent-lepton · Terminal-based agent · Published proof viewer
          </span>
        </div>
      </AbsoluteFill>
    </SceneBg>
  );
};

// ─── Main composition ─────────────────────────────────────────────────────────
// Total: 120s = 3600 frames at 30fps
// Scene timing:
//   Hook            0:00–0:08   (f0–f240)
//   Product promise 0:08–0:18   (f240–f540)
//   Gate logic      0:18–0:45   (f540–f1350)
//   Sponsor tech    0:45–1:05   (f1350–f1950)
//   Evidence cutaway 1:05–1:25  (f1950–f2550)
//   Impact          1:25–1:40   (f2550–f3000)
//   Honest limit    1:40–1:52   (f3000–f3360)
//   End card        1:52–2:00   (f3360–f3600)

export const JudgeDeck: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Sequence from={f(0)}   durationInFrames={f(8)}>
        <HookScene />
      </Sequence>
      <Sequence from={f(8)}   durationInFrames={f(10)}>
        <ProductPromiseScene />
      </Sequence>
      <Sequence from={f(18)}  durationInFrames={f(27)}>
        <GateLogicScene />
      </Sequence>
      <Sequence from={f(45)}  durationInFrames={f(20)}>
        <SponsorTechScene />
      </Sequence>
      <Sequence from={f(65)}  durationInFrames={f(20)}>
        <EvidenceCutawayScene />
      </Sequence>
      <Sequence from={f(85)}  durationInFrames={f(15)}>
        <ImpactScene />
      </Sequence>
      <Sequence from={f(100)} durationInFrames={f(12)}>
        <HonestLimitationScene />
      </Sequence>
      <Sequence from={f(112)} durationInFrames={f(8)}>
        <EndCardJudge />
      </Sequence>
    </AbsoluteFill>
  );
};
