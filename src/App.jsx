import { lazy, Suspense, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageLoader from './components/PageLoader'
import SectionSkeleton from './components/SectionSkeleton'
import Starfield from './components/Starfield'
import './App.css'

// Eager — above the fold
import Nav from './components/Nav'
import Hero from './components/Hero'

// Lazy chunks — each gets its own JS bundle
const Metrics    = lazy(() => import('./components/Metrics'))
const Services   = lazy(() => import('./components/Services'))
const Work       = lazy(() => import('./components/Work'))
const About      = lazy(() => import('./components/About'))
const Principles = lazy(() => import('./components/Principles'))
const Contact    = lazy(() => import('./components/Contact'))
const Footer     = lazy(() => import('./components/Footer'))

function LazySection({ children, delay = 0, skeletonRows = 3 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <Suspense fallback={<SectionSkeleton rows={skeletonRows} />}>
        {children}
      </Suspense>
    </motion.div>
  )
}

export default function App() {
  const [appReady, setAppReady] = useState(false)

  return (
    <>
      {/* Global starfield — fixed, behind everything, cursor spotlight included */}
      <Starfield fixed />

      <PageLoader onDone={() => setAppReady(true)} />

      <AnimatePresence>
        {appReady && (
          <motion.div
            key="app"
            className="app-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Nav />

            <main>
              {/* Hero: transparent bg so fixed starfield shows through */}
              <Hero />

              <LazySection delay={0.08} skeletonRows={4}>
                <Metrics />
              </LazySection>

              <LazySection delay={0.20} skeletonRows={4}>
                <Services />
              </LazySection>

              <LazySection delay={0.28} skeletonRows={5}>
                <Work />
              </LazySection>

              <LazySection delay={0.36} skeletonRows={4}>
                <About />
              </LazySection>

              <LazySection delay={0.44} skeletonRows={4}>
                <Principles />
              </LazySection>

              <LazySection delay={0.52} skeletonRows={3}>
                <Contact />
              </LazySection>
            </main>

            <LazySection delay={0.58} skeletonRows={1}>
              <Footer />
            </LazySection>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
