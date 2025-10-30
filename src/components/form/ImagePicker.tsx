import api from "@/src/utils/api"
import { Feather } from "@expo/vector-icons"
import { Image } from "expo-image"
import * as ImageManipulator from "expo-image-manipulator"
import * as ImagePicker from "expo-image-picker"
import { useState } from "react"
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native"

interface ImagePickerComponentProps {
  currentImageUrl?: string
  onImageSelected: (url: string) => void
  onUploadStart?: () => void
  onUploadEnd?: () => void
}

interface UploadResponse {
  message: string
  url: string
  fileName: string
}

const ImagePickerComponent = ({
  currentImageUrl,
  onImageSelected,
  onUploadStart,
  onUploadEnd,
}: ImagePickerComponentProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUri, setPreviewUri] = useState<string | undefined>(currentImageUrl)

  const cropImageToRatio = async (uri: string): Promise<string> => {
    if (Platform.OS === "web") {
      return uri
    }

    try {
      const imageInfo = await ImageManipulator.manipulateAsync(uri, [], { format: ImageManipulator.SaveFormat.JPEG })

      const { width, height } = imageInfo
      const targetRatio = 5 / 8
      const currentRatio = width / height

      let cropWidth: number
      let cropHeight: number
      let originX = 0
      let originY = 0

      if (currentRatio > targetRatio) {
        cropHeight = height
        cropWidth = height * targetRatio
        originX = (width - cropWidth) / 2
      } else {
        cropWidth = width
        cropHeight = width / targetRatio
        originY = (height - cropHeight) / 2
      }

      const croppedImage = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            crop: {
              originX,
              originY,
              width: cropWidth,
              height: cropHeight,
            },
          },
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      )

      return croppedImage.uri
    } catch (error) {
      console.error("Erreur lors du crop:", error)
      return uri
    }
  }

  const pickImageWeb = async () => {
    return new Promise<string | null>((resolve) => {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"

      input.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]

        if (file) {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.onerror = () => {
            resolve(null)
          }
          reader.readAsDataURL(file)
        } else {
          resolve(null)
        }
      }

      input.click()
    })
  }

  const pickImage = async () => {
    if (Platform.OS === "web") {
      const dataUrl = await pickImageWeb()
      if (dataUrl) {
        setPreviewUri(dataUrl)
        await uploadImage(dataUrl)
      }
      return
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Nous avons besoin de votre permission pour accéder à vos photos"
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    })

    if (!result.canceled && result.assets[0]) {
      const croppedUri = await cropImageToRatio(result.assets[0].uri)
      setPreviewUri(croppedUri)
      await uploadImage(croppedUri)
    }
  }

  const takePhoto = async () => {
    if (Platform.OS === "web") {
      Alert.alert(
        "Non disponible",
        "La capture photo n'est pas disponible sur le web. Utilisez 'Choisir depuis la galerie'."
      )
      return
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Nous avons besoin de votre permission pour accéder à votre caméra"
      )
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [5, 8],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri
      setPreviewUri(imageUri)
      await uploadImage(imageUri)
    }
  }

  const dataURLtoBlob = (dataUrl: string): Blob => {
    const arr = dataUrl.split(",")
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg"
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new Blob([u8arr], { type: mime })
  }

  const uploadImage = async (uri: string) => {
    setIsUploading(true)
    onUploadStart?.()

    try {
      const formData = new FormData()

      if (Platform.OS === "web") {
        const blob = dataURLtoBlob(uri)
        const filename = `image-${Date.now()}.jpg`
        formData.append("image", blob, filename)
      } else {
        const filename = uri.split("/").pop() || "image.jpg"
        const match = /\.(\w+)$/.exec(filename)
        const type = match ? `image/${match[1]}` : "image/jpeg"

        formData.append("image", {
          uri,
          name: filename,
          type,
        } as any)
      }

      console.log("📤 Upload de l'image")

      const response = await api.post<UploadResponse>("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("✅ Upload réussi:", response.data.url)

      if (response.data.url) {
        onImageSelected(response.data.url)
        Alert.alert("Succès", "Image uploadée avec succès")
      } else {
        throw new Error("URL manquante dans la réponse")
      }
    } catch (error: any) {
      console.error("❌ Erreur lors de l'upload:", error)

      if (error.response) {
        console.error("Response status:", error.response.status)
        console.error("Response data:", error.response.data)
      }

      Alert.alert(
        "Erreur",
        error.response?.data?.message || error.message || "Impossible d'uploader l'image"
      )
      setPreviewUri(currentImageUrl)
    } finally {
      setIsUploading(false)
      onUploadEnd?.()
    }
  }

  const showImageOptions = () => {
    if (Platform.OS === "web") {
      pickImage()
      return
    }

    Alert.alert(
      "Choisir une image",
      "Sélectionnez une source",
      [
        {
          text: "Prendre une photo",
          onPress: takePhoto,
        },
        {
          text: "Choisir depuis la galerie",
          onPress: pickImage,
        },
        {
          text: "Annuler",
          style: "cancel",
        },
      ]
    )
  }

  return (
    <Pressable
      style={styles.container}
      onPress={showImageOptions}
      disabled={isUploading}
    >
      {previewUri ? (
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: previewUri }}
            contentFit="cover"
          />
          {isUploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.uploadingText}>Upload en cours...</Text>
            </View>
          )}
          {!isUploading && (
            <View style={styles.editBadge}>
              <Feather name="edit-2" size={16} color="#fff" />
            </View>
          )}
        </View>
      ) : (
        <View style={styles.placeholder}>
          {isUploading ? (
            <>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.placeholderText}>Upload en cours...</Text>
            </>
          ) : (
            <>
              <Feather name="image" size={48} color="#ccc" />
              <Text style={styles.placeholderText}>Ajouter une couverture</Text>
              <Text style={styles.placeholderHint}>
                {Platform.OS === "web"
                  ? "Cliquez pour choisir une image"
                  : "Touchez pour choisir une image"}
              </Text>
            </>
          )}
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 5 / 8,
    maxHeight: 400,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  uploadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  editBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "#007AFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  placeholderHint: {
    fontSize: 14,
    color: "#999",
  },
})

export default ImagePickerComponent