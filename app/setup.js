import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";
import { updateUserProfile } from "../utils/storage";

export default function Setup() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
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
      <ThemeToggle />
      <Text style={styles.title}>Setup Account</Text>

      <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
        <Text style={styles.secondaryButtonText}>Pick Profile Photo</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Controller
        control={control}
        name="firstName"
        rules={{ required: "First name required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="First Name"
            placeholderTextColor={theme.muted}
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
            placeholderTextColor={theme.muted}
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.lastName && <Text style={styles.error}>{errors.lastName.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Finish Setup</Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: { backgroundColor: theme.background, flex: 1, justifyContent: "center", padding: 20 },
    title: { color: theme.text, fontSize: 24, fontWeight: "700", marginBottom: 20, textAlign: "center" },
    input: {
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderRadius: 8,
      borderWidth: 1,
      color: theme.text,
      marginBottom: 10,
      padding: 10,
    },
    image: { alignSelf: "center", borderRadius: 50, height: 100, marginVertical: 10, width: 100 },
    button: {
      alignItems: "center",
      backgroundColor: theme.primary,
      borderRadius: 8,
      padding: 12,
    },
    buttonText: {
      color: theme.primaryText,
      fontWeight: "700",
    },
    secondaryButton: {
      alignItems: "center",
      borderColor: theme.primary,
      borderRadius: 8,
      borderWidth: 2,
      padding: 12,
    },
    secondaryButtonText: {
      color: theme.primary,
      fontWeight: "700",
    },
    error: { color: theme.danger, marginBottom: 10 },
  });
}
