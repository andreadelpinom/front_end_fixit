import {
  View,
  Text,
  TouchableOpacity
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, client, technician } from "../theme/colors";
import { HeaderNavStyles as styles } from "../styles";
import { HeaderNavProps } from "../interface";

export default function HeaderNav({
  userName = "Usuario",
  location = "Centro, Guayaquil",
  notificationCount = 0,
  showProfilePhoto = true,
  onNotificationClick,
  onProfileClick,
  role = "client"
}: Readonly<HeaderNavProps>) {
  const insets = useSafeAreaInsets();

  // Color dinámico según rol
  let mainColor = client.primary;
  if (role === "admin") mainColor = colors.primary;
  if (role === "tecnico") mainColor = technician.primary;

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
            <View style={[styles.avatarCircle, { backgroundColor: mainColor }]}>
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
            <View style={[styles.notificationBadge, { backgroundColor: mainColor }]}>
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
