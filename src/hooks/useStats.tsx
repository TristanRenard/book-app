import api from "@/src/utils/api"
import { useQuery } from "@tanstack/react-query"

export interface Stats {
  totalBooks: number
  readCount: number
  unreadCount: number
  favoritesCount: number
  averageRating: number
}

const fetchStats = async (): Promise<Stats> => {
  const response = await api.get<Stats>("/stats")
  return response.data
}

export const useStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 5,
  })
}