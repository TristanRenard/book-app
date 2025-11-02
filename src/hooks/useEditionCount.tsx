import type { Book } from "@/src/types/Book"
import openLibrary from "@/src/utils/openLibrary"
import { useQuery } from "@tanstack/react-query"

interface OpenLibrarySearchDoc {
  edition_count?: number
  title: string
  author_name?: string[]
}

interface OpenLibrarySearchResponse {
  docs: OpenLibrarySearchDoc[]
  numFound: number
}

const fetchEditionCount = async (book: Book): Promise<number> => {
  try {
    const response = await openLibrary.get<OpenLibrarySearchResponse>(
      `/search.json?title=${encodeURIComponent(book.name)}&author=${encodeURIComponent(book.author)}`
    )

    if (response.data.docs.length > 0) {
      return response.data.docs[0].edition_count || 0
    }

    return 0
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre d'éditions:", error)
    return 0
  }
}

export const useEditionCount = (book: Book | undefined, enabled = true) => {
  return useQuery({
    queryKey: ["editionCount", book?.id],
    queryFn: () => fetchEditionCount(book!),
    enabled: enabled && !!book,
    staleTime: 1000 * 60 * 60 * 24, // 24 heures
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 jours
  })
}