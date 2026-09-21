"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

type RevealProps = {
  children: React.ReactNode
  /** Stagger index. Each step adds 60ms. */
  index?: number
  /** Vertical travel in px. */
  distance?: number
  className?: string
}

/**
 * Scroll-reveal leaf. MOTION_INTENSITY 4: entry only, no pinning, no scrub.
 * Collapses to a plain static render under prefers-reduced-motion.
 */
export function Reveal({
  children,
  index = 0,
  distance = 20,
  className,
}: RevealProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: reduce ? 0 : index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Hero entry cascade. Communicates hierarchy: headline, then value, then action.
 * Runs on mount rather than on scroll, because the hero is already in view.
 */
export function HeroStagger({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode
  index?: number
  className?: string
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: reduce ? 0 : 0.06 + index * 0.09,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
