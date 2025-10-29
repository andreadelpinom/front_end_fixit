import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, client, technician } from "../theme/colors";

export default function HeaderNav({ userName = "Usuario", location = "Centro", notificationCount = 0, role = "client", onProfileClick, onNotificationClick }: any) {
  const insets = useSafeAreaInsets();
  let mainColor = client.primary;
  if (role === 'admin') {
    mainColor = colors.primary;
  } else if (role === 'tecnico') {
    mainColor = technician.primary;
  }
  return (
    <View style={{ paddingTop: insets.top || 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <TouchableOpacity onPress={onProfileClick}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: mainColor, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'white' }}>{userName.charAt(0).toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
      <Text>📍 {location}</Text>
      <TouchableOpacity onPress={onNotificationClick}>
        <Text>🔔 {notificationCount > 0 ? notificationCount : ''}</Text>
      </TouchableOpacity>
    </View>
  );
}
