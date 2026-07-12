import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Principles.module.css'

const principles = [
  {
    num: '01',
    title: 'I OWN THE OUTCOME',
    desc: 'Give us the problem, not a task list. We find the path, flag risks early, and ship. You do not chase us.',
  },
  {
    num: '02',
    title: 'SECURITY IS NOT AN AFTERTHOUGHT',
    desc: 'RBAC, Maker-Checker, Spring Security, Azure AD. We wire in the right security pattern before the first line of business logic.',
  },
  {
    num: '03',
    title: 'DECISIONS IN WRITING',
    desc: 'Your engineers get the technical detail. Your stakeholders get the business case. Same decision, two versions. No translation lost.',
  },
  {
    num: '04',
    title: 'AGILE, NOT AGILE-THEATER',
    desc: 'Iterative delivery, end-of-sprint feedback, client requirements translated directly into working software. Not a process document.',
  },
]

function PrincipleCard({ principle, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ backgroundColor: 'var(--dark)' }}
    >
      <div className={styles.num}>{principle.num}</div>
      <h3 className={styles.title}>{principle.title}</h3>
      <p className={styles.desc}>{principle.desc}</p>
    </motion.div>
  )
}

export default function Principles() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-60px' })

  return (
    <section className={`container ${styles.section}`} ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-label">HOW I WORK</div>
        <h2 className="section-heading">What working with me looks like.</h2>
      </motion.div>

      <div className={styles.grid}>
        {principles.map((p, i) => (
          <PrincipleCard key={p.num} principle={p} index={i} />
        ))}
      </div>
    </section>
  )
}
