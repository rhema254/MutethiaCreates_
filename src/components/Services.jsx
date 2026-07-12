import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Services.module.css'

const services = [
  {
    num: '01',
    title: 'Enterprise Backend Engineering',
    desc: 'ERP modules, multi-tenant architectures, RBAC systems, and financial workflows built in Java Spring Boot. Maker-Checker security patterns baked in from day one.',
  },
  {
    num: '02',
    title: 'Cloud and DevOps Setup',
    desc: 'AWS infrastructure (EC2, S3, RDS, SQS, SNS, IAM), Docker containerisation, CI/CD pipelines with GitHub Actions or Jenkins. Set up so it does not break at 2AM.',
  },
  {
    num: '03',
    title: 'Web Design and API Integration',
    desc: 'Pixel-sharp interfaces paired with clean REST/GraphQL APIs. Payment gateways, third-party service orchestration, and async messaging wired together so the UX never waits on the backend.',
  },
  {
    num: '04',
    title: 'AI and Data Pipelines',
    desc: 'Turning unstructured data into usable insights using AWS Textract, Generative AI tooling, and structured analytical backends. If the data is messy, we clean it up.',
  },
]

const SCROLL_HEIGHT  = 2800
const TITLE_ENTRY_END = 0.12

function timing(i) {
  return {
    entryStart: 0.15 + i * 0.10,
    entryEnd:   0.15 + i * 0.10 + 0.12,
    exitStart:  0.75 + i * 0.065,
    exitEnd:    0.75 + i * 0.065 + 0.07,
  }
}

// ── Mobile: plain stacked cards ───────────────────────────────
function ServicesMobile() {
  return (
    <section className={styles.mobileSection}>
      <div className="container">
        <div className="section-label">HOW YOU CAN HIRE ME</div>
        <h2 className="section-heading">Typical Engagements</h2>
        <div className={styles.mobileGrid}>
          {services.map((s, i) => (
            <MobileCard key={s.num} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MobileCard({ service, index }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
    >
      <div className={styles.cardNum}>{service.num}</div>
      <h3 className={styles.cardTitle}>{service.title}</h3>
      <p className={styles.cardDesc}>{service.desc}</p>
    </motion.div>
  )
}

// ── Desktop: sticky scroll animation ─────────────────────────
function ServicesDesktop() {
  const outerRef = useRef(null)
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
          <div className={styles.header}>
            <div className="section-label">HOW YOU CAN HIRE ME</div>
            <div
              className={`section-heading ${styles.titleAnimated}`}
              style={{ transform: `translateX(${titleX}px)`, opacity: titleOpacity }}
            >
              Typical Engagements
            </div>
          </div>
          <div className={styles.grid}>
            {services.map((s, i) => {
              const { entryStart, entryEnd, exitStart, exitEnd } = timing(i)
              const entryProg = Math.max(0, Math.min(1, (prog - entryStart) / (entryEnd - entryStart)))
              const exitProg  = Math.max(0, Math.min(1, (prog - exitStart)  / (exitEnd  - exitStart)))
              const opacity = entryProg * (1 - exitProg)
              const y = entryProg < 1 ? 80 * (1 - entryProg) : -50 * exitProg
              return (
                <div
                  key={s.num}
                  className={styles.cardWrap}
                  style={{ opacity, transform: `translateY(${y}px)`, visibility: opacity < 0.01 ? 'hidden' : 'visible' }}
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

export default function Services() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    check()
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile ? <ServicesMobile /> : <ServicesDesktop />
}
