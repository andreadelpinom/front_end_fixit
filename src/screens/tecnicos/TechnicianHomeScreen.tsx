import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../../theme/colors';
import HeaderNav from '../../components/HeaderNav';
import NotificationsModal from '../../components/NotificationModal';

// TODO: Replace with API data when backend is ready
const demoCourses = [
  {
    id: '1',
    title: 'Curso de Electricidad Básica',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    description: 'Aprende los fundamentos de electricidad para técnicos.'
  },
  {
    id: '2',
    title: 'Certificación en Aires Acondicionados',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    description: 'Obtén tu certificación oficial en mantenimiento de aires.'
  }
];

const demoPromos = [
  {
    id: '1',
    title: 'Beca 50% en Certificaciones',
    description: 'Solicita tu beca para cursos seleccionados.'
  },
  {
    id: '2',
    title: 'Descuento en Herramientas',
    description: 'Obtén hasta 30% de descuento en herramientas para técnicos.'
  }
];

const demoServices = [
  {
    id: '1',
    name: 'Instalación de Paneles Solares',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    price: 'Desde $1,200'
  },
  {
    id: '2',
    name: 'Reparación de Lavadoras',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353',
    price: 'Desde $500'
  }
];

const demoRequests = [
  {
    id: '1',
    client: 'Juan Pérez',
    service: 'Reparación de aire acondicionado',
    status: 'Pendiente'
  },
  {
    id: '2',
    client: 'María López',
    service: 'Instalación de panel solar',
    status: 'En progreso'
  }
];

type TecnicoTabParamList = {
  Home: undefined;
  Performance: undefined;
  Solicitudes: undefined;
  Profile: undefined;
};

type TecnicoStackParamList = {
  TecnicoTabs: undefined;
  TechnicianRequestDetail: { id: string } | undefined;
  Certifications: undefined;
};

const TechnicianHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<TecnicoStackParamList> & BottomTabNavigationProp<TecnicoTabParamList>>();
  const [showNotifications, setShowNotifications] = useState(false);
  const [courses] = useState(demoCourses);
  const [promos] = useState(demoPromos);
  const [services] = useState(demoServices);
  const [requests] = useState(demoRequests);
  // Estado para el rol
  const [role, setRole] = useState<'tecnico' | 'client'>('tecnico');

  // Alternar rol al hacer click en el avatar
  const handleProfileClick = () => {
    setRole(prev => (prev === 'tecnico' ? 'client' : 'tecnico'));
  };

  return (
    <View style={styles.container}>
      <HeaderNav
        userName="Carlos"
        location="Centro, Guayaquil"
        notificationCount={2}
        showProfilePhoto={true}
        onNotificationClick={() => setShowNotifications(true)}
        onProfileClick={handleProfileClick}
        role={role}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cursos y Certificaciones */}
        <Text style={styles.sectionTitle}>Cursos y Certificaciones</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {courses.map(course => (
            <TouchableOpacity
              key={course.id}
              style={styles.card}
              onPress={() => navigation.navigate('Certifications')}
            >
              <Image source={{ uri: course.image }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{course.title}</Text>
              <Text style={styles.cardDesc}>{course.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Promociones y Becas */}
        <Text style={styles.sectionTitle}>Promociones y Becas</Text>
        <View style={styles.promosContainer}>
          {promos.map(promo => (
            <View key={promo.id} style={styles.promoCard}>
              <Text style={styles.promoTitle}>{promo.title}</Text>
              <Text style={styles.promoDesc}>{promo.description}</Text>
            </View>
          ))}
        </View>

        {/* Servicios Destacados */}
        <Text style={styles.sectionTitle}>Servicios Destacados</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {services.map(service => (
            <TouchableOpacity
              key={service.id}
              style={styles.card}
              onPress={() => navigation.navigate('Performance')}
            >
              <Image source={{ uri: service.image }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{service.name}</Text>
              <Text style={styles.cardDesc}>{service.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Solicitudes Recientes */}
        <Text style={styles.sectionTitle}>Solicitudes Recientes</Text>
        <View style={styles.requestsContainer}>
          {requests.map(request => (
            <View key={request.id} style={styles.requestCard}>
              <Text style={styles.requestClient}>{request.client}</Text>
              <Text style={styles.requestService}>{request.service}</Text>
              <Text style={styles.requestStatus}>{request.status}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 24,
    marginBottom: 8,
  },
  horizontalScroll: {
    marginBottom: 16,
  },
  card: {
    width: 220,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginRight: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  promosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  promoCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    marginBottom: 8,
    minWidth: 160,
    flex: 1,
  },
  promoTitle: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 15,
    marginBottom: 4,
  },
  promoDesc: {
    color: colors.text.secondary,
    fontSize: 13,
  },
  requestsContainer: {
    marginBottom: 24,
  },
  requestCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  requestClient: {
    fontWeight: 'bold',
    color: colors.text.primary,
    fontSize: 15,
  },
  requestService: {
    color: colors.text.secondary,
    fontSize: 13,
    marginBottom: 2,
  },
  requestStatus: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default TechnicianHomeScreen;
