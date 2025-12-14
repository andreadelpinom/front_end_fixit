import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText, ThemedView } from '../../../../ui';
import { TecnicoWithDetails } from '../../../../services/technician.service';

interface TechnicianServicesSectionProps {
  technician: TecnicoWithDetails | null;
  editing?: boolean;
  editData?: { servicios: string[]; horario: string; zona: string };
  onUpdateEditData?: (field: string, value: any) => void;
}

export const TechnicianServicesSection: React.FC<TechnicianServicesSectionProps> = ({
  technician,
  editing = false,
  editData,
  onUpdateEditData,
}) => {
  if (!technician && !editing) return null;

  const availableServices = [
    'Plomería',
    'Electricidad',
    'Carpintería',
    'Pintura',
    'Jardinería',
    'Limpieza',
    'Reparaciones',
  ];

  const toggleService = (service: string) => {
    if (!editData || !onUpdateEditData) return;
    const current = editData.servicios || [];
    const updated = current.includes(service)
      ? current.filter(s => s !== service)
      : [...current, service];
    onUpdateEditData('servicios', updated);
  };

  return (
    <ThemedView variant="surface" style={styles.section}>
      <ThemedText variant="h3" style={styles.sectionTitle}>
        Servicios y Disponibilidad
      </ThemedText>
      <View style={styles.card}>
        {editing ? (
          <>
            <ThemedText variant="body" style={styles.subTitle}>
              Servicios que ofreces:
            </ThemedText>
            <View style={styles.servicesGrid}>
              {availableServices.map(service => (
                <TouchableOpacity
                  key={service}
                  style={[
                    styles.serviceChip,
                    (editData?.servicios || []).includes(service) && styles.serviceChipSelected,
                  ]}
                  onPress={() => toggleService(service)}
                >
                  <ThemedText
                    variant="body"
                    style={[
                      styles.serviceText,
                      (editData?.servicios || []).includes(service) && styles.serviceTextSelected,
                    ]}
                  >
                    {service}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            <EditableRow
              label="Horario de trabajo"
              value={editData?.horario || ''}
              onChange={(value) => onUpdateEditData?.('horario', value)}
              placeholder="Ej: Lunes a Viernes 8am-6pm"
            />
            <EditableRow
              label="Zona de trabajo"
              value={editData?.zona || ''}
              onChange={(value) => onUpdateEditData?.('zona', value)}
              placeholder="Ej: Centro, Norte, etc."
            />
          </>
        ) : (
          <>
            <InfoRow
              label="Servicios"
              value={technician?.servicios?.map(s => s.nombre).join(', ') || 'No especificados'}
            />
            <InfoRow label="Horario" value={technician?.horario || 'No especificado'} />
            <InfoRow label="Zona" value={technician?.parroquias?.[0]?.nombre || 'No especificada'} />
          </>
        )}
      </View>
    </ThemedView>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText variant="body" color="muted" style={styles.label}>
        {label}:
      </ThemedText>
      <ThemedText variant="body" style={styles.value}>
        {value}
      </ThemedText>
    </View>
  );
}

function EditableRow({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.infoRow}>
      <ThemedText variant="body" color="muted" style={styles.label}>
        {label}:
      </ThemedText>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  subTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    flex: 1,
  },
  value: {
    flex: 2,
    textAlign: 'right',
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    textAlign: 'right',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  serviceChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  serviceChipSelected: {
    backgroundColor: '#007AFF',
  },
  serviceText: {
    fontSize: 14,
  },
  serviceTextSelected: {
    color: '#FFFFFF',
  },
});