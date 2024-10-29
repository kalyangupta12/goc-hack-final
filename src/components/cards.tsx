import Image from "next/image"
import React from "react"
import normal from "@/assets/excel.png"
import hovere from "@/assets/test.png"

export const Cards = () => {
  return (
    <>
      <section>
        <div className="group  bg-gradient-to-t from-[#242424] to-[#020202] hover:from-[#182135] hover:to-[#080808] relative before:absolute before:inset-0 before:bg-[url('/noise.gif')] before:opacity-5 rounded-2xl border-4 border-zinc-800 w-[300px] ">
          <div className="relative">
            <div className="px-6 py-5">
              <div className="group-hover:bg-blue-400 bg-white transition-all duration-500 ease-in-out w-fit px-3 rounded-full text-sm py-1 text-black group-hover:text-white mb-1">
                exclitest
              </div>
              <span className="text-lg group-hover:hidden inline-block font-semibold pt-2 text-slate-200 mb-1 transition-all duration-500 ease-in-out">
                From Excel File
              </span>
              <span className="text-lg group-hover:inline-block hidden font-semibold pt-2 text-slate-200 mb-1 transition-all duration-500 ease-in-out">
                To Test Assignment
              </span>
              <p className="text-sm text-slate-500">
                Create test directly from your Excel sheet in one upload.
              </p>
            </div>
            <div className="relative group-hover:-translate-y-2 transition-transform duration-500 ease-in-out ">
              <img
                className="group-hover:opacity-0 transition-opacity duration-500  object-cover h-full m-0 p-0"
                src={normal.src}
                width={350}
                height={240}
                alt="Card image 01"
              />
              <img
                className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity  object-cover duration-300  h-full  m-0 p-0"
                src={hovere.src}
                width={350}
                height={240}
                alt="Card image 01 displaying on hover"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
