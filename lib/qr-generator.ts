export interface QRCodeOptions {
  size?: number
  margin?: number
  color?: string
  backgroundColor?: string
}

export function generateQRCode(data: string, options: QRCodeOptions = {}): string {
  const { size = 512, margin = 4, color = "#000000", backgroundColor = "#ffffff" } = options

  // Create a simple QR code pattern (this is a simplified version)
  // In a real implementation, you'd use a proper QR code library
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) return ""

  canvas.width = size
  canvas.height = size

  // Fill background
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, size, size)

  // Create QR pattern
  ctx.fillStyle = color
  const moduleSize = (size - margin * 2) / 25

  // Simple pattern for demonstration
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
      if ((i + j) % 3 === 0 || i === 0 || i === 24 || j === 0 || j === 24) {
        ctx.fillRect(margin + i * moduleSize, margin + j * moduleSize, moduleSize, moduleSize)
      }
    }
  }

  return canvas.toDataURL("image/png")
}

export function generateVCard(profile: any): string {
  return `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
ORG:${profile.company || ""}
TITLE:${profile.title || ""}
TEL:${profile.phone || ""}
EMAIL:${profile.email || ""}
URL:${profile.website || ""}
NOTE:${profile.bio || ""}
END:VCARD`
}

export function downloadQRCode(dataUrl: string, filename = "qr-code.png") {
  const link = document.createElement("a")
  link.download = filename
  link.href = dataUrl
  link.click()
}

export function downloadVCard(vcard: string, filename = "contact.vcf") {
  const blob = new Blob([vcard], { type: "text/vcard" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.download = filename
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}
