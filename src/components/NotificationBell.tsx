import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { notificationService } from '../services/notification.service';
import { WIZARD_COLORS } from '../screens/client/request-wizard/WizardShared';

interface NotificationBellProps {
  navigation: NativeStackNavigationProp<any>;
}

/**
 * Componente de campanita para notificaciones con badge
 * Se muestra en el header derecho de la pantalla Home
 */
export const NotificationBell: React.FC<NotificationBellProps> = ({ navigation }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Obtiene el contador de notificaciones no leídas
   */
  const fetchUnreadCount = async () => {
    try {
      setLoading(true);
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('[NotificationBell] Error fetching unread count:', error);
      // Si hay error, mostrar 0 notificaciones
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Usar useFocusEffect para refrescar el contador cada vez que
   * la pantalla se enfoca (cuando regresa del NotificationsScreen)
   */
  useFocusEffect(
    React.useCallback(() => {
      fetchUnreadCount();
    }, [])
  );

  /**
   * Navegar a la pantalla de notificaciones
   */
  const handlePress = () => {
    navigation.navigate('ProfileTab', {
      screen: 'Notifications',
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      disabled={loading}
      activeOpacity={0.7}
    >
      <Ionicons
        name="notifications-outline"
        size={24}
        color={WIZARD_COLORS.primary}
      />

      {/* Badge con número de notificaciones no leídas */}
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Ionicons
            name="close-circle"
            size={20}
            color="white"
            style={styles.badgeIcon}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: WIZARD_COLORS.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeIcon: {
    marginRight: 2,
  },
});
