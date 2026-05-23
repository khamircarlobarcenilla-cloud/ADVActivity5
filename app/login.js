import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";
import { loginUser, signInWithGoogleAccount } from "../utils/storage";

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await loginUser(data.email, data.password);
    setLoading(false);

    if (result.success) {
      router.replace("/");
    } else {
      Alert.alert("Login Failed", result.error);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const result = await signInWithGoogleAccount();
    setGoogleLoading(false);

    if (result.success) {
      router.replace("/");
    } else {
      Alert.alert("Google Sign-In Failed", result.error);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <ThemeToggle />
        <Text style={styles.title}>Login</Text>

        {/* EMAIL FIELD */}
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email format",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor={theme.muted}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        {/* PASSWORD FIELD */}
        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor={theme.muted}
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login with Email"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={googleLoading}
          style={[styles.googleButton, styles.spacing]}
          onPress={handleGoogleLogin}
        >
          <Text style={styles.googleButtonText}>
            {googleLoading ? "Opening Google..." : "Continue with Google"}
          </Text>
        </TouchableOpacity>

        {/* REGISTER BUTTON */}
        <TouchableOpacity
          style={[styles.outlineButton, styles.spacing]}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
  screen: {
    backgroundColor: theme.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    color: theme.text,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    color: theme.text,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.surface,
    color: theme.text,
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  outlineButton: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.primary,
    padding: 12,
    borderRadius: 8,
  },
  googleButton: {
    alignItems: "center",
    backgroundColor: theme.primary,
    borderRadius: 8,
    padding: 12,
  },
  spacing: {
    marginTop: 15,
  },
  buttonText: {
    color: theme.primary,
    fontWeight: "bold",
  },
  googleButtonText: {
    color: theme.primaryText,
    fontWeight: "bold",
  },
  error: {
    color: theme.danger,
    marginBottom: 8,
  },
  });
}
