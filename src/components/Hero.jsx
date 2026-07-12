import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './Hero.module.css'
import mpesaLogo  from '../assets/MpesaInsights Logo.png'
import sifafxLogo from '../assets/sifafx.svg'
import kensLogo   from '../assets/KensSchool.svg'

// ─── Detect mobile once (SSR-safe) ────────────────────────────
const isMobileDevice = () =>
  typeof window !== 'undefined' && window.innerWidth < 768

// ─── Inline spec carousel ─────────────────────────────────────
const SPEC_ITEMS = [
  { label: 'BASED',   value: 'Nairobi, KE' },
  { label: 'MODE',    value: 'Remote, International' },
  { label: 'ENGAGE',  value: 'Part-time, Contract' },
  { label: 'STACK',   value: 'Java, React, Python, AWS' },
  { label: 'DOMAINS', value: 'APIs, Dashboards, AI, Payments, Branding' },
  { label: 'STATUS',  value: '● Open to Work', green: true },
  { label: 'BASED',   value: 'Nairobi, KE' },
  { label: 'MODE',    value: 'Remote, International' },
  { label: 'ENGAGE',  value: 'Part-time, Contract' },
  { label: 'STACK',   value: 'Java, React, Python, AWS' },
  { label: 'DOMAINS', value: 'APIs, Dashboards, AI, Payments, Branding' },
  { label: 'STATUS',  value: '● Open to Work', green: true },
]

const ITEM_W = 240
const HALF   = (SPEC_ITEMS.length / 2) * ITEM_W

function SpecCarousel() {
  const [tx, setTx] = useState(0)
  const outerRef = useRef(null)

  useEffect(() => {
    // On mobile: auto-scroll instead of scroll-driven
    if (isMobileDevice()) {
      let frame = 0
      let pos = 0
      const tick = () => {
        pos -= 0.5
        if (pos < -HALF) pos = 0
        setTx(pos)
        frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(frame)
    }

    const onScroll = () => {
      const top = outerRef.current?.closest('[data-hero]')?.offsetTop ?? 0
      const rel = window.scrollY - top
      const raw = -(rel * 0.35) % -HALF
      setTx(raw)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={styles.specOuter} ref={outerRef}>
      <div className={styles.specFadeL} />
      <div className={styles.specFadeR} />
      <div className={styles.specTrack} style={{ transform: `translateX(${tx}px)` }}>
        {SPEC_ITEMS.map((item, i) => (
          <div key={i} className={styles.specItem}>
            <span className={styles.specLabel}>{item.label}</span>
            <span className={`${styles.specValue} ${item.green ? styles.specGreen : ''}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Copy ─────────────────────────────────────────────────────
const LINE1 = "We turn your requirements into revenue."

const LINE2_SEGMENTS = [
  { text: 'Custom software,' },
  { text: ' API integrations,' },
  { text: ' AI-powered dashboards' },
  { text: ' and payment systems' },
  { text: ' built fast,' },
  { text: ' deployed right.' },
]

function buildChars(segs) {
  const out = []
  segs.forEach((s) => s.text.split('').forEach((c) => out.push(c)))
  return out
}

const CHARS        = buildChars(LINE2_SEGMENTS)
const TOTAL        = CHARS.length
const SCROLL_RANGE = 1400

// ─── Mobile: show all text immediately, no pin ────────────────
function HeroMobile() {
  return (
    <section className={styles.mobileHero}>
      <div className={`container ${styles.mobileContent}`}>
        <p className={styles.tag}>
          END-TO-END SOFTWARE · API INTEGRATIONS · AI · NAIROBI, KE
        </p>
        <h1 className={styles.line1}>{LINE1}</h1>
        <p className={styles.line2Static}>
          Custom software, API integrations, AI-powered dashboards and payment systems built fast, deployed right.
        </p>
        <div className={styles.ctas}>
          <a href="#work" className="btn btn-primary">SEE THE WORK</a>
          <a href="#contact" className="btn btn-ghost">GET IN TOUCH</a>
        </div>
        <div className={styles.clientRow}>
          <span className={styles.clientLabel}>TRUSTED BY</span>
          <div className={styles.clients}>
            <div className={styles.clientLogo} title="SifaFX">
              <img src={sifafxLogo} alt="SifaFX"
                style={{ height: 22, width: 'auto', objectFit: 'contain', display: 'block' }} />
            </div>
            <div className={styles.clientLogo} title="Mpesa Insights">
              <img src={mpesaLogo} alt="Mpesa Insights"
                style={{ height: 22, width: 'auto', objectFit: 'contain', display: 'block' }} />
            </div>
            <div className={styles.clientLogo} title="Kens Academy">
              <img src={kensLogo} alt="Kens Academy"
                style={{ height: 22, width: 'auto', objectFit: 'contain', display: 'block' }} />
            </div>
          </div>
        </div>
        <div className={styles.specWrap}>
          <SpecCarousel />
        </div>
      </div>
    </section>
  )
}

// ─── Desktop: scroll-pinned typewriter ────────────────────────
function HeroDesktop() {
  const outerRef = useRef(null)
  const [count, setCount]           = useState(0)
  const [ctaVisible, setCtaVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const top  = outerRef.current?.offsetTop ?? 0
      const rel  = window.scrollY - top
      const prog = Math.max(0, Math.min(1, rel / SCROLL_RANGE))
      setCount(Math.round(prog * TOTAL))
      setCtaVisible(prog > 0.88)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={styles.pinOuter}
      style={{ height: `calc(100vh + ${SCROLL_RANGE}px)` }}
      ref={outerRef}
      data-hero="true"
    >
      <div className={styles.sticky}>
        <div className={styles.horizon} />
        <div className={`container ${styles.content}`}>

          <motion.p
            className={styles.tag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            END-TO-END SOFTWARE · API INTEGRATIONS · AI · NAIROBI, KE
          </motion.p>

          <motion.h1
            className={styles.line1}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {LINE1}
          </motion.h1>

          <p className={styles.line2}>
            {CHARS.map((c, i) => {
              const visible  = i < count
              const isCursor = i === count - 1
              return (
                <span
                  key={i}
                  className={visible ? (isCursor ? styles.cursor : styles.shown) : styles.hidden}
                >
                  {c}
                </span>
              )
            })}
            {count === 0 && <span className={styles.idleCursor} />}
          </p>

          <motion.p
            className={styles.hint}
            animate={{ opacity: count > 3 ? 0 : 0.45 }}
            transition={{ duration: 0.3 }}
          >
            scroll to continue
          </motion.p>

          <motion.div
            className={styles.ctas}
            animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            initial={{ opacity: 0, y: 14 }}
          >
            <motion.a href="#work" className="btn btn-primary"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              SEE THE WORK
            </motion.a>
            <motion.a href="#contact" className="btn btn-ghost"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              GET IN TOUCH
            </motion.a>
          </motion.div>

          <motion.div
            className={styles.clientRow}
            animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            initial={{ opacity: 0, y: 10 }}
          >
            <span className={styles.clientLabel}>TRUSTED BY</span>
            <div className={styles.clients}>
              <div className={styles.clientLogo} title="SifaFX">
                <img src={sifafxLogo} alt="SifaFX"
                  style={{ height: 24, width: 'auto', objectFit: 'contain', display: 'block' }} />
              </div>
              <div className={styles.clientLogo} title="Mpesa Insights">
                <img src={mpesaLogo} alt="Mpesa Insights"
                  style={{ height: 24, width: 'auto', objectFit: 'contain', display: 'block' }} />
              </div>
              <div className={styles.clientLogo} title="Kens Academy">
                <img src={kensLogo} alt="Kens Academy"
                  style={{ height: 24, width: 'auto', objectFit: 'contain', display: 'block' }} />
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.specWrap}
            animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            initial={{ opacity: 0, y: 8 }}
          >
            <SpecCarousel />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─── Main export — renders mobile or desktop version ──────────
export default function Hero() {
  const [mobile, setMobile] = useState(() => isMobileDevice())

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    check()
    return () => window.removeEventListener('resize', check)
  }, [])

  return mobile ? <HeroMobile /> : <HeroDesktop />
}
