import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";
import { saveUser } from "../utils/storage";

export default function Register() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { control, handleSubmit, watch, formState: { errors } } = useForm();

  const password = watch("password");

  const onRegister = async (data) => {
    // Verify user doesn't already exist
    const result = await saveUser({
      email: data.email,
      password: data.password,
      firstName: "",
      lastName: "",
      profilePhoto: null,
    });

    if (result.success) {
      // Pass email to setup screen for profile completion
      router.push({
        pathname: "/setup",
        params: { email: data.email },
      });
    } else {
      alert(result.error);
    }
  };

  return (
    <View style={styles.container}>
      <ThemeToggle />
      <Text style={styles.title}>Register</Text>

      {/* Email */}
      <Controller
        control={control}
        name="email"
        rules={{ required: "Email required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            placeholderTextColor={theme.muted}
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      {/* Password */}
      <Controller
        control={control}
        name="password"
        rules={{ required: "Password required", minLength: 6 }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Password"
            placeholderTextColor={theme.muted}
            secureTextEntry
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>Minimum 6 characters</Text>}

      {/* Confirm Password */}
      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: "Confirm password required",
          validate: value => value === password || "Passwords do not match"
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor={theme.muted}
            secureTextEntry
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={styles.error}>{errors.confirmPassword.message}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onRegister)}>
        <Text style={styles.buttonText}>Register</Text>
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
    error: { color: theme.danger, marginBottom: 10 },
  });
}
