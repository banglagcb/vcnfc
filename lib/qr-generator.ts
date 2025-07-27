export interface QRCodeOptions {
  size?: number
  color?: string
  backgroundColor?: string
  margin?: number
}

export interface ProfileData {
  name: string
  title?: string
  company?: string
  phone?: string
  email?: string
  website?: string
  bio?: string
  address?: string
  socialLinks?: {
    [key: string]: string
  }
}

// QR Code generation using canvas
export function generateQRCode(text: string, options: QRCodeOptions = {}): string {
  const { size = 256, color = "#000000", backgroundColor = "#ffffff", margin = 4 } = options

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) return ""

  canvas.width = size
  canvas.height = size

  // Fill background
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, size, size)

  // Simple QR-like pattern generation
  const moduleSize = Math.floor((size - margin * 2) / 25)
  const startX = margin
  const startY = margin

  ctx.fillStyle = color

  // Generate a simple pattern based on text hash
  const hash = simpleHash(text)

  for (let row = 0; row < 25; row++) {
    for (let col = 0; col < 25; col++) {
      const shouldFill = shouldFillModule(row, col, hash)
      if (shouldFill) {
        ctx.fillRect(startX + col * moduleSize, startY + row * moduleSize, moduleSize, moduleSize)
      }
    }
  }

  // Add finder patterns (corner squares)
  drawFinderPattern(ctx, startX, startY, moduleSize)
  drawFinderPattern(ctx, startX + 18 * moduleSize, startY, moduleSize)
  drawFinderPattern(ctx, startX, startY + 18 * moduleSize, moduleSize)

  return canvas.toDataURL("image/png")
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

function shouldFillModule(row: number, col: number, hash: number): boolean {
  // Skip finder pattern areas
  if ((row < 7 && col < 7) || (row < 7 && col > 17) || (row > 17 && col < 7)) {
    return false
  }

  // Create pattern based on hash
  const seed = hash + row * 25 + col
  return seed % 3 === 0
}

function drawFinderPattern(ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) {
  // Outer square (7x7)
  ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7)

  // Inner white square (5x5)
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5)

  // Center black square (3x3)
  ctx.fillStyle = "#000000"
  ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3)
}

// Generate vCard format
export function generateVCard(profile: ProfileData): string {
  let vcard = "BEGIN:VCARD\nVERSION:3.0\n"

  if (profile.name) {
    vcard += `FN:${profile.name}\n`
    vcard += `N:${profile.name};;;;\n`
  }

  if (profile.title) vcard += `TITLE:${profile.title}\n`
  if (profile.company) vcard += `ORG:${profile.company}\n`
  if (profile.phone) vcard += `TEL;TYPE=CELL:${profile.phone}\n`
  if (profile.email) vcard += `EMAIL;TYPE=INTERNET:${profile.email}\n`
  if (profile.website) vcard += `URL:${profile.website}\n`
  if (profile.address) vcard += `ADR;TYPE=WORK:;;${profile.address};;;;\n`
  if (profile.bio) vcard += `NOTE:${profile.bio}\n`

  // Add social links
  if (profile.socialLinks) {
    Object.entries(profile.socialLinks).forEach(([platform, url]) => {
      if (url) {
        vcard += `X-SOCIALPROFILE;TYPE=${platform}:${url}\n`
      }
    })
  }

  vcard += "END:VCARD"
  return vcard
}

// Download QR code as image
export function downloadQRCode(dataUrl: string, filename = "qrcode.png") {
  const link = document.createElement("a")
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Download vCard
export function downloadVCard(vcard: string, filename = "contact.vcf") {
  const blob = new Blob([vcard], { type: "text/vcard" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.download = filename
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Share profile
export async function shareProfile(profile: ProfileData, profileUrl: string) {
  const shareData = {
    title: `${profile.name} - ${profile.title || "Professional Profile"}`,
    text: profile.bio || `Connect with ${profile.name}`,
    url: profileUrl,
  }

  if (navigator.share && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
    } catch (error) {
      console.log("Error sharing:", error)
      fallbackShare(profileUrl)
    }
  } else {
    fallbackShare(profileUrl)
  }
}

function fallbackShare(url: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      alert("প্রোফাইল লিংক কপি হয়েছে!")
    })
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = url
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
    alert("প্রোফাইল লিংক কপি হয়েছে!")
  }
}
