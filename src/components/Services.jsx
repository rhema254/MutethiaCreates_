import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './Services.module.css'

const services = [
  {
    num: '01',
    title: 'Enterprise Backend Engineering',
    desc: 'ERP modules, multi-tenant architectures, RBAC systems, and financial workflows built in Java Spring Boot — with Maker-Checker security patterns baked in from day one.',
  },
  {
    num: '02',
    title: 'Cloud & DevOps Setup',
    desc: 'AWS infrastructure (EC2, S3, RDS, SQS, SNS, IAM), Docker containerisation, CI/CD pipelines with GitHub Actions or Jenkins. Set up so it doesn\'t break at 2AM.',
  },
  {
    num: '03',
    title: 'Web Design & API Integration',
    desc: 'Pixel-sharp interfaces paired with clean REST/GraphQL APIs. Payment gateways, third-party service orchestration, and async messaging — wired together so the UX never waits on the backend.',
  },
  {
    num: '04',
    title: 'AI & Data Pipelines',
    desc: 'Turning unstructured data into usable insights using AWS Textract, Generative AI tooling, and structured analytical backends. If the data is messy, I\'ll clean it up.',
  },
]

/**
 * Scroll budget breakdown (total = SCROLL_HEIGHT)
 * ─────────────────────────────────────────────────
 * Phase A  0.00 → 0.15   Title slides into place (no cards yet)
 * Phase B  0.15 → 0.65   Cards cascade IN  (4 cards × 0.125 each, overlapping by 0.06)
 * Phase C  0.65 → 0.75   Pause — all 4 cards fully visible
 * Phase D  0.75 → 1.00   Cards cascade OUT (first-in, first-out, same stagger)
 *
 * Each card:
 *   entryStart  = 0.15 + i * 0.10
 *   entryEnd    = entryStart + 0.12
 *   exitStart   = 0.75 + i * 0.065
 *   exitEnd     = exitStart + 0.07
 */
const SCROLL_HEIGHT = 2800
const N = services.length

// ── timing for each card ──────────────────────────────────────
function timing(i) {
  return {
    entryStart: 0.15 + i * 0.10,
    entryEnd:   0.15 + i * 0.10 + 0.12,
    exitStart:  0.75 + i * 0.065,
    exitEnd:    0.75 + i * 0.065 + 0.07,
  }
}

// ── title timing ──────────────────────────────────────────────
// Title fully lands at scrollProg = 0.12
const TITLE_ENTRY_END = 0.12

export default function Services() {
  const outerRef   = useRef(null)
  const [prog, setProg] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!outerRef.current) return
      const rect     = outerRef.current.getBoundingClientRect()
      const scrolled = -rect.top
      setProg(Math.max(0, Math.min(1, scrolled / SCROLL_HEIGHT)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── title animation ──────────────────────────────────────────
  const titleProgress = Math.min(1, prog / TITLE_ENTRY_END)
  const titleX        = -100 * (1 - titleProgress)
  const titleOpacity  = titleProgress

  return (
    <div
      className={styles.pinOuter}
      style={{ height: `calc(100vh + ${SCROLL_HEIGHT}px)` }}
      ref={outerRef}
    >
      <div className={styles.sticky}>
        <div className={`container ${styles.inner}`}>

          {/* ── Header ── */}
          <div className={styles.header}>
            <div className="section-label">HOW YOU CAN HIRE ME</div>
            <div
              className={`section-heading ${styles.titleAnimated}`}
              style={{
                transform:  `translateX(${titleX}px)`,
                opacity:    titleOpacity,
              }}
            >
              Typical Engagements
            </div>
          </div>

          {/* ── Cards ── */}
          {/*
            Key insight: render ALL cards at all times but control visibility
            purely through opacity and transform. Never put a grey background
            on an empty container — the card background only shows when opacity > 0.
          */}
          <div className={styles.grid}>
            {services.map((s, i) => {
              const { entryStart, entryEnd, exitStart, exitEnd } = timing(i)

              // 0 → 1 on the way in
              const entryProg = Math.max(0, Math.min(1,
                (prog - entryStart) / (entryEnd - entryStart)
              ))
              // 0 → 1 on the way out
              const exitProg  = Math.max(0, Math.min(1,
                (prog - exitStart)  / (exitEnd  - exitStart)
              ))

              // opacity: rise with entryProg, fall with exitProg
              const opacity = entryProg * (1 - exitProg)

              // y: starts 80px below rest, rises to 0; then floats -50px on exit
              const y = entryProg < 1
                ? 80 * (1 - entryProg)
                : -50 * exitProg

              return (
                <div
                  key={s.num}
                  className={styles.cardWrap}
                  style={{
                    opacity,
                    transform:  `translateY(${y}px)`,
                    visibility: opacity < 0.01 ? 'hidden' : 'visible',
                  }}
                >
                  <div className={styles.card}>
                    <div className={styles.cardNum}>{s.num}</div>
                    <h3 className={styles.cardTitle}>{s.title}</h3>
                    <p className={styles.cardDesc}>{s.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
