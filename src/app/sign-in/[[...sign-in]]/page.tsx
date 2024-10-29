import { SignIn } from "@clerk/nextjs"
import starsBg from "@/assets/stars.png"

export default function Page() {
  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{
        backgroundImage: `url(${starsBg.src})`,
        
      }}
    >
      <SignIn />
    </div>
  )
}
