import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { loginUser } from "../utils/storage";

export default function LoginScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await loginUser(data.email, data.password);
    if (result.success) {
      router.replace("/");
    } else {
      Alert.alert("Login Failed", result.error);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        {/* EMAIL FIELD */}
        <Text>Email</Text>
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
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        {/* PASSWORD FIELD */}
        <Text>Password</Text>
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
          <Text style={styles.buttonText}>Login</Text>
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  card: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  spacing: {
    marginTop: 15,
  },
  buttonText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
});