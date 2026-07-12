import { useState, useEffect, useMemo, useRef } from 'react'
import {
  motion,
  useTransform,
  useSpring,
  useMotionValue,
} from 'framer-motion'
import styles from './WorkMorphHero.module.css'

// Project preview images — using real screenshots via open screenshot services
// plus Unsplash fallbacks for ones that block embedding
const PROJECT_IMAGES = [
  // Mpesa Wrapped — financial dashboard
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&q=80', // finance/charts
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&q=80', // analytics
  // Client Portfolio — terminal/dev portfolio
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=80', // code terminal
  'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=300&q=80', // portfolio/web
  // Kens Academy — school admin dashboard
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&q=80', // school
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&q=80', // education
  // SifaFX — booking/forex
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&q=80', // forex
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&q=80', // calendar/booking
  // Extra filler — enterprise/backend theme
  'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=300&q=80',
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=300&q=80',
  'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=300&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&q=80',
  'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=300&q=80',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&q=80',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&q=80',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=300&q=80',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&q=80',
  'https://images.unsplash.com/photo-1478432780021-b8d273730d8c?w=300&q=80',
  'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=300&q=80',
  'https://images.unsplash.com/photo-1504270997636-07ddfbd48945?w=300&q=80',
]

const TOTAL = PROJECT_IMAGES.length
const MAX_SCROLL = 3000
const IMG_W = 62
const IMG_H = 88

const lerp = (a, b, t) => a * (1 - t) + b * t

function FlipCard({ src, index, target }) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: 'spring', stiffness: 40, damping: 15 }}
      style={{
        position: 'absolute',
        width: IMG_W,
        height: IMG_H,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={styles.flipWrapper}
    >
      <motion.div
        style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%', position: 'relative' }}
        whileHover={{ rotateY: 180 }}
        transition={{ duration: 0.55, type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <div className={styles.face} style={{ backfaceVisibility: 'hidden' }}>
          <img src={src} alt="" className={styles.cardImg} />
          <div className={styles.overlay} />
        </div>
        {/* Back */}
        <div
          className={`${styles.face} ${styles.back}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className={styles.backLabel}>VIEW</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function WorkMorphHero() {
  const [phase, setPhase] = useState('scatter')
  const [size, setSize] = useState({ w: 0, h: 0 })
  const containerRef = useRef(null)
  const scrollRef = useRef(0)
  const virtualScroll = useMotionValue(0)

  // Container size
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => {
      const e = entries[0]
      setSize({ w: e.contentRect.width, h: e.contentRect.height })
    })
    ro.observe(containerRef.current)
    setSize({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight })
    return () => ro.disconnect()
  }, [])

  // Virtual scroll
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const next = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL)
      scrollRef.current = next
      virtualScroll.set(next)
    }
    let touchY = 0
    const onTouchStart = (e) => { touchY = e.touches[0].clientY }
    const onTouchMove = (e) => {
      const delta = touchY - e.touches[0].clientY
      touchY = e.touches[0].clientY
      const next = Math.min(Math.max(scrollRef.current + delta, 0), MAX_SCROLL)
      scrollRef.current = next
      virtualScroll.set(next)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
    }
  }, [virtualScroll])

  // Morph (0→1): circle → arc
  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1])
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 })

  // Scroll-rotate the arc
  const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360])
  const smoothRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 })

  // Mouse parallax
  const mouseX = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 })
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      mouseX.set(((e.clientX - rect.left) / rect.width * 2 - 1) * 80)
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [mouseX])

  // Intro sequence
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('line'), 400)
    const t2 = setTimeout(() => setPhase('circle'), 2000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Subscribe to motion values for render
  const [morphVal, setMorphVal] = useState(0)
  const [rotateVal, setRotateVal] = useState(0)
  const [parallaxVal, setParallaxVal] = useState(0)
  useEffect(() => {
    const u1 = smoothMorph.on('change', setMorphVal)
    const u2 = smoothRotate.on('change', setRotateVal)
    const u3 = smoothMouseX.on('change', setParallaxVal)
    return () => { u1(); u2(); u3() }
  }, [smoothMorph, smoothRotate, smoothMouseX])

  // Scatter positions (stable)
  const scatter = useMemo(() =>
    PROJECT_IMAGES.map(() => ({
      x: (Math.random() - 0.5) * 1400,
      y: (Math.random() - 0.5) * 900,
      rotation: (Math.random() - 0.5) * 180,
      scale: 0.6,
      opacity: 0,
    }))
  , [])

  // Content fade
  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1])
  const contentY = useTransform(smoothMorph, [0.8, 1], [16, 0])

  return (
    <div ref={containerRef} className={styles.root}>
      {/* Intro text */}
      <div className={styles.introText}>
        <motion.p
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={
            phase === 'circle' && morphVal < 0.5
              ? { opacity: 1 - morphVal * 2, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, filter: 'blur(8px)' }
          }
          transition={{ duration: 0.8 }}
          className={styles.introSub}
        >
          SCROLL TO EXPLORE PROJECTS
        </motion.p>
      </div>

      {/* Arc content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className={styles.arcContent}
      >
        <p className={styles.arcLabel}>SELECTED WORK</p>
        <p className={styles.arcHint}>Scroll to shuffle through the projects ↓</p>
      </motion.div>

      {/* Cards */}
      <div className={styles.stage}>
        {PROJECT_IMAGES.map((src, i) => {
          let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 }

          if (phase === 'scatter') {
            target = scatter[i]
          } else if (phase === 'line') {
            const spacing = 68
            const total = TOTAL * spacing
            target = { x: i * spacing - total / 2, y: 0, rotation: 0, scale: 1, opacity: 1 }
          } else {
            const isMobile = size.w < 768
            const minDim = Math.min(size.w, size.h)

            // Circle
            const cR = Math.min(minDim * 0.35, 340)
            const cAngle = (i / TOTAL) * 360
            const cRad = (cAngle * Math.PI) / 180
            const circlePos = {
              x: Math.cos(cRad) * cR,
              y: Math.sin(cRad) * cR,
              rotation: cAngle + 90,
            }

            // Arc
            const baseR = Math.min(size.w, size.h * 1.5)
            const arcR = baseR * (isMobile ? 1.4 : 1.1)
            const apexY = size.h * (isMobile ? 0.35 : 0.25)
            const arcCenterY = apexY + arcR
            const spread = isMobile ? 100 : 130
            const startAngle = -90 - spread / 2
            const step = spread / (TOTAL - 1)
            const scrollProg = Math.min(Math.max(rotateVal / 360, 0), 1)
            const boundedRot = -scrollProg * spread * 0.8
            const curAngle = startAngle + i * step + boundedRot
            const aRad = (curAngle * Math.PI) / 180
            const arcPos = {
              x: Math.cos(aRad) * arcR + parallaxVal,
              y: Math.sin(aRad) * arcR + arcCenterY,
              rotation: curAngle + 90,
              scale: isMobile ? 1.4 : 1.8,
            }

            target = {
              x: lerp(circlePos.x, arcPos.x, morphVal),
              y: lerp(circlePos.y, arcPos.y, morphVal),
              rotation: lerp(circlePos.rotation, arcPos.rotation, morphVal),
              scale: lerp(1, arcPos.scale, morphVal),
              opacity: 1,
            }
          }

          return <FlipCard key={i} src={src} index={i} target={target} />
        })}
      </div>
    </div>
  )
}
