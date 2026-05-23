import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";
import { getCurrentUser, logoutUser } from "../utils/storage";

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data when screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.replace("/login");
        } else {
          setUser(currentUser);
        }
        setLoading(false);
      };
      loadUser();
    }, [router])
  );

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      setUser(null);
      router.replace("/login");
    } else {
      Alert.alert("Error", result.error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoValue}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemeToggle />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello {user?.firstName || "User"}
        </Text>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* PROFILE SECTION */}
      <View style={styles.profileContainer}>
        {user?.profilePhoto ? (
          <Image
            source={{ uri: user.profilePhoto }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.noPhoto}>No Photo</Text>
          </View>
        )}
      </View>

      {/* USER INFO SECTION */}
      {user && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>First Name:</Text>
            <Text style={styles.infoValue}>{user.firstName || "N/A"}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Last Name:</Text>
            <Text style={styles.infoValue}>{user.lastName || "N/A"}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
  container: {
    backgroundColor: theme.background,
    flex: 1,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  greeting: {
    color: theme.text,
    fontSize: 24,
    fontWeight: "bold",
  },

  logout: {
    color: theme.danger,
    fontWeight: "bold",
    fontSize: 16,
  },

  profileContainer: {
    alignItems: "center",
    marginVertical: 30,
  },

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: theme.border,
  },

  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: theme.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.border,
  },

  noPhoto: {
    color: theme.muted,
    fontSize: 16,
  },

  infoSection: {
    marginTop: 20,
    marginBottom: 40,
  },

  sectionTitle: {
    color: theme.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  infoCard: {
    backgroundColor: theme.card,
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },

  infoLabel: {
    color: theme.muted,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  infoValue: {
    color: theme.text,
    fontSize: 16,
    marginTop: 4,
    fontWeight: "500",
  },
  });
}
