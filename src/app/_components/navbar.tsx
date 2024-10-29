"use client"

//assets
import Logo from "@/assets/logo-w.png"

import * as React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { IconMenu, IconX } from "@tabler/icons-react"
import { UserButton } from "@clerk/nextjs"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              <img src={Logo.src} className="w-40" />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="hover:bg-gray-700 px-3 py-2 rounded-md">
                Home
              </Link>
              <Link
                href="/about"
                className="hover:bg-gray-700 px-3 py-2 rounded-md"
              >
                About
              </Link>
              <Link
                href="/services"
                className="hover:bg-gray-700 px-3 py-2 rounded-md"
              >
                Services
              </Link>
              <Link
                href="/contact"
                className="hover:bg-gray-700 px-3 py-2 rounded-md"
              >
                <UserButton />
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <IconX className="h-6 w-6" />
              ) : (
                <IconMenu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="hover:bg-gray-700 block px-3 py-2 rounded-md"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:bg-gray-700 block px-3 py-2 rounded-md"
            >
              About
            </Link>
            <Link
              href="/services"
              className="hover:bg-gray-700 block px-3 py-2 rounded-md"
            >
              Services
            </Link>

            <UserButton />
          </div>
        </div>
      )}
    </nav>
  )
}
