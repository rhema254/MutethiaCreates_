import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './PageLoader.module.css'

/**
 * Full-screen intro loader.
 *
 * - Waits for window 'load' event (all assets fetched)
 * - Then runs its animation for at least 2 seconds total
 * - Calls onDone() when the exit transition completes
 */
export default function PageLoader({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting]   = useState(false)
  const [started, setStarted]   = useState(false)

  // Step 1: wait for page load + 2 s minimum
  useEffect(() => {
    const MIN_DURATION = 2000 // ms total before exit begins
    let startTime = null
    let progressTimers = []
    let exitTimer = null

    function begin() {
      startTime = Date.now()
      setStarted(true)

      // Smooth progress ticks spread over ~1.3 s
      const steps  = [10, 28, 48, 65, 82, 100]
      const delays = [100, 250, 420, 620, 860, 1150]

      progressTimers = steps.map((val, i) =>
        setTimeout(() => setProgress(val), delays[i])
      )

      // Exit: wait for MIN_DURATION from the moment we started
      const elapsed = Date.now() - startTime
      const wait    = Math.max(0, MIN_DURATION - elapsed)
      exitTimer = setTimeout(() => setExiting(true), 1200 + wait)
    }

    if (document.readyState === 'complete') {
      // Already loaded — still give 2 s
      setTimeout(begin, 0)
    } else {
      window.addEventListener('load', begin, { once: true })
    }

    return () => {
      window.removeEventListener('load', begin)
      progressTimers.forEach(clearTimeout)
      if (exitTimer) clearTimeout(exitTimer)
    }
  }, [])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!exiting && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* grid texture */}
          <div className={styles.grid} />

          {/* wordmark */}
          <motion.div
            className={styles.wordmark}
            initial={{ opacity: 0, y: 10 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            MUTETHIACREATES
          </motion.div>

          {/* big counter */}
          <div className={styles.center}>
            <motion.span
              className={styles.counter}
              key={progress}
              initial={{ opacity: 0.3, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
            >
              {progress}
            </motion.span>
            <motion.span
              className={styles.percent}
              initial={{ opacity: 0 }}
              animate={started ? { opacity: 0.4 } : {}}
              transition={{ delay: 0.25 }}
            >
              %
            </motion.span>
          </div>

          {/* progress bar */}
          <div className={styles.barTrack}>
            <motion.div
              className={styles.barFill}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ originX: 0 }}
            />
          </div>

          {/* label */}
          <motion.p
            className={styles.label}
            initial={{ opacity: 0 }}
            animate={started ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            Software Development Studio · Nairobi
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
