import { ButtonCTA } from "@/components/button2"
import { StripeCard } from "@/components/card2"
import { Cards } from "@/components/cards"

export const Guide = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <h2 className="text-5xl text-center lg:text-7xl font-semibold tracking-tighter">
          Beyound Expections.
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto text-center pt-5 text-lg md:text-xl tracking-tight">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis,
          maiores! Sunt odit dicta ea.
        </p>
        <div className="flex pt-20 gap-4 justify-center max-w-5xl mx-auto">
          <div>
            <Cards />
            <div className="py-8">
              <ButtonCTA />
            </div>
          </div>
          <div>
            <StripeCard />
          </div>
        </div>
        <p className="text-white/70 max-w-2xl mx-auto text-center pt-5 text-lg md:text-xl tracking-tight">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla, enim
          recusandae pariatur aliquam error reprehenderit expedita similique
          corrupti laboriosam saepe dolorum nostrum natus ut rem dolores. Minus
          laboriosam ipsam corporis?
        </p>
      </div>
    </section>
  )
}
