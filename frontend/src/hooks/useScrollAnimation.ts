'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
}

/**
 * Hook to trigger animations when elements enter viewport
 * Usage: const { ref, isVisible } = useScrollAnimation()
 *        <div ref={ref} className={isVisible ? 'animate-fade-in-up' : 'opacity-0'}>
 */
export function useScrollAnimation(
  options: UseScrollAnimationOptions = { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const optionsRef = useRef(options)

  useEffect(() => {
    const { threshold = 0.1, rootMargin = '0px 0px -80px 0px' } = optionsRef.current
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        // Once visible, we stop observing to avoid re-animations
        observer.unobserve(entry.target)
      }
    }, { threshold, rootMargin })

    const el = ref.current
    if (el) {
      observer.observe(el)
    }

    return () => {
      if (el) {
        observer.unobserve(el)
      }
    }
  }, [])

  return { ref, isVisible }
}

/**
 * Hook for staggered animations of multiple child elements
 * Usage: const { ref, isVisible } = useStaggeredAnimation(children.length)
 */
export function useStaggeredAnimation(childrenCount: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return { ref, isVisible }
}
