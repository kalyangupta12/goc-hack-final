"use client"

import React, { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Copy, Share2, QrCode } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"

export const TestShareCard = ({ testLink, testCode }) => {
  const [showQR, setShowQR] = useState(false)

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy text")
    }
  }

  const shareTest = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Take my test",
          text: "Here is your test link",
          url: testLink,
        })
        toast.success("Shared successfully!")
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Error sharing test")
        }
      }
    } else {
      copyToClipboard(testLink)
    }
  }

  return (
    <Card className="w-full  mt-6  max-w-3xl mx-auto backdrop-blur-xl bg-gray-900/40 p-8 rounded-2xl shadow-2xl border border-purple-500/10 mb-6 text-white ">
      <CardHeader>
        <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent text-center mb-2">
          Share Test
        </CardTitle>
        <CardDescription className="text-gray-400 text-center">
          Share your test using any of these methods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Link Section */}
        <div className="space-y-2">
          <label className="text-purple-200 text-lg font-semibold">
            Test Link
          </label>
          <div className="flex gap-2">
            <Input
              value={testLink}
              readOnly
              className="w-full p-3 bg-gray-800/50 border border-purple-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100"
            />
            <Button
              onClick={() => copyToClipboard(testLink)}
              variant="outline"
              size="icon"
              className="text-gray-800 border-gray-600 hover:bg-gray-200"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Test Code Section */}
        <div className="space-y-2">
          <label className="text-purple-200 text-lg font-semibold">
            Test Code
          </label>
          <div className="flex gap-2">
            <Input
              value={testCode}
              readOnly
              className="w-full p-3 bg-gray-800/50 border border-purple-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100"
            />
            <Button
              onClick={() => copyToClipboard(testCode)}
              variant="outline"
              size="icon"
              className="text-gray-800 border-gray-600 hover:bg-gray-200"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-center mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex gap-2 text-gray-900 border-gray-600 hover:bg-gray-200 px-2"
              >
                <QrCode className="h-4 w-4" />
                Show QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>Test QR Code</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center p-4">
                <QRCodeSVG
                  value={testLink}
                  size={256}
                  level="H"
                  includeMargin={true}
                  className="w-full max-w-[256px]"
                />
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={shareTest}
            variant="default"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-purple-900/50 transition-all duration-200 transform hover:scale-105"
          >
            <Share2 className="h-4 w-4" />
            Share Test
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
