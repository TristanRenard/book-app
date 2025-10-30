import { useCallback, useState } from "react"

interface BookFormData {
  name: string
  author: string
  editor: string
  year: string
  theme: string
  cover: string
  rating: number
}

interface BookFormErrors {
  name?: string
  author?: string
  editor?: string
  year?: string
}

const useBookForm = (initialData?: Partial<BookFormData>) => {
  const [formData, setFormData] = useState<BookFormData>({
    name: initialData?.name || "",
    author: initialData?.author || "",
    editor: initialData?.editor || "",
    year: initialData?.year || "",
    theme: initialData?.theme || "",
    cover: initialData?.cover || "",
    rating: initialData?.rating || 0,
  })

  const [errors, setErrors] = useState<BookFormErrors>({})

  const updateFormData = useCallback((data: Partial<BookFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors }
      Object.keys(data).forEach((key) => {
        delete updatedErrors[key as keyof BookFormErrors]
      })
      return updatedErrors
    })
  }, [])

  const validate = useCallback((): boolean => {
    const newErrors: BookFormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Le titre est obligatoire"
    }

    if (!formData.author.trim()) {
      newErrors.author = "L'auteur est obligatoire"
    }

    if (!formData.editor.trim()) {
      newErrors.editor = "L'éditeur est obligatoire"
    }

    if (!formData.year.trim()) {
      newErrors.year = "L'année est obligatoire"
    } else {
      const yearNumber = Number.parseInt(formData.year)
      if (Number.isNaN(yearNumber) || yearNumber < 0) {
        newErrors.year = "L'année doit être un nombre valide"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const reset = useCallback(() => {
    setFormData({
      name: "",
      author: "",
      editor: "",
      year: "",
      theme: "",
      cover: "",
      rating: 0,
    })
    setErrors({})
  }, [])

  return {
    formData,
    updateFormData,
    errors,
    validate,
    reset,
  }
}

export default useBookForm