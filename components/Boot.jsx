
"use client"

import { useEffect, useRef } from "react"
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react"


const COLORS = ["#7868e6", "#36b9d8", "#a78bfa", "#e0e7ff", "#5271ff"]

const BAND_SIZE = 13
const START = -BAND_SIZE * 2
const END = 100 + BAND_SIZE

const revealEase = (t) => 
  t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2

  function createGradient(position) {
    const start = position - BAND_SIZE
    const end = position + BAND_SIZE
    const base = "#ffffff"

    if (start >= 100) {
      return `linear-gradient(90deg, ${base}, ${base})`

    }

    let stops = []

    if (start > 0) {
      stops.push(`${base} 0%`, `${base} ${start.toFixed(2)}%`)

    }

    COLORS.forEach((color, indx) => {
      const point = start + (indx / (COLORS.length - 1)) * BAND_SIZE * 2

      stops.push(`${color} ${point.toFixed(2)}%`)
    })

    if (end < 100) {
      stops.push(`transparent ${end.toFixed(2)}%`)
      stops.push(`transparent 100%`)
    }

    return `linear-gradient(90deg, ${stops.join(", ")})`
  }

const Logo = ({ setHasSeenBoot }) => {
    const letterSpacing = useMotionValue("10em")

    const textRef = useRef(null)

    const isVisible = useInView(textRef, { once: true, amount: 0.2 })

    const reducedMotion = useReducedMotion()
    const position = useMotionValue(START)
    const gradient = useTransform(position, createGradient)
    const opacity = useMotionValue(0)

    useEffect(() => {
      if (reducedMotion) {
        position.set(END)
        opacity.set(1)
        letterSpacing.set("0em")
        setHasSeenBoot(true)
        return
      }

      if (!isVisible) return

      const sweep = animate(position, END, {
        duration: 2.2,
        delay: 0,
        ease: "easeInOut",
      })

      const fade = animate(opacity, 1, {
        duration: 2.2,
        ease: "easeOut"
      })

      const spacing = animate(letterSpacing, "0em", {
        duration: 3,
        ease: "easeInOut"
      })

      spacing.then(() => {
        setHasSeenBoot(true)
      })



      return () => {
        sweep.stop()
        fade.stop()
        spacing.stop()
      }
    }, [isVisible, reducedMotion, position, opacity, letterSpacing])

    return (
       
        <motion.span
        ref={textRef}
        className="inline-block align-bottom leading-[100%] font-bold text-2xl "
        style={{
          transform: "translateY(-1px)",
          opacity,
          letterSpacing,
          color: "transparent",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          backgroundImage: gradient,
          backgroundSize: "100% 100%"
        }}
        >PiOS</motion.span>

      
    )
  }


export default Logo
