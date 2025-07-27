import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, inquiryType } = await request.json()

    // Mock contact form submission
    // In a real app, you would save to database and send notification email
    console.log("Contact form submission:", { name, email, message, inquiryType })

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! We will get back to you within 24 hours.",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to send message" }, { status: 500 })
  }
}
