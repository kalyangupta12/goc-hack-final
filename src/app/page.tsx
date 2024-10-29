import { CallToAction } from "@/sections/CallToAction"
import { FAQ } from "@/sections/faq"
import { Features } from "@/sections/Features"
import { Footer2 } from "@/sections/footer2"
import { Header } from "@/sections/Header"
import { Hero } from "@/sections/Hero"
import { Guide } from "@/sections/howitworks"
import { LogoTicker } from "@/sections/LogoTicker"
import { Testimonials } from "@/sections/Testimonials"

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <LogoTicker />
      <Features />
      <Guide />
      <Testimonials />
      <FAQ />
      <CallToAction />
      <Footer2 />
    </>
  )
}
