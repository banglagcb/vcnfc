import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface VideoShowcaseProps {
  videoUrl: string
  title: string
  description: string
}

export function VideoShowcase({ videoUrl, title, description }: VideoShowcaseProps) {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
            <iframe
              src={videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8">{description}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="NFC Card 1"
                width={200}
                height={200}
                className="rounded-lg object-cover shadow-md"
              />
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="NFC Card 2"
                width={200}
                height={200}
                className="rounded-lg object-cover shadow-md"
              />
            </div>
            <Link href="/products">
              <Button className="bg-orange-500 hover:bg-orange-600 transition-colors duration-200">
                Explore Cards
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
