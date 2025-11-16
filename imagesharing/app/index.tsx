import { Alert, Button, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import axios from "axios";
import constant from "expo-constants";

export default function Index() {
  const backendUrl = constant.expoConfig?.extra?.BackendUrl;

  const [media, setMedia] = useState<any | null>(null);
  const imagePickerHandler = async () => {
    const res: any = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
    });

    console.log(res);

    if (res.canceled || !res.assets || res.assets.length === 0) {
      Alert.alert("You didn't select any file");
    } else {
      setMedia(res.assets[0]);
    }
  };

  const backendHandler = async () => {
    console.log(media);
    if (media !== null) {
      try {
        const formData = new FormData();

        formData.append("image", {
          uri: media.uri,
          name: media.name ?? "file",
          type: media.mimeType ?? "application/octet-stream",
        } as any);

        const response = await axios.post(backendUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        Alert.alert("Upload complete", JSON.stringify(response.data));
      } catch (err: any) {
        console.log(err);
        Alert.alert("Upload failed", err.message || String(err));
      }
    }
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="Click To Pick A Document" onPress={imagePickerHandler} />
      <Button title="Click To Send Media To Backend" onPress={backendHandler} />
    </View>
  );
}
