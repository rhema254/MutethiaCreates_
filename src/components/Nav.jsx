import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import styles from './Nav.module.css'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on('change', (y) => setScrolled(y > 60))
  }, [scrollY])

  // Close menu on route change / scroll
  useEffect(() => {
    const close = () => setMenuOpen(false)
    window.addEventListener('scroll', close, { passive: true })
    return () => window.removeEventListener('scroll', close)
  }, [])

  const links = [
    { href: '#work',    label: 'Work' },
    { href: '#about',   label: 'About' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <>
      <motion.header
        className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className={`${styles.nav} container`}>
          <a href="#" className={styles.logo}>MUTETHIACREATES</a>

          {/* Desktop links */}
          <ul className={styles.links}>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link}>{link.label}</a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <motion.a
            href="mailto:karhem254@gmail.com"
            className={`${styles.cta} ${styles.desktopCta}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            GET IN TOUCH
          </motion.a>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
          </button>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.drawer}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <ul className={styles.drawerLinks}>
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={styles.drawerLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="mailto:karhem254@gmail.com"
              className={`btn btn-primary ${styles.drawerCta}`}
              onClick={() => setMenuOpen(false)}
            >
              GET IN TOUCH
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
