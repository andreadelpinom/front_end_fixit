import React from 'react';
import { ScrollView, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTechnicianProfile } from './useTechnicianProfile';
import { TechnicianPersonalInfoSection } from './sections/TechnicianPersonalInfoSection';
import { TechnicianServicesSection } from './sections/TechnicianServicesSection';
import { TechnicianProfileInfoSection } from './sections/TechnicianProfileInfoSection';
import { TechnicianStatsSection } from './sections/TechnicianStatsSection';
import { TechnicianRoleSwitchSection } from './sections/TechnicianRoleSwitchSection';
import { TechnicianLogoutSection } from './sections/TechnicianLogoutSection';
import { TechnicianCertificationsSection } from './sections/TechnicianCertificationsSection';
import { ThemedText } from '../../../ui';
import { theme } from '../../../theme';
import { styles } from './TechnicianProfileScreen.styles';

export default function TechnicianProfileScreen() {
  const { user } = useAuth();
  const {
    technician,
    loading,
    error,
    averageHours,
    editing,
    editData,
    saving,
    startEditing,
    cancelEditing,
    saveProfile,
    updateEditData,
  } = useTechnicianProfile();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <ThemedText variant="body" color="muted" style={styles.loadingText}>
          Cargando perfil...
        </ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText variant="body" color="error" style={styles.errorText}>
          ⚠️ {error}
        </ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="h2" style={styles.title}>
          Mi Perfil Técnico
        </ThemedText>
        {!editing ? (
          <TouchableOpacity style={styles.editButton} onPress={startEditing}>
            <ThemedText variant="body" style={styles.editButtonText}>
              ✏️ Editar
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelEditing}>
              <ThemedText variant="body" style={styles.cancelButtonText}>
                Cancelar
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={saveProfile}
              disabled={saving}
            >
              <ThemedText variant="body" style={styles.saveButtonText}>
                {saving ? 'Guardando...' : '💾 Guardar'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TechnicianPersonalInfoSection
        user={user}
        editing={editing}
        editData={editData}
        onUpdateEditData={updateEditData}
      />

      <TechnicianServicesSection
        technician={technician}
        editing={editing}
        editData={editData}
        onUpdateEditData={updateEditData}
      />

      <TechnicianProfileInfoSection technician={technician} />

      <TechnicianStatsSection technician={technician} averageHours={averageHours} />

      <TechnicianRoleSwitchSection />

      <TechnicianCertificationsSection certifications={technician?.certificaciones || []} />

      <TechnicianLogoutSection />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}