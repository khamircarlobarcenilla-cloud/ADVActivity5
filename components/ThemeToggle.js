import { StyleSheet, Switch, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { isDark, theme, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.label, { color: theme.text }]}>{theme.name} Theme</Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        thumbColor={isDark ? theme.primary : theme.card}
        trackColor={{ false: theme.border, true: theme.primary }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "flex-end",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  label: {
    fontWeight: "700",
  },
});
