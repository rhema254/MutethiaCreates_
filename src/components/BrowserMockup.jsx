import { useState } from 'react'
import styles from './BrowserMockup.module.css'

/**
 * Screenshot URLs via microlink.io — no API key needed, free tier.
 * Returns a rendered screenshot of any public URL.
 */
function screenshotUrl(siteUrl) {
  const encoded = encodeURIComponent(siteUrl)
  return `https://api.microlink.io/?url=${encoded}&screenshot=true&meta=false&embed=screenshot.url&waitFor=2000&viewport.width=1280&viewport.height=800`
}

export default function BrowserMockup({ url, title }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)
  const imgSrc = screenshotUrl(url)

  return (
    <div className={styles.browser}>
      {/* Chrome bar */}
      <div className={styles.chrome}>
        <div className={styles.dots}>
          <span className={styles.dot} style={{ background: '#ff5f57' }} />
          <span className={styles.dot} style={{ background: '#febc2e' }} />
          <span className={styles.dot} style={{ background: '#28c840' }} />
        </div>
        <div className={styles.urlBar}>
          <span className={styles.lock}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <span className={styles.urlText}>
            {url.replace(/^https?:\/\//, '')}
          </span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.openBtn}
          title="Open site"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      {/* Screenshot viewport */}
      <div className={styles.viewport}>
        {/* Shimmer while loading */}
        {!loaded && !errored && (
          <div className={styles.shimmer}>
            <div className={styles.shimmerBar} style={{ width: '60%' }} />
            <div className={styles.shimmerBar} style={{ width: '40%' }} />
            <div className={styles.shimmerBlock} />
            <div className={styles.shimmerBar} style={{ width: '75%' }} />
            <div className={styles.shimmerBar} style={{ width: '50%' }} />
          </div>
        )}

        {!errored ? (
          <img
            src={imgSrc}
            alt={`Screenshot of ${title}`}
            className={`${styles.screenshot} ${loaded ? styles.screenshotVisible : ''}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
          />
        ) : (
          /* Fallback — styled placeholder matching the site */
          <div className={styles.fallback}>
            <div className={styles.fallbackIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <span className={styles.fallbackLabel}>{title}</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fallbackLink}
            >
              Open site →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
