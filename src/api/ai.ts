import axios from "axios";
import { Platform } from "react-native";

const API_BASE_URL = "http://viewlulu.site:3000";

export const searchCosmeticByImage = async (imageUri: string) => {
  const formData = new FormData();

  formData.append("file", {
    uri:
      Platform.OS === "android"
        ? imageUri
        : imageUri.replace("file://", ""),
    name: "photo.jpg",
    type: "image/jpeg",
  } as any);

  const res = await axios.post(
    `${API_BASE_URL}/ai/search`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 20000,
    }
  );

  return res.data;
};
