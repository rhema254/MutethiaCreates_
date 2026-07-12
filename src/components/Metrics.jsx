import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Metrics.module.css'
import mpesaLogo    from '../assets/MpesaInsights Logo.png'
import sifafxLogo   from '../assets/sifafx.svg'
import kensLogo     from '../assets/KensSchool.svg'

/**
 * "Clients" section — replaces abstract metrics with real companies.
 * Each card has an SVG logo, company name, engagement type, and key outcome.
 */
const clients = [
  {
    slug: 'sifafx',
    name: 'SifaFX',
    type: 'Forex Brokerage',
    outcome: '+200% client growth in 60 days',
    detail: 'Appointment booking platform, Google Calendar + Zoho API integrations.',
    href: 'https://flask-si.onrender.com/Homepage',
    Logo: () => (
      <div style={{ width: 56, height: 56, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={sifafxLogo} alt="SifaFX logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    ),
  },
  {
    slug: 'mpesa',
    name: 'Mpesa Insights',
    type: 'FinTech Analytics',
    outcome: 'Real-time spending intelligence',
    detail: 'Document AI pipeline (AWS Textract), async processing, React dashboard.',
    href: 'https://mpesainsight.mutethiacreates.online',
    Logo: () => (
      <div style={{ width: 56, height: 56, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={mpesaLogo} alt="Mpesa Insights logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    ),
  },
  {
    slug: 'kens',
    name: 'Kens Academy',
    type: 'EdTech Platform',
    outcome: 'Multi-role school management system',
    detail: 'Students, teachers, exams, fees, attendance — one platform, full RBAC.',
    href: 'https://kensacademy.mutethiacreates.online/',
    Logo: () => (
      <div style={{ width: 56, height: 56, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={kensLogo} alt="Kens Academy logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    ),
  },
]

function ClientCard({ client, index }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-60px' })

  return (
    <motion.a
      ref={ref}
      href={client.href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)', y: -2 }}
    >
      <div className={styles.logoWrap}>
        <client.Logo />
      </div>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{client.name}</span>
          <span className={styles.type}>{client.type}</span>
        </div>
        <p className={styles.outcome}>{client.outcome}</p>
        <p className={styles.detail}>{client.detail}</p>
      </div>
      <div className={styles.arrow}>→</div>
    </motion.a>
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
