import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './About.module.css'
import rhemaPhoto from '../assets/Rhema_Mutethia.jpg'

const creds = [
  { label: 'Education',  value: 'BSc. Computer Science · Kenyatta University' },
  { label: 'Cloud',      value: 'AWS Certified AI Practitioner' },
  { label: 'Cloud',      value: 'AWS Certified Cloud Practitioner' },
]

export default function About() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })

  return (
    <section
      className={`container ${styles.section}`}
      id="about"
      ref={ref}
    >
      <div className={styles.grid}>

        {/* ── Left column: portrait + accomplishments ── */}
        <motion.div
          className={styles.leftCol}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Portrait */}
          <div className={styles.portraitWrap}>
            <div className={styles.portrait}>
              <img
                src={rhemaPhoto}
                alt="Rhema Mutethia"
                className={styles.portraitImg}
              />
            </div>
            <motion.div
              className={styles.ring}
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Name + role */}
          <div className={styles.nameBlock}>
            <span className={styles.personName}>Rhema Mutethia</span>
            <span className={styles.personRole}>Founder · Software Engineer</span>
          </div>

          {/* Accomplishments */}
          <div className={styles.creds}>
            {creds.map((c, i) => (
              <motion.div
                key={i}
                className={styles.cred}
                initial={{ opacity: 0, x: -14 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
                transition={{ duration: 0.45, delay: 0.35 + i * 0.09 }}
              >
                <span className={styles.credLabel}>{c.label}</span>
                <span className={styles.credValue}>{c.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Right column: description ── */}
        <motion.div
          className={styles.rightCol}
          initial={{ opacity: 0, x: 32 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 32 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="section-label">WHO YOU&apos;D BE WORKING WITH</div>
          <h2 className="section-heading">
            We are MutethiaCreates, a software studio based in Nairobi.
          </h2>
          <p>
            We take complex problems — broken integrations, systems that do not scale,
            features stuck in sprint — and ship the fix. Our background spans enterprise Java,
            cloud infrastructure, and AI-powered data work.
          </p>
          <p>
            We document the reasoning behind every decision, because in six months that reasoning
            is the only thing that saves you from rebuilding the same thing twice.
          </p>
          <p>
            Whether it is a polished client-facing UI, a payment integration, or a
            backend that handles real load, we own it end-to-end and explain every tradeoff
            to whoever needs to know.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
