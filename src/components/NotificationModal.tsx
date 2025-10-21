import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { useState } from "react";
import { colors } from "../theme/colors";
import { NotificationsModalStyles as styles } from "../styles";
import { Notification, NotificationsModalProps } from "../interface";

const NotificationSeparator = () => <View style={{ height: 1 }} />;

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
}: Readonly<NotificationsModalProps>) {
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
              ItemSeparatorComponent={NotificationSeparator}
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
