import { useState, useEffect, useRef } from "react";

const sections = [
  { id: "market", label: "The Market" },
  { id: "inflection", label: "The Inflection" },
  { id: "bet", label: "The Bet" },
  { id: "found", label: "What I Found" },
  { id: "inside", label: "From the Inside" },
  { id: "me", label: "Why Me" },
];

function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function FadeSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children, color = "coral" }) {
  const colors = {
    coral: { bg: "#FFF0EC", text: "#E8553A" },
    teal: { bg: "#E8F5F3", text: "#1A8A7D" },
    navy: { bg: "#EEF0F4", text: "#1E2A3A" },
    gold: { bg: "#FFF8E8", text: "#B8860B" },
  };
  const c = colors[color] || colors.coral;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "100px",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        background: c.bg,
        color: c.text,
      }}
    >
      {children}
    </span>
  );
}

function StatCard({ number, label, sublabel }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "28px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
        flex: "1 1 200px",
        minWidth: "180px",
      }}
    >
      <div style={{ fontSize: "36px", fontWeight: 700, color: "#E8553A", lineHeight: 1.1 }}>
        {number}
      </div>
      <div style={{ fontSize: "15px", fontWeight: 600, color: "#1E2A3A", marginTop: "8px" }}>
        {label}
      </div>
      {sublabel && (
        <div style={{ fontSize: "13px", color: "#6B7B8D", marginTop: "4px" }}>{sublabel}</div>
      )}
    </div>
  );
}

function InsightCard({ outside, inside, icon }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "28px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
        marginBottom: "16px",
      }}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "16px" }}>
        <span style={{ fontSize: "24px" }}>{icon}</span>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6B7B8D", marginBottom: "6px" }}>
            From the outside
          </div>
          <div style={{ fontSize: "15px", color: "#1E2A3A", lineHeight: 1.6 }}>{outside}</div>
        </div>
      </div>
      <div
        style={{
          borderTop: "1px dashed #E2E8F0",
          paddingTop: "16px",
          marginLeft: "36px",
        }}
      >
        <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#1A8A7D", marginBottom: "6px" }}>
          From the inside, I'd
        </div>
        <div style={{ fontSize: "15px", color: "#1E2A3A", lineHeight: 1.6 }}>{inside}</div>
      </div>
    </div>
  );
}

function CompetitorRow({ name, share, positioning, moat, color }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "140px 80px 1fr 1fr",
        gap: "16px",
        padding: "16px 20px",
        alignItems: "start",
        borderBottom: "1px solid #F1F5F9",
      }}
    >
      <div style={{ fontWeight: 600, color: "#1E2A3A", fontSize: "15px" }}>
        <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: color, marginRight: "8px" }} />
        {name}
      </div>
      <div style={{ fontSize: "14px", color: "#6B7B8D" }}>{share}</div>
      <div style={{ fontSize: "14px", color: "#1E2A3A", lineHeight: 1.5 }}>{positioning}</div>
      <div style={{ fontSize: "14px", color: "#6B7B8D", lineHeight: 1.5 }}>{moat}</div>
    </div>
  );
}

function ResearchQuestion({ number, question, method, jdBullet }) {
  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #E8553A, #F07A5A)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "16px",
          flexShrink: 0,
        }}
      >
        {number}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "16px", fontWeight: 600, color: "#1E2A3A", marginBottom: "6px", lineHeight: 1.4 }}>
          {question}
        </div>
        <div style={{ fontSize: "14px", color: "#6B7B8D", lineHeight: 1.6, marginBottom: "8px" }}>
          {method}
        </div>
        <Pill color="teal">{jdBullet}</Pill>
      </div>
    </div>
  );
}

export default function HakuArtifact() {
  const [activeSection, setActiveSection] = useState("market");

  useEffect(() => {
    const handleScroll = () => {
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.4 && rect.bottom > 0) {
            setActiveSection(s.id);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", color: "#1E2A3A", background: "#F8FAFB" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap" rel="stylesheet" />

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(165deg, #1E2A3A 0%, #2C3E50 60%, #1A8A7D 100%)",
          padding: "80px 32px 72px",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(232, 85, 58, 0.08)",
            filter: "blur(60px)",
          }}
        />
        <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>
            PM & Operations Intern — Application Artifact
          </div>
          <h1
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(32px, 5vw, 44px)",
              fontWeight: 700,
              lineHeight: 1.15,
              margin: "0 0 20px",
              letterSpacing: "-0.02em",
            }}
          >
            From the outside,
            <br />
            <span style={{ color: "#F07A5A" }}>looking in.</span>
          </h1>
          <p style={{ fontSize: "17px", lineHeight: 1.7, color: "rgba(255,255,255,0.75)", maxWidth: "520px", margin: "0 0 36px" }}>
            Everything in this document was built from public data: your website, competitor filings, LinkedIn, press releases, and review sites. No inside access. No proprietary data. No demo account.
          </p>
          <p style={{ fontSize: "17px", lineHeight: 1.7, color: "rgba(255,255,255,0.9)", maxWidth: "520px", margin: 0, fontWeight: 500 }}>
            Now imagine what I could find from the inside.
          </p>
          <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>Sidharth Sundaram</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>
              MS Engineering Management, Purdue · 4 years B2B PM (EdTech) · CPT Authorized
            </div>
          </div>
        </div>
      </div>

      {/* Sticky nav */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(248,250,251,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E2E8F0",
          padding: "0 32px",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            display: "flex",
            gap: "4px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              style={{
                padding: "14px 16px",
                fontSize: "13px",
                fontWeight: activeSection === s.id ? 600 : 400,
                color: activeSection === s.id ? "#E8553A" : "#6B7B8D",
                background: "none",
                border: "none",
                borderBottom: activeSection === s.id ? "2px solid #E8553A" : "2px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 32px" }}>

        {/* Section 1: The Market */}
        <section id="market" style={{ paddingTop: "64px", paddingBottom: "48px" }}>
          <FadeSection>
            <Pill color="coral">Competitive Analysis</Pill>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "28px", fontWeight: 700, margin: "16px 0 12px", letterSpacing: "-0.01em" }}>
              Three players. Three different bets.
            </h2>
            <p style={{ fontSize: "15px", color: "#6B7B8D", lineHeight: 1.7, marginBottom: "32px" }}>
              The US endurance event market has consolidated to three major platforms. Each competes on a different axis.
            </p>
          </FadeSection>

          <FadeSection delay={0.1}>
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 80px 1fr 1fr",
                  gap: "16px",
                  padding: "12px 20px",
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#6B7B8D",
                  borderBottom: "2px solid #F1F5F9",
                }}
              >
                <div>Platform</div>
                <div>Share</div>
                <div>Positioning</div>
                <div>Moat</div>
              </div>
              <CompetitorRow
                name="RunSignUp"
                share="~50%"
                positioning="Lowest price, standardized features, timer partner network. Employee-owned. Free platform, revenue from processing fees ($1/txn + 6%)."
                moat="Scale economies + process power (partner channel)"
                color="#4A90D9"
              />
              <CompetitorRow
                name="Race Roster"
                share="#2"
                positioning="Mid-market. $1.99/participant + 6.99%. Strong in Canada, growing US presence."
                moat="Geographic switching costs"
                color="#7B68EE"
              />
              <CompetitorRow
                name="haku"
                share="#3"
                positioning="Premium, custom solutions. Industry's only native CRM. Expanding into nonprofits. Higher price, more depth."
                moat="Counter-position + cornered resource (data) → building switching costs"
                color="#E8553A"
              />
            </div>
          </FadeSection>

          <FadeSection delay={0.15}>
            <div
              style={{
                background: "#FFF8F5",
                borderLeft: "3px solid #E8553A",
                padding: "20px 24px",
                borderRadius: "0 12px 12px 0",
                marginTop: "24px",
                fontSize: "14px",
                lineHeight: 1.7,
                color: "#1E2A3A",
              }}
            >
              <strong>Counter-positioning (Hamilton's 7 Powers):</strong> RunSignUp's CEO has publicly noted that competitors struggle with "custom code, technical debt, and the balancing act of consulting and software development." That's a direct shot at haku's premium model. But the tension runs both ways. RunSignUp can't copy haku's native CRM without abandoning their free-platform, processing-fee business model. Haku can't copy RunSignUp's pricing without cannibalizing their premium positioning. Each player is structurally locked into their lane.
              <div style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>Source: RunSignUp Market Analysis, Sep 2024; EnduranceSportsWire</div>
            </div>
          </FadeSection>
        </section>

        {/* Section 2: The Inflection */}
        <section id="inflection" style={{ paddingTop: "48px", paddingBottom: "48px" }}>
          <FadeSection>
            <Pill color="navy">Org Structure Analysis</Pill>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "28px", fontWeight: 700, margin: "16px 0 12px" }}>
              A product team scaling into its next chapter.
            </h2>
            <p style={{ fontSize: "15px", color: "#6B7B8D", lineHeight: 1.7, marginBottom: "32px" }}>
              I looked at haku's LinkedIn, job postings, and team structure. The story the org chart tells is more revealing than any feature page.
            </p>
          </FadeSection>

          <FadeSection delay={0.1}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
              <StatCard number="~10" label="Product people" sublabel="VP, PMs, Specialists, Design" />
              <StatCard number="3" label="Open roles" sublabel="PM + Sr. PM + Intern" />
              <StatCard number="~153" label="Total employees" sublabel="Across 4 continents" />
            </div>
          </FadeSection>

          <FadeSection delay={0.15}>
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "28px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
                marginBottom: "20px",
              }}
            >
              <div style={{ fontSize: "16px", fontWeight: 600, color: "#1E2A3A", marginBottom: "16px" }}>What the org chart says</div>
              <div style={{ fontSize: "15px", lineHeight: 1.8, color: "#1E2A3A" }}>
                <p style={{ margin: "0 0 12px" }}>
                  Haku's product team has real depth: a VP of Product, a Product Leader with sports tech expertise, PMs, Product Specialists, and designers. One detail stands out. <strong>A Product Specialist with an MSIS in AI</strong>, which signals the Operational Intelligence bet has real staffing behind it.
                </p>
                <p style={{ margin: "0 0 12px" }}>
                  But the team is also actively hiring a PM, a Senior PM, and this intern, all at the same time. That's not backfilling. That's a product function where the strategic ambition (Operational Intelligence, cross-vertical expansion, pricing innovation) is outpacing the current team's bandwidth. The CSO is still driving thought leadership that would normally live with a product strategist.
                </p>
                <p style={{ margin: 0 }}>
                  Meanwhile, the GTM side is already staffed deep: VP of Sales & Marketing, Director of Marketing, Product Marketing, Demand Gen, Content, Account Executives. The company has a mature go-to-market engine. Product is now scaling to match it.
                </p>
              </div>
            </div>
          </FadeSection>

          <FadeSection delay={0.2}>
            <div
              style={{
                background: "linear-gradient(135deg, #1E2A3A, #2C3E50)",
                borderRadius: "16px",
                padding: "28px",
                color: "white",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
                The implication
              </div>
              <div style={{ fontSize: "17px", lineHeight: 1.7, fontWeight: 500 }}>
                An intern joining this team isn't observing. They're arriving at the moment when the product function is scaling to match the company's strategic ambition. Research, competitive analysis, and data work that frees up the existing team to execute matters more here than at a company with a 40-person product org.
              </div>
            </div>
          </FadeSection>
        </section>

        {/* Section 3: The Bet */}
        <section id="bet" style={{ paddingTop: "48px", paddingBottom: "48px" }}>
          <FadeSection>
            <Pill color="teal">AI & Product Strategy</Pill>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "28px", fontWeight: 700, margin: "16px 0 12px" }}>
              The Operational Intelligence bet.
            </h2>
            <p style={{ fontSize: "15px", color: "#6B7B8D", lineHeight: 1.7, marginBottom: "32px" }}>
              Haku's counter-position against RunSignUp's price advantage is intelligence, not features. As Jaclyn Levi frames it: "AI is only as powerful as what it can see." Because registration, CRM, marketing, e-commerce, and fundraising all live in one platform, haku's AI has a complete view that bolted-on integrations can't match.
            </p>
          </FadeSection>

          <FadeSection delay={0.1}>
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "28px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
                marginBottom: "20px",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#6B7B8D", marginBottom: "20px" }}>AI evolution timeline (from public sources)</div>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 260px", padding: "20px", background: "#F8FAFB", borderRadius: "12px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#1A8A7D", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                    Phase 1 — AI Companion (Shipped)
                  </div>
                  <div style={{ fontSize: "14px", color: "#1E2A3A", lineHeight: 1.6 }}>
                    Content generation. Helps create first drafts for emails, fundraising pages, product descriptions, blogs. Helps fundraisers tell their story. Reactive: user asks, AI writes.
                  </div>
                </div>
                <div style={{ flex: "1 1 260px", padding: "20px", background: "#FFF8F5", borderRadius: "12px", border: "1px solid #F0D4CC" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#E8553A", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                    Phase 2 — Operational Intelligence (Waitlist)
                  </div>
                  <div style={{ fontSize: "14px", color: "#1E2A3A", lineHeight: 1.6 }}>
                    Always-on, contextual. Surfaces revenue opportunities proactively. Works across events, customers, marketing, and transactions. Powers workflows and automations. Embedded in the platform itself, not a chatbot.
                  </div>
                </div>
              </div>
            </div>
          </FadeSection>

          <FadeSection delay={0.15}>
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "28px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#6B7B8D", marginBottom: "20px" }}>The reinforcing loop RunSignUp can't replicate</div>
              <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 20px" }}>
                <div style={{ position: "relative", width: "340px", height: "240px" }}>
                  {[
                    { label: "CRM Data\nDepth", x: 130, y: 0 },
                    { label: "AI Insight\nQuality", x: 270, y: 80 },
                    { label: "Organizer\nRevenue ↑", x: 200, y: 195 },
                    { label: "Platform\nAdoption", x: 50, y: 195 },
                    { label: "Justified\nPremium", x: -10, y: 80 },
                  ].map((node, i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: node.x,
                        top: node.y,
                        width: "90px",
                        textAlign: "center",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#1E2A3A",
                        lineHeight: 1.3,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {node.label}
                    </div>
                  ))}
                  <svg viewBox="0 0 340 240" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                    <defs>
                      <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                        <path d="M0,0 L8,3 L0,6" fill="#1A8A7D" />
                      </marker>
                    </defs>
                    <path d="M 200,18 Q 260,20 275,68" fill="none" stroke="#1A8A7D" strokeWidth="1.5" markerEnd="url(#arrow)" />
                    <path d="M 300,110 Q 290,160 260,185" fill="none" stroke="#1A8A7D" strokeWidth="1.5" markerEnd="url(#arrow)" />
                    <path d="M 200,215 Q 150,225 110,215" fill="none" stroke="#1A8A7D" strokeWidth="1.5" markerEnd="url(#arrow)" />
                    <path d="M 50,185 Q 20,160 20,110" fill="none" stroke="#1A8A7D" strokeWidth="1.5" markerEnd="url(#arrow)" />
                    <path d="M 45,75 Q 80,30 130,18" fill="none" stroke="#1A8A7D" strokeWidth="1.5" markerEnd="url(#arrow)" />
                    <text x="170" y="128" textAnchor="middle" fontSize="18" fill="#1A8A7D" fontWeight="700">R</text>
                  </svg>
                </div>
              </div>
              <div style={{ fontSize: "13px", color: "#6B7B8D", lineHeight: 1.6 }}>
                <strong style={{ color: "#1A8A7D" }}>Reinforcing loop:</strong> More CRM data makes the AI smarter, which drives better revenue outcomes for organizers, which justifies haku's premium pricing, which attracts more organizers, which generates more data. RunSignUp doesn't have a native CRM, so this loop doesn't exist in their architecture.
              </div>
              <div style={{ fontSize: "13px", color: "#6B7B8D", lineHeight: 1.6, marginTop: "12px" }}>
                <strong style={{ color: "#E8553A" }}>Balancing force (the invisible asymptote):</strong> As the platform serves both endurance and nonprofit verticals, product complexity increases, onboarding gets harder, and the team gets stretched thinner. The Operational Intelligence layer has to generate enough value to outpace this complexity drag. That's the bet.
              </div>
            </div>
          </FadeSection>

        </section>

        {/* Section 4: What I Found */}
        <section id="found" style={{ paddingTop: "48px", paddingBottom: "48px" }}>
          <FadeSection>
            <Pill color="gold">CRM & Data Analysis</Pill>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "28px", fontWeight: 700, margin: "16px 0 12px" }}>
              What I found with zero internal access.
            </h2>
            <p style={{ fontSize: "15px", color: "#6B7B8D", lineHeight: 1.7, marginBottom: "32px" }}>
              Two structural observations from public evidence. Each one pairs what I can see from the outside with what I'd investigate from the inside.
            </p>
          </FadeSection>

          <FadeSection delay={0.1}>
            <InsightCard
              icon="🔀"
              outside={
                <>The CRM page says "the only native CRM built for endurance." The language (participant profiles, race results, run clubs, lifetime spend) is all endurance-specific. But the nonprofit side has a separate "Supporter Profiles" feature with different language: donors, pledges, giving history. Many of haku's largest customers (Eagles Autism Foundation, Colon Cancer Coalition) are nonprofits running endurance events. For them, a participant IS a supporter. Does the CRM see them as one person or two? The CRM as a feature is differentiation. The years of accumulated participant data inside it is the actual moat. But that moat only holds if the data is unified, not fragmented across verticals.</>
              }
              inside={
                <>Pull CRM data for customers who use both verticals. Measure: what percentage of participant records also have donation/pledge activity? How often are they unified vs. duplicated? This directly determines whether Operational Intelligence can surface cross-vertical revenue signals.</>
              }
            />
          </FadeSection>

          <FadeSection delay={0.15}>
            <InsightCard
              icon="💰"
              outside={
                <>Jaclyn Levi published a pricing strategy worksheet in Feb 2026, arguing that traditional date-based and volume-based pricing "undermines trust, distorts forecasting, and makes it harder to understand what our events are actually worth." But the worksheet is a PDF download, content marketing, not a product feature. The gap between thought leadership and product intelligence is exactly where Operational Intelligence should live.</>
              }
              inside={
                <>Interview 5-8 event organizers currently using haku. Ask: how do you set your pricing today? What data do you wish you had? Do you use the worksheet? Map responses against what Operational Intelligence could realistically surface from existing CRM data.</>
              }
            />
          </FadeSection>
        </section>

        {/* Section 5: From the Inside */}
        <section id="inside" style={{ paddingTop: "48px", paddingBottom: "48px" }}>
          <FadeSection>
            <Pill color="teal">Day One Plan</Pill>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "28px", fontWeight: 700, margin: "16px 0 12px" }}>
              Three research questions for the first 30 days.
            </h2>
            <p style={{ fontSize: "15px", color: "#6B7B8D", lineHeight: 1.7, marginBottom: "32px" }}>
              Each question is scoped to what an intern can execute, maps to a JD bullet, and feeds a product decision.
            </p>
          </FadeSection>

          <FadeSection delay={0.1}>
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "32px 28px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
              }}
            >
              <ResearchQuestion
                number={1}
                question="How do cross-vertical customers (nonprofits running endurance events) currently manage participant-donor data in the CRM?"
                method="Pull a sample of customers using both verticals. Evaluate CRM data across three dimensions: quality (are profiles consistent, de-duplicated, and complete?), diversity (does the data represent the full range of participant-donor journeys?), and relevance (do existing fields capture the signals Operational Intelligence needs?). Deliverable: data readiness audit with gap analysis for AI consumption."
                jdBullet="Analyze CRM and operations data"
              />
              <ResearchQuestion
                number={2}
                question="What does RunSignUp's free-platform model mean for haku's expansion into mid-market events?"
                method="Competitive analysis of pricing models, feature parity, and switching costs. Specifically: what keeps organizers on haku? Platform investment (years of participant data), cognitive friction (learned workflows), monetary friction (contract terms), replacement risk (data portability). Interview 3-5 event organizers who evaluated both platforms. Deliverable: competitive positioning matrix with switching cost map for sales enablement."
                jdBullet="User research and competitive analysis"
              />
              <ResearchQuestion
                number={3}
                question="Which Operational Intelligence use cases can be validated with existing CRM data vs. require new data collection?"
                method="Map the AI page's promised capabilities against actual CRM data fields. For 2-3 use cases (lapsed-participant alerts, upsell signals, pricing recommendations): design evaluation rubrics with clear pass/fail criteria, run vibe-check evaluations on sample outputs, and assess whether the CRM provides enough context for the AI to produce accurate results or if the context window would degrade from data overload. Deliverable: feasibility scorecard with eval rubrics for Operational Intelligence roadmap."
                jdBullet="Explore AI tools and workflows"
              />
            </div>
          </FadeSection>
        </section>

        {/* Section 6: Why Me */}
        <section id="me" style={{ paddingTop: "48px", paddingBottom: "80px" }}>
          <FadeSection>
            <Pill color="coral">Why Me</Pill>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "28px", fontWeight: 700, margin: "16px 0 24px" }}>
              The pattern, not the domain.
            </h2>
          </FadeSection>

          <FadeSection delay={0.1}>
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "32px 28px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
                marginBottom: "24px",
              }}
            >
              <div style={{ fontSize: "15px", lineHeight: 1.8, color: "#1E2A3A" }}>
                <p style={{ margin: "0 0 16px" }}>
                  My domain is EdTech, not endurance events. But the structural problems are the same.
                </p>
                <p style={{ margin: "0 0 16px" }}>
                  At Interview Kickstart, I launched a B2B corporate training vertical from zero, selling to HR buyers while the product was built for individual learners. Two buyer personas, one platform, different success metrics. Haku navigates the same tension between endurance organizers and nonprofit fundraising teams.
                </p>
                <p style={{ margin: "0 0 16px" }}>
                  At upGrad, I built churn prediction pipelines for at-risk learners, identifying behavioral leading indicators of dropout and triggering the right outreach before they disappeared. Structurally, that's what Operational Intelligence should do for event participants: spot the lapsing runner, the disengaged donor, the sponsor about to churn.
                </p>
                <p style={{ margin: "0 0 16px" }}>
                  Alongside my PM work, I've trained in AI product management: context engineering (how to architect AI systems so the right data reaches the model without degrading performance), dataset engineering (evaluating data quality, diversity, and relevance before feeding it to any model), and evaluation design (building rubrics that turn subjective AI output into measurable pass/fail criteria). These are the exact disciplines Operational Intelligence needs to go from waitlist to production.
                </p>
                <p style={{ margin: 0 }}>
                  My intercept in endurance events is zero. My slope is documented. This artifact exists because I started the job before being asked.
                </p>
              </div>
            </div>
          </FadeSection>

          <FadeSection delay={0.15}>
            <div
              style={{
                background: "linear-gradient(135deg, #1E2A3A, #2C3E50)",
                borderRadius: "16px",
                padding: "32px 28px",
                color: "white",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Education</div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>MS Engineering Management<br />Purdue University (May 2027)</div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Authorization</div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>CPT Authorized<br />No sponsorship required</div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Experience</div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>4 years B2B Product Management<br />EdTech (Interview Kickstart, upGrad)</div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>AI PM Training</div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>Context engineering, evals,<br />dataset engineering, agentic design</div>
                </div>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <a href="https://sidharthsundaram.com" target="_blank" rel="noopener" style={{ fontSize: "13px", color: "#F07A5A", textDecoration: "none" }}>sidharthsundaram.com ↗</a>
                <a href="https://linkedin.com/in/sidharthsundaram" target="_blank" rel="noopener" style={{ fontSize: "13px", color: "#F07A5A", textDecoration: "none" }}>LinkedIn ↗</a>
                <a href="mailto:sundar84@purdue.edu" style={{ fontSize: "13px", color: "#F07A5A", textDecoration: "none" }}>sundar84@purdue.edu</a>
              </div>
            </div>
          </FadeSection>

          <FadeSection delay={0.2}>
            <div style={{ textAlign: "center", marginTop: "48px", padding: "24px", color: "#6B7B8D", fontSize: "13px" }}>
              Built with public data only. All sources cited inline.
              <br />
              <span style={{ fontSize: "12px", color: "#A0AEC0", marginTop: "4px", display: "inline-block" }}>
                © 2026 Sidharth Sundaram
              </span>
            </div>
          </FadeSection>
        </section>
      </div>
    </div>
  );
}
