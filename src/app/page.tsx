import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { InteractiveBackground } from '@/components/landing/InteractiveBackground'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-void selection:bg-stellar/30 cursor-crosshair">
      <InteractiveBackground />
      <Navbar />
      <Hero />
    </main>
  )
}
