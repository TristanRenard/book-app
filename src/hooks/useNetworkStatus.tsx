import NetInfo from "@react-native-community/netinfo"
import { useEffect, useState } from "react"

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true)
  const [isInternetReachable, setIsInternetReachable] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false)
      setIsInternetReachable(state.isInternetReachable ?? false)
    })

    return () => unsubscribe()
  }, [])

  const isOnline = isConnected && isInternetReachable

  return { isOnline, isConnected, isInternetReachable }
}