import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

interface HeaderNavProps {
  userName?: string;
  location?: string;
  notificationCount?: number;
  showProfilePhoto?: boolean;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

export default function HeaderNav({
  userName = "Usuario",
  location = "Centro, Guayaquil",
  notificationCount = 0,
  showProfilePhoto = true,
  onNotificationClick,
  onProfileClick
}: HeaderNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        { paddingTop: insets.top || 10 }
      ]}
    >
      <View style={styles.container}>
        {/* Profile Photo */}
        {showProfilePhoto && (
          <TouchableOpacity
            onPress={onProfileClick}
            style={styles.profilePhoto}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Location */}
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>📍 {location}</Text>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity
          onPress={onNotificationClick}
          style={styles.notificationButton}
        >
          <Text style={styles.bellIcon}>🔔</Text>
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>
                {notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    paddingHorizontal: 16
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  profilePhoto: {
    marginRight: 12
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center"
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  },
  locationContainer: {
    flex: 1,
    marginHorizontal: 12
  },
  locationText: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: "500"
  },
  notificationButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    position: "relative"
  },
  bellIcon: {
    fontSize: 24
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  notificationCount: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700"
  }
});
