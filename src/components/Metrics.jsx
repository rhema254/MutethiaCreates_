import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Metrics.module.css'
import mpesaLogo  from '../assets/MpesaInsights Logo.png'
import sifafxLogo from '../assets/sifafx.svg'
import kensLogo   from '../assets/KensSchool.svg'

const clients = [
  {
    slug: 'sifafx',
    name: 'SifaFX',
    type: 'Forex Brokerage',
    outcome: '+200% client growth in 60 days',
    detail: 'Appointment booking platform with Google Calendar and Zoho API integrations.',
    href: 'https://flask-si.onrender.com/Homepage',
    Logo: () => (
      <img src={sifafxLogo} alt="SifaFX" className={styles.logoImg} />
    ),
  },
  {
    slug: 'mpesa',
    name: 'Mpesa Insights',
    type: 'FinTech Analytics',
    outcome: 'Real-time spending intelligence',
    detail: 'Document AI pipeline using AWS Textract, async processing, React dashboard.',
    href: 'https://mpesa-wrapped.vercel.app/',
    Logo: () => (
      <img src={mpesaLogo} alt="Mpesa Insights" className={styles.logoImg} />
    ),
  },
  {
    slug: 'kens',
    name: 'Kens Academy',
    type: 'EdTech Platform',
    outcome: 'Multi-role school management system',
    detail: 'Students, teachers, exams, fees, attendance. One platform, full RBAC.',
    href: 'https://kensacademy.mutethiacreates.online/',
    Logo: () => (
      <img src={kensLogo} alt="Kens Academy" className={styles.logoImg} />
    ),
  },
]

function ClientCard({ client, index }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className={styles.card}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Row 1: logo + name + industry in one horizontal line */}
      <div className={styles.row1}>
        <div className={styles.logoWrap}>
          <client.Logo />
        </div>
        <div className={styles.identity}>
          <span className={styles.name}>{client.name}</span>
          <span className={styles.type}>{client.type}</span>
        </div>
      </div>

      {/* Row 2: outcome, detail, CTA */}
      <div className={styles.row2}>
        <p className={styles.outcome}>{client.outcome}</p>
        <p className={styles.detail}>{client.detail}</p>
        <a
          href={client.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.visitBtn}
        >
          Visit Website
        </a>
      </div>
    </motion.div>
  )
}

export default function Metrics() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-60px' })

  return (
    <section className={`container ${styles.section}`}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-label">PREVIOUS CLIENTS</div>
        <h2 className="section-heading">Companies that trusted us to ship.</h2>
      </motion.div>

      <div className={styles.grid}>
        {clients.map((c, i) => (
          <ClientCard key={c.slug} client={c} index={i} />
        ))}
      </div>
    </section>
  )
}
