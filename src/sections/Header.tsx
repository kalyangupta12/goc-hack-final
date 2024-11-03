import MenuIcon from "@/assets/icon-menu.svg"
import {
  AttendButton,
  CreateButton,
  GetStartedButton,
} from "@/components/button"
import Logo from "@/assets/logo-w.png"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export const Header = async () => {
  const { userId } = await auth()

  // Redirect to sign-in if trying to access protected routes without auth
  const handleProtectedRoute = (path: string) => {
    if (!userId) {
      redirect("/sign-in")
    }
    return path
  }

  return (
    <header className="py-4 border-b border-white/15 md:border-none sticky top-0 z-10">
      <div className="absolute inset-0 backdrop-blur -z-10 md:hidden"></div>
      <div className="container">
        <div className="flex justify-between items-center md:border rounded-lg border-white/15 md:py-2.5 md:px-5 max-w-2xl mx-auto relative">
          <div className="hidden md:block absolute inset-0 backdrop-blur -z-10"></div>
          <div>
            <div className="border h-10 w-28 rounded-xl border-white/15 inline-flex justify-center items-center px-2 mr-10">
              <img src={Logo.src} alt="Logo" />
            </div>
          </div>

          {userId ? (
            <div className="flex gap-x-4">
              <div className=" items-center hidden md:block">
                <Link href={handleProtectedRoute("/attempt-test/testcode")}>
                  <AttendButton />
                </Link>
              </div>
              <div className="items-center hidden md:block">
                <Link href={handleProtectedRoute("/upload-handler-3")}>
                  <CreateButton />
                </Link>
              </div>

              <div className="flex ">
                <UserButton afterSignOutUrl="/" />
              </div>
              <div className="block md:hidden">
                <MenuIcon />
              </div>
            </div>
          ) : (
            <div>
              <Link href="/sign-up">
                <GetStartedButton />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
