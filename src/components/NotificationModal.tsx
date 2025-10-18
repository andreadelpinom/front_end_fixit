import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions
} from "react-native";
import { colors } from "../theme/colors";

interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
  icon?: string;
  action?: string;
  requestId?: string;
  redirectTo?: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultNotifications: Notification[] = [
  {
    id: "0",
    type: "certificacion",
    title: "¡Felicidades! Has sido certificado",
    description: "Tu perfil ahora cuenta con el distintivo de técnico verificado.",
    time: "Hoy, 11:30 AM",
    isUnread: true,
    icon: "🎓",
    action: "Ver",
    requestId: "CERT-001",
    redirectTo: "/perfil-tecnico"
  },
  {
    id: "1",
    type: "request",
    title: "Nueva solicitud disponible",
    description: "Se ha publicado una nueva solicitud en tu área de cobertura",
    time: "Hoy, 10:15 AM",
    isUnread: true,
    icon: "📋",
    action: "Ver"
  },
  {
    id: "2",
    type: "message",
    title: "María González dejó un comentario",
    description: "Excelente trabajo en mi reparación del aire acondicionado",
    time: "Hoy, 8:45 AM",
    isUnread: false,
    icon: "💬"
  }
];

export default function NotificationsModal({
  isOpen,
  onClose
}: NotificationsModalProps) {
  const [notifications, setNotifications] = useState(defaultNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map(notif =>
        notif.id === id ? { ...notif, isUnread: false } : notif
      )
    );
  };

  const handleAction = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    // In a real app, navigate based on redirectTo or handle the action
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => handleAction(item)}
      style={[
        styles.notificationItem,
        item.isUnread && { backgroundColor: colors.borderLight }
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon || "🔔"}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      {item.isUnread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Notificaciones</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <FlatList
              data={notifications}
              renderItem={renderNotification}
              keyExtractor={(item) => item.id}
              scrollEnabled={true}
              ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔕</Text>
              <Text style={styles.emptyText}>No tienes notificaciones</Text>
              <Text style={styles.emptySubtext}>
                Volveremos aquí cuando tengas nuevas actualizaciones
              </Text>
            </View>
          )}

          {/* Mark all as read button */}
          {notifications.some(n => n.isUnread) && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={() =>
                setNotifications(
                  notifications.map(notif => ({
                    ...notif,
                    isUnread: false
                  }))
                )
              }
            >
              <Text style={styles.markAllText}>Marcar todo como leído</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end"
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: windowHeight * 0.9,
    paddingBottom: 20
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary
  },
  closeButton: {
    fontSize: 24,
    color: colors.text.tertiary
  },
  listContent: {
    paddingHorizontal: 0
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0
  },
  icon: {
    fontSize: 20
  },
  contentContainer: {
    flex: 1
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4
  },
  description: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
    lineHeight: 16
  },
  time: {
    fontSize: 11,
    color: colors.text.tertiary
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 4,
    flexShrink: 0
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: "center"
  },
  markAllButton: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16
  },
  markAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600"
  }
});
