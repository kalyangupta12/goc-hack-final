"use client"
import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { IconPlus } from "@tabler/icons-react"

const tabs = [
  {
    title: "How does Excelitest streamline test automation?",
    description:
      "Excelitest automates repetitive test cases, reducing manual effort and increasing testing efficiency across projects, helping teams deploy faster and with more confidence.",
    imageUrl:
      "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
  },
  {
    title: "What are the integration options with Excelitest?",
    description:
      "Excelitest integrates seamlessly with popular CI/CD tools, version control systems, and reporting platforms, making it easy to incorporate automated testing into your existing workflow.",
    imageUrl:
      "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format",
  },
  {
    title: "How can I ensure effective test coverage with Excelitest?",
    description:
      "With Excelitest, you can create comprehensive test suites that cover a wide range of scenarios, ensuring high coverage and thorough validation of application functionality.",
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
        Find answers to common questions about using Excelitest for your test automation needs.
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