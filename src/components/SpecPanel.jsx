import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import styles from './SpecPanel.module.css'

const ITEMS = [
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

// ITEM_W: approximate width of one item in px (label + value + gap)
const ITEM_W = 260
const HALF   = (ITEMS.length / 2) * ITEM_W  // width of one full set

export default function SpecPanel() {
  const wrapperRef = useRef(null)
  const trackRef   = useRef(null)
  const inView     = useInView(wrapperRef, { once: false, margin: '-80px' })

  // The x position that drives the marquee
  const x      = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 60, damping: 28, mass: 1.2 })

  // Track scroll to drive the marquee — mapped so one full page scroll = one loop
  useEffect(() => {
    if (!inView) return

    const onScroll = () => {
      const wrapTop    = wrapperRef.current?.getBoundingClientRect().top ?? 0
      const viewH      = window.innerHeight
      // progress 0→1 as the panel enters and passes through the viewport
      const rawProgress = 1 - (wrapTop / viewH)
      const progress    = Math.max(0, Math.min(1.5, rawProgress))
      // map progress to translation: 0 → 0px, at 1 → -HALF (full loop)
      const translate   = -(progress * HALF * 0.9)
      x.set(translate % -HALF)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [inView, x])

  return (
    <div
      className={styles.wrapper}
      ref={wrapperRef}
      aria-label="About me — quick facts"
    >
      {/* fade edges */}
      <div className={styles.fadeLeft}  aria-hidden="true" />
      <div className={styles.fadeRight} aria-hidden="true" />

      <motion.div
        ref={trackRef}
        className={styles.track}
        style={{ x: springX }}
      >
        {ITEMS.map((item, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.label}>{item.label}</span>
            <span className={`${styles.value} ${item.green ? styles.green : ''}`}>
              {item.value}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
