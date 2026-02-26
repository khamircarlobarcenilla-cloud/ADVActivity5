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
import { getCurrentUser, logoutUser } from "../utils/storage";

export default function HomeScreen() {
  const router = useRouter();
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
    }, [])
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
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },

  logout: {
    color: "red",
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
    borderColor: "#ddd",
  },

  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ddd",
  },

  noPhoto: {
    fontSize: 16,
    color: "#999",
  },

  infoSection: {
    marginTop: 20,
    marginBottom: 40,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },

  infoCard: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
  },

  infoValue: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
    fontWeight: "500",
  },
});