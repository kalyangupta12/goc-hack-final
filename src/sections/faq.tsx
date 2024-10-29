"use client"
import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { IconPlus } from "@tabler/icons-react"

const tabs = [
  {
    title:
      "Data add kardo bhai log mera daat ka root canal aur anal dono ho gya hai",
    description:
      "UI components can improve UX by providing familiar, consistent interactions that make it easy for users to navigate and interact with an application.",
    imageUrl:
      "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  },
  {
    title: "Common UI component design challenges?",
    description:
      "Some common challenges include maintaining consistency across different devices and screen sizes, ensuring compatibility with various browsers and assistive technologies, and balancing flexibility with ease of use.",
    imageUrl:
      "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format",
  },
  {
    title: "Ensuring UI component responsiveness?",
    description:
      "     Developers can ensure the responsiveness of UI components by using techniques such as fluid layouts, flexible grids, and media queries to adapt the components to different screen sizes and orientations.",
    imageUrl:
      "https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format",
  },
]
export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)
  const [activeItem, setActiveItem] = useState<
    | {
        title: string
        description: string
        imageUrl: string
      }
    | undefined
  >(tabs[0])

  const handleClick = async (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
    const newActiveItem = tabs.find((_, i) => i === index)
    setActiveItem(newActiveItem)
  }

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <h2 className="text-5xl text-center lg:text-7xl font-semibold tracking-tighter">
          F A Q
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto text-center pt-5 text-lg md:text-xl tracking-tight">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis,
          maiores! Sunt odit dicta ea.
        </p>
        <div className="h-fit mt-20 border-2 border-zinc-800 rounded-lg p-2  ">
          {tabs.map((tab, index) => (
            <motion.div
              key={index}
              className={`overflow-hidden border-white/30 ${
                index !== tabs.length - 1 ? "border-b" : ""
              }`}
              onClick={() => handleClick(index)}
            >
              <button
                className={`p-8 px-2 w-full cursor-pointer sm:text-base text-sm items-center transition-all font-semibold dark:text-white flex gap-2 
               `}
              >
                <IconPlus
                  className={`${
                    activeIndex === index ? "rotate-45" : "rotate-0 "
                  } transition-transform ease-in-out w-5 h-5  dark:text-gray-200 text-gray-600`}
                />
                {tab.title}
              </button>
              <AnimatePresence mode="sync">
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                      delay: 0.14,
                    }}
                  >
                    <p
                      className={`dark:text-white/70  p-8 xl:text-base sm:text-md text-lg pt-0 w-[90%]`}
                    >
                      {tab.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
