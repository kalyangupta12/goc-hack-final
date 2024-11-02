import { ButtonCTA } from "@/components/button2"
import { StripeCard } from "@/components/card2"
import { Cards } from "@/components/cards"
import Link from "next/link"

export const Guide = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <h2 className="text-5xl text-center lg:text-7xl font-semibold tracking-tighter">
          Exceeding Expectations
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto text-center pt-5 text-lg md:text-xl tracking-tight">
          Discover innovative solutions that redefine possibilities, crafted to
          drive impactful change in every industry.
        </p>
        <div className="flex pt-20 gap-4 justify-center max-w-5xl mx-auto flex-col md:flex-row">
          <div>
            <Cards />
            <Link href={"/upload-handler-3"}>
              <div className="py-8">
                <ButtonCTA />
              </div>
            </Link>
          </div>
          <div>
            <StripeCard />
          </div>
        </div>
        <p className="text-white/70 max-w-2xl mx-auto text-center pt-5 text-lg md:text-xl tracking-tight">
          Join us in the journey to excellence—delivering robust solutions with
          reliability and unparalleled support for growth.
        </p>
      </div>
    </section>
  )
}
