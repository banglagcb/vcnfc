"use client"

import { useEffect } from "react"

export function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadResources = () => {
      const criticalImages = ["/images/hero-phones.png", "/images/hero-screenshot.png"]

      criticalImages.forEach((src) => {
        const link = document.createElement("link")
        link.rel = "preload"
        link.as = "image"
        link.href = src
        document.head.appendChild(link)
      })
    }

    // Lazy load images
    const lazyLoadImages = () => {
      const images = document.querySelectorAll("img[data-src]")
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.src || ""
            img.removeAttribute("data-src")
            imageObserver.unobserve(img)
          }
        })
      })

      images.forEach((img) => imageObserver.observe(img))
    }

    // Optimize fonts
    const optimizeFonts = () => {
      const link = document.createElement("link")
      link.rel = "preconnect"
      link.href = "https://fonts.googleapis.com"
      document.head.appendChild(link)

      const link2 = document.createElement("link")
      link2.rel = "preconnect"
      link2.href = "https://fonts.gstatic.com"
      link2.crossOrigin = "anonymous"
      document.head.appendChild(link2)
    }

    // Initialize optimizations
    preloadResources()
    lazyLoadImages()
    optimizeFonts()

    // Cleanup function
    return () => {
      // Remove any event listeners or observers if needed
    }
  }, [])

  return null
}
