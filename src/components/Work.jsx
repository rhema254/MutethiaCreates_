import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BrowserMockup from './BrowserMockup'
import styles from './Work.module.css'

// ─── Projects ─────────────────────────────────────────────────
const projects = [
  {
    num: '01',
    badge: 'LIVE',
    title: 'Mpesa Insights',
    desc: 'Financial analytics platform that ingests M-Pesa PDF statements via AWS Textract, reconstructs transactions into a structured format, and surfaces spending behaviour insights in a real-time React dashboard.',
    problem: 'M-Pesa users had no way to analyse spending patterns from their PDF statements.',
    stack: ['Java Spring Boot', 'AWS Textract', 'AWS S3', 'MySQL', 'Docker', 'RabbitMQ', 'Redis', 'React'],
    href: 'https://mpesa-wrapped.vercel.app/',
    cta: 'VIEW PROJECT →',
    transition: 'slideLeft',
  },
  {
    num: '02',
    badge: 'LIVE',
    title: 'Kens Academy',
    desc: 'Full school management platform with role-based admin portal — student enrolment, teacher management, exam grading, multi-tier fee collection, attendance tracking, and audit trails.',
    problem: 'Schools needed a single system to manage students, fees, exams, and staff.',
    stack: ['Java Spring Boot', 'Spring Security', 'MySQL', 'REST APIs', 'RBAC'],
    href: 'https://kensacademy.mutethiacreates.online/',
    cta: 'VIEW PROJECT →',
    transition: 'slideRight',
  },
  {
    num: '03',
    badge: 'LIVE',
    title: 'SifaFX Booking Platform',
    desc: 'Appointment booking platform for a forex brokerage. Grew client base by 200% in two months. Google Calendar, Zoho Calendar & Email API integrations.',
    problem: 'SifaFX handled all bookings manually — no scheduling, no confirmations, high drop-off.',
    stack: ['Flask', 'PostgreSQL', 'SQLAlchemy', 'Google Calendar API', 'Zoho Email API'],
    href: 'https://flask-si.onrender.com/Homepage',
    cta: 'VIEW PROJECT →',
    transition: 'rotate',
  },
  {
    num: '04',
    badge: 'LIVE',
    title: 'Client Portfolio — MutethiaCreates',
    desc: 'Developer portfolio with a terminal-style UI for a backend engineer. Command-line metaphor, projects, certs, and contact — all in one place.',
    problem: 'Client needed a portfolio that communicated technical depth without looking generic.',
    stack: ['Frontend', 'Terminal UI', 'Responsive Design', 'Custom Domain'],
    href: 'https://portfolio.mutethiacreates.online/',
    cta: 'VIEW SITE →',
    transition: 'zoomFade',
  },
]

const CARD_SCROLL = 700  // px of scroll per project card

// ─── Continuous fireworks while section is in viewport ────────
function useFireworks(active) {
  const [bursts, setBursts] = useState([])

  useEffect(() => {
    if (!active) { setBursts([]); return }

    // Spawn a new burst every 900ms at a random position across the section
    const id = setInterval(() => {
      const x = 5 + Math.random() * 90   // % across
      const y = 10 + Math.random() * 80  // % down
      const burstId = Date.now() + Math.random()
      setBursts((b) => [...b.slice(-6), { id: burstId, x, y }])
      // clean up after animation
      setTimeout(() => {
        setBursts((b) => b.filter((bst) => bst.id !== burstId))
      }, 1200)
    }, 900)

    return () => clearInterval(id)
  }, [active])

  return bursts
}

function FireworkBurst({ x, y }) {
  const count = 18
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI
    const dist  = 45 + Math.random() * 55
    const color = i % 3 === 0 ? '#e8ff6e' : i % 3 === 1 ? '#ffffff' : '#a78bfa'
    return { tx: Math.cos(angle) * dist, ty: Math.sin(angle) * dist, color }
  })

  return (
    <div
      className={styles.fireworkBurst}
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className={styles.particle}
          style={{ background: p.color, boxShadow: `0 0 4px ${p.color}` }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.tx, y: p.ty, opacity: 0, scale: 0 }}
          transition={{
            duration: 0.65 + Math.random() * 0.45,
            ease: 'easeOut',
            delay: i * 0.018,
          }}
        />
      ))}
    </div>
  )
}

// ─── Title ────────────────────────────────────────────────────
function WorkTitle({ fireworksActive }) {
  const bursts = useFireworks(fireworksActive)

  return (
    <div className={styles.titleWrap}>
      {/* Continuous bursts overlay */}
      <div className={styles.fireworksLayer} aria-hidden="true">
        {bursts.map((b) => (
          <FireworkBurst key={b.id} x={b.x} y={b.y} />
        ))}
      </div>

      <motion.h2
        className={`section-heading ${styles.workTitle}`}
        initial={{ x: -120, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: false, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        Projects That Shipped
      </motion.h2>
    </div>
  )
}

// ─── Card variants ────────────────────────────────────────────
const VARIANTS = {
  slideLeft: {
    enter:  { x: '-100%', opacity: 0 },
    center: { x: 0,        opacity: 1 },
    exit:   { x: '100%',  opacity: 0 },
  },
  slideRight: {
    enter:  { x: '100%',  opacity: 0 },
    center: { x: 0,        opacity: 1 },
    exit:   { x: '-100%', opacity: 0 },
  },
  zoomFade: {
    enter:  { scale: 0.88, opacity: 0 },
    center: { scale: 1,    opacity: 1 },
    exit:   { scale: 1.08, opacity: 0 },
  },
}

function PaneContent({ project }) {
  return (
    <>
      <div className={styles.meta}>
        <span className={styles.num}>{project.num}</span>
        <span className={`${styles.badge} ${styles.live}`}>{project.badge}</span>
      </div>
      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.problem}>{project.problem}</p>
      <p className={styles.desc}>{project.desc}</p>
      <div className={styles.stack}>
        {project.stack.map((s) => <span key={s}>{s}</span>)}
      </div>
      <motion.a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cta}
        whileHover={{ x: 4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {project.cta}
      </motion.a>
    </>
  )
}

function ProjectCard({ project }) {
  const isRotate = project.transition === 'rotate'
  const vars     = isRotate ? null : (VARIANTS[project.transition] || VARIANTS.slideLeft)
  const dur      = { duration: 0.55, ease: [0.22, 1, 0.36, 1] }

  // Pane variants for the rotate transition
  const textV = {
    enter:  { rotateY: -120, x: -50, opacity: 0 },
    center: { rotateY: 0,    x: 0,   opacity: 1 },
    exit:   { rotateY:  120, x:  50, opacity: 0 },
  }
  const previewV = {
    enter:  { rotateY:  120, x:  50, opacity: 0 },
    center: { rotateY: 0,    x: 0,   opacity: 1 },
    exit:   { rotateY: -120, x: -50, opacity: 0 },
  }

  if (isRotate) {
    return (
      <div className={styles.card} style={{ perspective: 1400 }}>
        <motion.div
          className={styles.textPane}
          variants={textV}
          initial="enter"
          animate="center"
          exit="exit"
          transition={dur}
        >
          <PaneContent project={project} />
        </motion.div>
        <motion.div
          className={styles.previewPane}
          variants={previewV}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ ...dur, delay: 0.07 }}
        >
          <BrowserMockup url={project.href} title={project.title} />
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      className={styles.card}
      variants={vars}
      initial="enter"
      animate="center"
      exit="exit"
      transition={dur}
    >
      <div className={styles.textPane}>
        <PaneContent project={project} />
      </div>
      <div className={styles.previewPane}>
        <BrowserMockup url={project.href} title={project.title} />
      </div>
    </motion.div>
  )
}

// ─── Sticky scroll carousel ────────────────────────────────────
function ProjectCarousel({ onInView, fireworksActive }) {
  const outerRef = useRef(null)
  const [active, setActive] = useState(0)
  const total       = projects.length
  const totalScroll = total * CARD_SCROLL

  useEffect(() => {
    const onScroll = () => {
      if (!outerRef.current) return
      const rect       = outerRef.current.getBoundingClientRect()
      const scrolledIn = -rect.top
      const prog       = Math.max(0, Math.min(total - 0.001, scrolledIn / CARD_SCROLL))
      setActive(Math.floor(prog))
      const inView = rect.top < window.innerHeight && rect.bottom > 0
      onInView?.(inView)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [total, onInView])

  return (
    <div
      className={styles.carouselOuter}
      style={{ height: `calc(100vh + ${totalScroll}px)` }}
      ref={outerRef}
    >
      <div className={styles.carouselSticky}>
        {/* Fireworks layer lives here so it's always over the sticky frame */}
        <WorkTitle fireworksActive={fireworksActive} />

        {/* Progress dots */}
        <div className={styles.dots}>
          {projects.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <ProjectCard key={active} project={projects[active]} />
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────
export default function Work() {
  const sectionRef          = useRef(null)
  const [fwActive, setFwActive] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setFwActive(entry.isIntersecting),
      { threshold: 0.05 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="work" className={styles.section} ref={sectionRef}>
      <ProjectCarousel onInView={setFwActive} fireworksActive={fwActive} />
    </section>
  )
}
