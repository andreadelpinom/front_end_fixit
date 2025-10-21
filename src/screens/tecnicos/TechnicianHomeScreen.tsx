import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TechnicianHomeScreenStyles as styles } from "../../styles";
import NotificationsModal from '../../components/NotificationModal';
import { useNavigation } from '@react-navigation/native';
import HeaderNav from '../../components/HeaderNav';
import { TecnicoStackParamList, TecnicoTabParamList } from '../../types';

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

export const TechnicianHomeScreen = () => {
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
