import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './Hero.module.css'
import mpesaLogo  from '../assets/MpesaInsights Logo.png'
import sifafxLogo from '../assets/sifafx.svg'
import kensLogo   from '../assets/KensSchool.svg'

// ─── Inline spec carousel (lives on page 1 under the CTAs) ────
const SPEC_ITEMS = [
  { label: 'BASED',   value: 'Nairobi, KE' },
  { label: 'MODE',    value: 'Remote · International' },
  { label: 'ENGAGE',  value: 'Part-time · Contract' },
  { label: 'STACK',   value: 'Java · React · Python · AWS' },
  { label: 'DOMAINS', value: 'APIs · Dashboards · AI · Payments · Branding' },
  { label: 'STATUS',  value: '● Open to Work', green: true },
  // duplicate for seamless loop
  { label: 'BASED',   value: 'Nairobi, KE' },
  { label: 'MODE',    value: 'Remote · International' },
  { label: 'ENGAGE',  value: 'Part-time · Contract' },
  { label: 'STACK',   value: 'Java · React · Python · AWS' },
  { label: 'DOMAINS', value: 'APIs · Dashboards · AI · Payments · Branding' },
  { label: 'STATUS',  value: '● Open to Work', green: true },
]

const ITEM_W = 240  // px per item
const HALF   = (SPEC_ITEMS.length / 2) * ITEM_W

function SpecCarousel() {
  const [tx, setTx] = useState(0)
  const outerRef    = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const top     = outerRef.current?.closest('[data-hero]')?.offsetTop ?? 0
      const rel     = window.scrollY - top
      const raw     = -(rel * 0.35) % -HALF
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

// 64px headline — value proposition
const LINE1 = "We turn your requirements into revenue."

// 32px subline — typed char-by-char on scroll
// segments split at natural pause points
const LINE2_SEGMENTS = [
  { text: 'Custom software,' },
  { text: ' API integrations,' },
  { text: ' AI-powered dashboards' },
  { text: ' and payment systems —' },
  { text: ' built fast,' },
  { text: ' deployed right.' },
]

function buildChars(segs) {
  const out = []
  segs.forEach((s) => s.text.split('').forEach((c) => out.push(c)))
  return out
}

const CHARS   = buildChars(LINE2_SEGMENTS)
const TOTAL   = CHARS.length
const SCROLL_RANGE = 1400

export default function Hero() {
  const outerRef = useRef(null)
  const [count, setCount]         = useState(0)
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

          {/* Tag */}
          <motion.p
            className={styles.tag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            END-TO-END SOFTWARE · API INTEGRATIONS · AI · NAIROBI, KE
          </motion.p>

          {/* Line 1 — 64px */}
          <motion.h1
            className={styles.line1}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {LINE1}
          </motion.h1>

          {/* Line 2 — 32px typewriter */}
          <p className={styles.line2}>
            {CHARS.map((c, i) => {
              const visible   = i < count
              const isCursor  = i === count - 1
              return (
                <span
                  key={i}
                  className={
                    visible
                      ? isCursor ? styles.cursor : styles.shown
                      : styles.hidden
                  }
                >
                  {c}
                </span>
              )
            })}
            {count === 0 && <span className={styles.idleCursor} />}
          </p>

          {/* Scroll hint */}
          <motion.p
            className={styles.hint}
            animate={{ opacity: count > 3 ? 0 : 0.45 }}
            transition={{ duration: 0.3 }}
          >
            ↓ scroll to continue
          </motion.p>

          {/* Single CTA — only "See the work" */}
          <motion.div
            className={styles.ctas}
            animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            initial={{ opacity: 0, y: 14 }}
          >
            <motion.a
              href="#work"
              className="btn btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              SEE THE WORK ↓
            </motion.a>
            <motion.a
              href="#contact"
              className="btn btn-ghost"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              GET IN TOUCH →
            </motion.a>
          </motion.div>

          {/* Client logos row */}
          <motion.div
            className={styles.clientRow}
            animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            initial={{ opacity: 0, y: 10 }}
          >
            <span className={styles.clientLabel}>TRUSTED BY</span>
            <div className={styles.clients}>
              {/* SifaFX */}
              <div className={styles.clientLogo} title="SifaFX">
                <img src={sifafxLogo} alt="SifaFX"
                  style={{ height: 24, width: 'auto', objectFit: 'contain', display: 'block' }} />
              </div>
              {/* MpesaInsights */}
              <div className={styles.clientLogo} title="Mpesa Insights">
                <img src={mpesaLogo} alt="Mpesa Insights"
                  style={{ height: 24, width: 'auto', objectFit: 'contain', display: 'block' }} />
              </div>
              {/* KensAcademy */}
              <div className={styles.clientLogo} title="Kens Academy">
                <img src={kensLogo} alt="Kens Academy"
                  style={{ height: 24, width: 'auto', objectFit: 'contain', display: 'block' }} />
              </div>
            </div>
          </motion.div>

          {/* Tech stack carousel — scrolls right to left */}
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
