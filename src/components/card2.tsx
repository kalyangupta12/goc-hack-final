import React, { useState } from "react"
import Image from "next/image"
import { IconChevronRight } from "@tabler/icons-react"

import Card from "@/assets/tits.jpg"

export const StripeCard = () => {
  return (
    <>
      <div className="w-[90%]] h-[440px] group mx-auto bg-[#252525] p-2  border-black overflow-hidden rounded-md dark:text-white ">
        <figure className="w-full h-72 group-hover:h-72 transition-all duration-300 dark:bg-[#0a121a] bg-[#3c1c78] p-2 rounded-md relative overflow-hidden">
          <div
            style={{
              background:
                "linear-gradient(123.9deg, #401c73 1.52%, rgba(0, 0, 0, 0) 68.91%)",
            }}
            className="absolute top-0 left-0 w-full h-full  group-hover:opacity-100 opacity-0  transition-all duration-300"
          ></div>
          <img
            src={Card.src}
            alt="shoes"
            width={500}
            height={500}
            className="absolute -bottom-1 group-hover:-bottom-5 right-0 h-64 w-[80%] group-hover:border-4 border-4 group-hover:border-[#76aaf82d] rounded-lg object-cover transition-all duration-300"
          />
        </figure>
        <article className="  p-4 space-y-2">
          <h1 className="text-xl font-semibold capitalize">
            Incorporate your company
          </h1>
          <p className="text-base leading-[120%]">
            Form a legal entity, issue stock, and start accepting payments.
          </p>
          <a
            href="#"
            className=" text-base dark:text-white text-blue-600 font-normal  group-hover:opacity-100 opacity-0 translate-y-2 group-hover:translate-y-0 pt-2 flex gap-1  transition-all duration-300  "
          >
            Learn about Atlas
            <span>
              <IconChevronRight />
            </span>
          </a>
        </article>
      </div>
    </>
  )
}
