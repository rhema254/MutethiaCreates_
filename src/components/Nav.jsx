import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import styles from './Nav.module.css'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on('change', (y) => setScrolled(y > 60))
  }, [scrollY])

  const links = [
    { href: '#work', label: 'Work' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <motion.header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className={`${styles.nav} container`}>
        <a href="#" className={styles.logo}>MUTETHIACREATES</a>

        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link}>{link.label}</a>
            </li>
          ))}
        </ul>

        <motion.a
          href="mailto:rhemambaabu@gmail.com"
          className={styles.cta}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          GET IN TOUCH →
        </motion.a>
      </nav>
    </motion.header>
  )
}
