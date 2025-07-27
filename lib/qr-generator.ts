export interface QRCodeOptions {
  text: string
  size?: number
  backgroundColor?: string
  foregroundColor?: string
  logo?: string
  logoSize?: number
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"
  margin?: number
  style?: "square" | "rounded" | "dots"
}

export interface ProfileData {
  name: string
  title?: string
  company?: string
  phone?: string
  email?: string
  website?: string
  address?: string
  bio?: string
  socialLinks?: {
    [key: string]: string
  }
}

export class QRCodeGenerator {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.createElement("canvas")
    this.ctx = this.canvas.getContext("2d")!
  }

  async generateQRCode(options: QRCodeOptions): Promise<string> {
    const {
      text,
      size = 256,
      backgroundColor = "#ffffff",
      foregroundColor = "#000000",
      logo,
      logoSize = 40,
      errorCorrectionLevel = "M",
      margin = 4,
      style = "square",
    } = options

    // Set canvas size
    this.canvas.width = size
    this.canvas.height = size

    // Clear canvas
    this.ctx.fillStyle = backgroundColor
    this.ctx.fillRect(0, 0, size, size)

    try {
      // Generate QR code matrix using a simple algorithm
      const qrMatrix = this.generateQRMatrix(text, errorCorrectionLevel)
      const moduleSize = (size - margin * 2) / qrMatrix.length

      // Draw QR code
      this.ctx.fillStyle = foregroundColor

      for (let row = 0; row < qrMatrix.length; row++) {
        for (let col = 0; col < qrMatrix[row].length; col++) {
          if (qrMatrix[row][col]) {
            const x = margin + col * moduleSize
            const y = margin + row * moduleSize

            switch (style) {
              case "rounded":
                this.drawRoundedRect(x, y, moduleSize, moduleSize, moduleSize * 0.2)
                break
              case "dots":
                this.drawCircle(x + moduleSize / 2, y + moduleSize / 2, moduleSize * 0.4)
                break
              default:
                this.ctx.fillRect(x, y, moduleSize, moduleSize)
            }
          }
        }
      }

      // Add logo if provided
      if (logo) {
        await this.addLogo(logo, logoSize, size)
      }

      return this.canvas.toDataURL("image/png")
    } catch (error) {
      console.error("Error generating QR code:", error)
      throw new Error("Failed to generate QR code")
    }
  }

  private generateQRMatrix(text: string, errorLevel: string): boolean[][] {
    // This is a simplified QR code generation
    // In a real implementation, you would use a proper QR code library
    const size = 25 // Standard QR code size for demo
    const matrix: boolean[][] = []

    // Initialize matrix
    for (let i = 0; i < size; i++) {
      matrix[i] = new Array(size).fill(false)
    }

    // Add finder patterns (corners)
    this.addFinderPattern(matrix, 0, 0)
    this.addFinderPattern(matrix, size - 7, 0)
    this.addFinderPattern(matrix, 0, size - 7)

    // Add timing patterns
    for (let i = 8; i < size - 8; i++) {
      matrix[6][i] = i % 2 === 0
      matrix[i][6] = i % 2 === 0
    }

    // Add data (simplified - just create a pattern based on text)
    const textHash = this.simpleHash(text)
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!this.isReservedArea(row, col, size)) {
          matrix[row][col] = (textHash + row + col) % 3 === 0
        }
      }
    }

    return matrix
  }

  private addFinderPattern(matrix: boolean[][], startRow: number, startCol: number) {
    const pattern = [
      [true, true, true, true, true, true, true],
      [true, false, false, false, false, false, true],
      [true, false, true, true, true, false, true],
      [true, false, true, true, true, false, true],
      [true, false, true, true, true, false, true],
      [true, false, false, false, false, false, true],
      [true, true, true, true, true, true, true],
    ]

    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 7; col++) {
        if (startRow + row < matrix.length && startCol + col < matrix[0].length) {
          matrix[startRow + row][startCol + col] = pattern[row][col]
        }
      }
    }
  }

  private isReservedArea(row: number, col: number, size: number): boolean {
    // Check if position is in finder patterns
    if ((row < 9 && col < 9) || (row < 9 && col >= size - 8) || (row >= size - 8 && col < 9)) {
      return true
    }

    // Check if position is in timing patterns
    if (row === 6 || col === 6) {
      return true
    }

    return false
  }

  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
    this.ctx.beginPath()
    this.ctx.moveTo(x + radius, y)
    this.ctx.lineTo(x + width - radius, y)
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    this.ctx.lineTo(x + width, y + height - radius)
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    this.ctx.lineTo(x + radius, y + height)
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    this.ctx.lineTo(x, y + radius)
    this.ctx.quadraticCurveTo(x, y, x + radius, y)
    this.ctx.closePath()
    this.ctx.fill()
  }

  private drawCircle(x: number, y: number, radius: number) {
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
    this.ctx.fill()
  }

  private async addLogo(logoUrl: string, logoSize: number, canvasSize: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const logoX = (canvasSize - logoSize) / 2
        const logoY = (canvasSize - logoSize) / 2

        // Draw white background for logo
        this.ctx.fillStyle = "#ffffff"
        this.ctx.fillRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8)

        // Draw logo
        this.ctx.drawImage(img, logoX, logoY, logoSize, logoSize)
        resolve()
      }
      img.onerror = () => reject(new Error("Failed to load logo"))
      img.src = logoUrl
    })
  }

  downloadQRCode(dataUrl: string, filename = "qrcode.png") {
    const link = document.createElement("a")
    link.download = filename
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Export singleton instance
export const qrGenerator = new QRCodeGenerator()

// Generate vCard format
export function generateVCard(profile: ProfileData): string {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.name}`,
    profile.title ? `TITLE:${profile.title}` : "",
    profile.company ? `ORG:${profile.company}` : "",
    profile.phone ? `TEL:${profile.phone}` : "",
    profile.email ? `EMAIL:${profile.email}` : "",
    profile.website ? `URL:${profile.website}` : "",
    profile.address ? `ADR:;;${profile.address};;;;` : "",
    profile.bio ? `NOTE:${profile.bio}` : "",
    "END:VCARD",
  ]
    .filter((line) => line !== "")
    .join("\n")

  return vcard
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
    title: `${profile.name} - ${profile.title || "প্রোফাইল"}`,
    text: profile.bio || `${profile.name} এর সাথে যোগাযোগ করুন`,
    url: profileUrl,
  }

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
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
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("প্রোফাইল লিংক কপি হয়েছে!")
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = url
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        alert("প্রোফাইল লিংক কপি হয়েছে!")
      })
  }
}
