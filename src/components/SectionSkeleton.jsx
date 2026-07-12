import { motion } from 'framer-motion'
import styles from './SectionSkeleton.module.css'

/**
 * Shown by Suspense while a lazy section chunk is loading.
 * A minimal shimmer so the page doesn't jump.
 */
export default function SectionSkeleton({ rows = 3 }) {
  return (
    <div className={`container ${styles.wrapper}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          className={styles.bone}
          style={{ width: `${85 - i * 12}%` }}
          animate={{ opacity: [0.04, 0.1, 0.04] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}
