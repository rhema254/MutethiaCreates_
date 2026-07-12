import { motion } from 'framer-motion'
import styles from './Footer.module.css'

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
  { label: 'GitHub', href: 'https://github.com/rhema254', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rhema-mutethia', external: true },
]

export default function Footer() {
  return (
    <motion.footer
      className={styles.footer}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.info}>
          <strong>MutethiaCreates</strong>
          <span>Software Development Studio · Nairobi, Kenya · Remote</span>
        </div>

        <ul className={styles.links}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={styles.link}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.copy}>
          MutethiaCreates · Nairobi, remote · © 2026
        </div>
      </div>
    </motion.footer>
  )
}
