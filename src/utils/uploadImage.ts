import api from "./api"

export interface UploadImageResponse {
  message: string
  url: string
  fileName: string
}

export const uploadImage = async (uri: string): Promise<UploadImageResponse> => {
  const formData = new FormData()

  const filename = uri.split("/").pop() || "image.jpg"
  const match = /\.(\w+)$/.exec(filename)
  const type = match ? `image/${match[1]}` : "image/jpeg"

  formData.append("image", {
    uri,
    name: filename,
    type,
  } as any)

  const response = await api.post<UploadImageResponse>("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}