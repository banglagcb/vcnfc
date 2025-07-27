"use client"

import { useEffect } from "react"

export function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadResources = () => {
      const criticalImages = ["/placeholder.svg?height=500&width=400", "/placeholder.svg?height=300&width=300"]

      criticalImages.forEach((src) => {
        const link = document.createElement("link")
        link.rel = "preload"
        link.as = "image"
        link.href = src
        document.head.appendChild(link)
      })
    }

    // Lazy load non-critical resources
    const lazyLoadImages = () => {
      const images = document.querySelectorAll("img[data-lazy]")
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.lazy || ""
            img.removeAttribute("data-lazy")
            imageObserver.unobserve(img)
          }
        })
      })

      images.forEach((img) => imageObserver.observe(img))
    }

    // Service Worker for caching
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error)
    }

    preloadResources()
    lazyLoadImages()
  }, [])

  return null
}
