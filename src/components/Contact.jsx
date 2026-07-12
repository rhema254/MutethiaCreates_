import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import ReCAPTCHA from 'react-google-recaptcha'
import emailjs from '@emailjs/browser'
import styles from './Contact.module.css'

/**
 * EmailJS setup (one-time, free):
 * 1. Go to https://www.emailjs.com and sign up (free tier = 200 emails/month)
 * 2. Add Email Service → connect your Gmail (karhem254@gmail.com)
 *    → copy the Service ID  → paste as EMAILJS_SERVICE_ID below
 * 3. Create Email Template → use these variables in your template:
 *      {{from_name}}  {{from_email}}  {{company}}  {{services}}  {{message}}
 *    → copy the Template ID → paste as EMAILJS_TEMPLATE_ID below
 * 4. Go to Account → API Keys → copy Public Key
 *    → paste as EMAILJS_PUBLIC_KEY below
 */
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const RECAPTCHA_SITE_KEY  = import.meta.env.VITE_RECAPTCHA_SITE_KEY

const SERVICES = [
  'API Integration',
  'Dashboard & Analytics',
  'AI Integration',
  'Payment Gateway',
  'Website / Branding',
  'Software Deployment',
  'Full-stack Development',
  'Technical Support',
  'Other',
]

const CHANNELS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    value: 'karhem254@gmail.com',
    href: 'mailto:karhem254@gmail.com',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.845L.057 23.18a.75.75 0 0 0 .916.916l5.335-1.47A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
    label: 'WhatsApp',
    value: '+254 702 239 686',
    href: 'https://wa.me/254702239686',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
      </svg>
    ),
    label: 'MS Teams',
    value: 'rhemambaabu@gmail.com',
    href: 'https://teams.microsoft.com/l/chat/0/0?users=rhemambaabu@gmail.com',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    label: 'LinkedIn',
    value: 'rhema-mutethia',
    href: 'https://www.linkedin.com/in/rhema-mutethia',
  },
]

export default function Contact() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })

  const [form, setForm]         = useState({ name: '', email: '', company: '', message: '' })
  const [services, setServices] = useState(new Set())
  const [status, setStatus]     = useState('idle')
  const [touched, setTouched]   = useState({})
  const [captcha, setCaptcha]   = useState(null)  // reCAPTCHA token
  const captchaRef              = useRef(null)

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const touch  = (k)    => setTouched((t) => ({ ...t, [k]: true }))

  const toggleService = (s) => {
    setServices((prev) => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })
  }

  const valid = form.name.trim() && form.email.includes('@') && services.size > 0 && !!captcha

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!valid) return
    setStatus('sending')

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.name.trim(),
          from_email: form.email.trim(),
          company:    form.company.trim() || '—',
          services:   [...services].join(', '),
          message:    form.message.trim() || '—',
          // reply_to is used by EmailJS to set Reply-To header
          reply_to:   form.email.trim(),
        },
        EMAILJS_PUBLIC_KEY
      )
      setStatus('sent')
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
      // Reset captcha on error so user can retry
      captchaRef.current?.reset()
      setCaptcha(null)
    }
  }

  return (
    <section className="container" id="contact" ref={ref}>
      {/* ── Transition: section scrolls up with rising opacity ── */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-label">GET IN TOUCH</div>
        <h2 className="section-heading">Let&apos;s build something together.</h2>      </motion.div>

      <div className={styles.layout}>

        {/* ── Left: form ── */}
        <motion.div
          className={styles.formWrap}
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.glow} />

          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div
                key="sent"
                className={styles.thanks}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className={styles.checkIcon}>✓</div>
                <h3>Request received.</h3>
                <p>I&apos;ll review your enquiry and reach out within 24 hours. Check your email for a confirmation.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className={styles.form}
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Your name *</label>
                    <input
                      className={`${styles.input} ${touched.name && !form.name.trim() ? styles.inputError : ''}`}
                      type="text"
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      onBlur={() => touch('name')}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Email address *</label>
                    <input
                      className={`${styles.input} ${touched.email && !form.email.includes('@') ? styles.inputError : ''}`}
                      type="email"
                      placeholder="jane@company.com"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      onBlur={() => touch('email')}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Company / Project name</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Acme Corp"
                    value={form.company}
                    onChange={(e) => update('company', e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>What do you need? *</label>
                  <div className={styles.chips}>
                    {SERVICES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`${styles.chip} ${services.has(s) ? styles.chipActive : ''}`}
                        onClick={() => toggleService(s)}
                      >
                        {services.has(s) && <span className={styles.chipCheck}>✓</span>}
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Tell me more</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Brief description of the project, timeline, or any questions…"
                    rows={4}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                  />
                </div>

                {/* reCAPTCHA */}
                <div className={styles.captchaWrap}>
                  <ReCAPTCHA
                    ref={captchaRef}
                    sitekey={RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                    onChange={(token) => setCaptcha(token)}
                    onExpired={() => setCaptcha(null)}
                    theme="dark"
                  />
                </div>

                <motion.button
                  type="submit"
                  className={`btn btn-primary ${styles.submit}`}
                  disabled={!valid || status === 'sending'}
                  whileHover={valid ? { scale: 1.02 } : {}}
                  whileTap={valid ? { scale: 0.98 } : {}}
                >
                  {status === 'sending' ? 'Sending…' : 'SCHEDULE A MEETING'}
                </motion.button>

                {status === 'error' && (
                  <p className={styles.errorNote}>
                    Something went wrong. Email me directly at{' '}
                    <a href="mailto:karhem254@gmail.com">karhem254@gmail.com</a>
                  </p>
                )}

                <p className={styles.formNote}>
                  I&apos;ll reply within 24 hours to confirm a meeting time.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Right: channels ── */}
        <motion.div
          className={styles.channels}
          initial={{ opacity: 0, x: 24 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.channelsIntro}>
            Prefer to reach out directly? I&apos;m available on all of these.
            I&apos;ll respond as soon as possible and we&apos;ll find a time that works.
          </p>

          <div className={styles.channelList}>
            {CHANNELS.map((ch, i) => (
              <motion.a
                key={ch.label}
                href={ch.href}
                target={ch.href.startsWith('http') ? '_blank' : undefined}
                rel={ch.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={styles.channel}
                initial={{ opacity: 0, x: 16 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                whileHover={{ x: 4, color: 'var(--white)' }}
              >
                <span className={styles.channelIcon}>{ch.icon}</span>
                <div>
                  <div className={styles.channelLabel}>{ch.label}</div>
                  <div className={styles.channelValue}>{ch.value}</div>
                </div>
              </motion.a>
            ))}
          </div>

          <div className={styles.availability}>
            <span className={styles.availDot} />
            <span>Currently available for part-time & contract engagements</span>
          </div>
        </motion.div>
      </div>
      </motion.div>
    </section>
  )
}
