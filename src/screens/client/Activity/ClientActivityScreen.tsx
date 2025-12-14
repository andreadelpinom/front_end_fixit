import React, { useMemo } from 'react';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { clientActivityStyles as styles } from './ClientActivityScreen.styles';
import { ClientActivityItem, useClientActivity } from './useClientActivity';
import { ActivityListSection } from './sections/ActivityListSection';
import { EmptyActivitySection } from './sections/EmptyActivitySection';
import { theme } from '../../../theme';

type Props = NativeStackScreenProps<any>;

export default function ClientActivityScreen({ navigation }: Props): React.ReactElement {
  const { services, loading, refreshing, error, onRefresh } = useClientActivity();

  const emptyComponent = useMemo(
    () => (
      <EmptyActivitySection
        title="Sin servicios completados"
        description="Cuando finalices un servicio, aparecerá en esta sección."
      />
    ),
    [],
  );

  const handleServicePress = (service: ClientActivityItem) => {
    navigation.navigate('RequestDetails', { idSolicitud: service.idSolicitud });
  };

  if (loading && services.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loaderText}>Cargando tu actividad...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Actividad</Text>
          <Text style={styles.subtitle}>Revisa tus servicios completados</Text>
        </View>

        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

        <View style={styles.content}>
          <ActivityListSection
            services={services}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onServicePress={handleServicePress}
            emptyComponent={emptyComponent}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
