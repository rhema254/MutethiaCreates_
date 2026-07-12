import { useEffect, useRef } from 'react'
import styles from './Starfield.module.css'

export default function Starfield({ fixed = false }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W = 0, H = 0
    let animId
    let stars = []
    let shooters = []

    // Smoothed spotlight position — trails behind cursor for delay effect
    let targetX = -9999, targetY = -9999
    let spotX   = -9999, spotY   = -9999
    const LERP  = 0.055  // 0 = no movement, 1 = instant; ~0.05 = heavy, dreamy lag

    const rand = (a, b) => Math.random() * (b - a) + a

    function resize() {
      W = fixed ? window.innerWidth  : canvas.offsetWidth
      H = fixed ? window.innerHeight : canvas.offsetHeight
      canvas.width  = W
      canvas.height = H
      resizeOffscreen()
      buildStars()
    }

    const isMobile = W < 768

    function buildStars() {
      // Fewer stars on mobile to save GPU
      const density = isMobile ? 8000 : 3800
      const count = Math.floor((W * H) / density)
      stars = Array.from({ length: count }, () => ({
        x:     rand(0, W),
        y:     rand(0, H),
        r:     rand(0.25, 1.5),
        phase: rand(0, Math.PI * 2),
        freq:  rand(0.0015, 0.006),
        tint:  Math.random() > 0.82,
      }))
    }

    function spawnShooter() {
      const startX   = rand(W * 0.05, W * 0.95)
      const startY   = rand(-20, H * 0.35)
      const angleDeg = rand(20, 60)
      const angleRad = angleDeg * (Math.PI / 180)
      const speed    = rand(1.2, 2.6)
      shooters.push({
        x: startX, y: startY,
        vx: Math.cos(angleRad) * speed,
        vy: Math.sin(angleRad) * speed,
        len:   rand(60, 130),
        life:  1,
        decay: rand(0.004, 0.008),
      })
    }

    // Spawn less frequently on mobile
    const spawnInterval = isMobile ? 6000 : 3500
    const spawnTimer = setInterval(() => {
      if (Math.random() > 0.3) spawnShooter()
    }, spawnInterval)

    // Mouse — track raw target; spotlight interpolates toward it each frame
    const onMouseMove = (e) => {
      if (fixed) {
        targetX = e.clientX
        targetY = e.clientY
      } else {
        const rect = canvas.getBoundingClientRect()
        targetX = e.clientX - rect.left
        targetY = e.clientY - rect.top
      }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Offscreen canvas — we draw a plain filled ellipse here, then composite
    // it onto the main canvas with ctx.filter='blur(Npx)'. A blurred solid
    // shape has a genuine Gaussian falloff — no visible ring edges, ever.
    const offscreen = document.createElement('canvas')
    const off = offscreen.getContext('2d')

    function resizeOffscreen() {
      offscreen.width  = W
      offscreen.height = H
    }

    let t = 0
    function draw() {
      ctx.clearRect(0, 0, W, H)
      t += 0.016

      // ── Lerp spotlight toward cursor (creates the delay) ──
      if (targetX > -100) {
        if (spotX < -100) { spotX = targetX; spotY = targetY }
        spotX += (targetX - spotX) * LERP
        spotY += (targetY - spotY) * LERP
      }

      // ── Spotlight — skip on mobile (ctx.filter is slow) ──
      if (spotX > -100 && !isMobile) {
        // Single compact mist — one blurred ellipse, no visible layers
        off.clearRect(0, 0, W, H)
        off.beginPath()
        off.ellipse(spotX, spotY, 55, 45, 0.4, 0, Math.PI * 2)
        off.fillStyle = 'rgba(255, 252, 225, 0.35)'
        off.fill()

        ctx.save()
        ctx.filter = 'blur(40px)'
        ctx.globalAlpha = 0.13
        ctx.drawImage(offscreen, 0, 0)
        ctx.restore()
      }

      // ── Static twinkling stars ──
      stars.forEach((s) => {
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.freq * 60 + s.phase)
        const alpha   = 0.2 + twinkle * 0.6
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = s.tint
          ? `rgba(232,255,110,${alpha * 0.5})`
          : `rgba(210,215,255,${alpha})`
        ctx.fill()
      })

      // ── Shooting stars ──
      shooters = shooters.filter((s) => s.life > 0)
      shooters.forEach((s) => {
        const steps = s.len / Math.hypot(s.vx, s.vy)
        const tailX = s.x - s.vx * steps
        const tailY = s.y - s.vy * steps

        const g = ctx.createLinearGradient(tailX, tailY, s.x, s.y)
        g.addColorStop(0,   'rgba(255,255,255,0)')
        g.addColorStop(0.5, `rgba(200,220,255,${s.life * 0.22})`)
        g.addColorStop(1,   `rgba(255,255,255,${s.life * 0.8})`)

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = g
        ctx.lineWidth = 1.2
        ctx.stroke()

        // bright tip
        ctx.beginPath()
        ctx.arc(s.x, s.y, 1.3 * s.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.life * 0.9})`
        ctx.fill()

        s.x    += s.vx
        s.y    += s.vy
        s.life -= s.decay
      })

      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const ro = new ResizeObserver(resize)
    if (fixed) {
      window.addEventListener('resize', resize)
    } else {
      ro.observe(canvas)
    }

    return () => {
      cancelAnimationFrame(animId)
      clearInterval(spawnTimer)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resize)
      ro.disconnect()
    }
  }, [fixed])

  return (
    <canvas
      ref={canvasRef}
      className={fixed ? styles.fixed : styles.canvas}
      aria-hidden="true"
    />
  )
}
