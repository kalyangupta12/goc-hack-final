import toast from "react-hot-toast"
import { useUser, UserButton } from "@clerk/nextjs"
export const ToastNotification = () => {
  const { user } = useUser()
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-3xl w-[300px] bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <UserButton />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-black">{`${user?.firstName}`}</p>
            <p className="mt-1 text-sm text-zinc-900">
              Test Created Successfully
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200"></div>
    </div>
  ))
}
