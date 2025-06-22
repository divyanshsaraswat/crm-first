"use client"
import { useState,useRef,useEffect } from "react"
function FloatingElement({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      className="animate-float"
      style={{
        animationDelay: `${delay}s`,
        animation: `float 6s ease-in-out infinite ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
export default function ParallaxOut(){
    return(
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingElement delay={0}>
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement delay={2}>
          <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement delay={4}>
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400/10 to-emerald-400/10 rounded-full blur-xl" />
        </FloatingElement>
      </div>
    )
}
