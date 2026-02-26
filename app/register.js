import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { saveUser } from "../utils/storage";

export default function Register() {
  const router = useRouter();
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
      <Text style={styles.title}>Register</Text>

      {/* Email */}
      <Controller
        control={control}
        name="email"
        rules={{ required: "Email required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
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

      <Button title="Register" onPress={handleSubmit(onRegister)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  error: { color: "red", marginBottom: 10 }
});