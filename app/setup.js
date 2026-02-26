import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { updateUserProfile } from "../utils/storage";

export default function Setup() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmit = async (data) => {
    try {
      const result = await updateUserProfile(email, {
        firstName: data.firstName,
        lastName: data.lastName,
        profilePhoto: image,
      });

      if (result.success) {
        router.replace("/");
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setup Account</Text>

      <Button title="Pick Profile Photo" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Controller
        control={control}
        name="firstName"
        rules={{ required: "First name required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="First Name"
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.firstName && <Text style={styles.error}>{errors.firstName.message}</Text>}

      <Controller
        control={control}
        name="lastName"
        rules={{ required: "Last name required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.lastName && <Text style={styles.error}>{errors.lastName.message}</Text>}

      <Button title="Finish Setup" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  image: { width: 100, height: 100, marginVertical: 10 },
  error: { color: "red", marginBottom: 10 }
});