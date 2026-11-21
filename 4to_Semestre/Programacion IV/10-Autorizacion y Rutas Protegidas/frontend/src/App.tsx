import { useEffect } from "react"
import { useAuthStore } from "@/features/auth"
import { AppRouter } from "@/routes/AppRouter"
import { Toast } from "@/shared/components/Toast"

export default function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <>
      <AppRouter />
      <Toast />
    </>
  )
}
