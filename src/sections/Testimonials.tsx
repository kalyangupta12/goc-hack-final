"use client"

import avatar1 from "@/assets/avatar-1.png"
import avatar2 from "@/assets/avatar-2.png"
import avatar3 from "@/assets/avatar-3.png"
import avatar4 from "@/assets/avatar-4.png"
import Image from "next/image"
import { motion } from "framer-motion"

const testimonials = [
  {
    text: "“This platform has completely transformed how I manage my projects and keep up with deadlines.”",
    name: "Sophia Perez",
    title: "Director @ Quantum Innovations",
    avatarImg: avatar1,
  },
  {
    text: "“Our SEO strategy was revolutionized almost overnight, thanks to these powerful AI-driven tools.”",
    name: "Jamie Lee",
    title: "Founder @ Pulse Analytics",
    avatarImg: avatar2,
  },
  {
    text: "“An incredibly intuitive interface that’s saved us hours each week—we can’t imagine working without it.”",
    name: "Alisa Hester",
    title: "Product Manager @ InnovateX",
    avatarImg: avatar3,
  },
  {
    text: "“Since adopting this solution, our team's productivity has surged beyond expectations.”",
    name: "Alec Whitten",
    title: "CTO @ TechSolutions Inc.",
    avatarImg: avatar4,
  },
]

export const Testimonials = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <h2 className="text-5xl text-center lg:text-7xl font-semibold tracking-tighter">
          Real Results, Real Experiences
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto text-center pt-5 text-lg md:text-xl tracking-tight">
          Discover how our solutions are helping teams achieve more, faster, and with ease.
        </p>
        <div className="flex overflow-hidden mt-10 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
          <motion.div
            initial={{ translateX: "-50%" }}
            animate={{ translateX: "0" }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
            className="flex gap-5 flex-none -translate-x-1/2 pr-5"
          >
            {/* creating an array and spreading testimonial so that it can loop basically to map testimonial twice */}
            {[...testimonials, ...testimonials].map((testimonial) => (
              <div
                key={testimonial.name}
                // flex-none esure that flex property is not determining the dimention of the element, and it is determined by whatever the explicit declaration is
                className="border border-white/15 p-6 md:p-10 lg:p-12 rounded-xl bg-[linear-gradient(to_bottom_left,rgb(140,69,255,.3),black)] max-w-xs md:max-w-md lg:max-w-lg mx-auto flex-none"
              >
                <div className="text-xl tracking-tight">{testimonial.text}</div>
                <div className="flex items-center gap-3 mt-5">
                  <Image
                    src={testimonial.avatarImg}
                    alt={`Avatar of ${testimonial.name}`}
                    className="rounded-xl h-11 w-11 grayscale border border-white/80"
                  />

                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="font-light">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}