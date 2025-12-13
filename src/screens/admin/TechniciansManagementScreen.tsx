// src/screens/admin/TechniciansManagementScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  SafeAreaView,
} from 'react-native';
import { adminService, TechnicianApproval } from '../../services/admin.service';
import { LoadingView } from '../../components/common';
import { AdminStyles } from '../../styles/AdminScreens.style';

export default function TechniciansManagementScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [technicians, setTechnicians] = useState<TechnicianApproval[]>([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState<TechnicianApproval[]>([]);
  const [view, setView] = useState<'pending' | 'approved'>('pending');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const loadData = async () => {
    try {
      const data = view === 'pending'
        ? await adminService.getPendingTechnicians()
        : await adminService.getAllTechnicians();
      setTechnicians(data);
      setFilteredTechnicians(data);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'No se pudieron cargar técnicos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [view]);

  useEffect(() => {
    filterTechnicians();
  }, [filterStatus, technicians]);

  const filterTechnicians = () => {
    let filtered = technicians;

    if (view === 'approved' && filterStatus !== 'ALL') {
      filtered = filtered.filter(t => 
        filterStatus === 'ACTIVE' ? t.isActive : !t.isActive
      );
    }

    setFilteredTechnicians(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleApproveTechnician = async (tech: TechnicianApproval) => {
    Alert.alert(
      'Aprobar Técnico',
      `¿Aprobar a ${tech.nombres} ${tech.apellidos}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprobar',
          onPress: async () => {
            try {
              await adminService.approveTechnician(tech.idTecnico);
              await adminService.logAdminAction(
                'TECHNICIAN_APPROVED',
                `Técnico ${tech.idTecnico} - ${tech.nombres} ${tech.apellidos}`
              );
              Alert.alert('Éxito', '✅ Técnico aprobado');
              loadData();
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'No se pudo aprobar el técnico');
            }
          },
        },
      ]
    );
  };

  const showTechnicianDetail = (tech: TechnicianApproval) => {
    const certifications = tech.certificaciones?.map(c => c.nombreCertificacion).join(', ') || 'Ninguna';
    const services = tech.servicios?.map(s => s.nombreServicio).join(', ') || 'Ninguno';
    const zones = tech.zonas?.map(z => z.nombreParroquia).join(', ') || 'Ninguna';

    Alert.alert(
      `Detalle de ${tech.nombres} ${tech.apellidos}`,
      `Certificaciones: ${certifications}\n\nServicios: ${services}\n\nZonas de cobertura: ${zones}`,
      [
        { text: 'Cerrar' },
        ...(tech.isActive ? [] : [{
          text: 'Aprobar',
          onPress: () => handleApproveTechnician(tech)
        }]),
        ...(tech.isActive ? [] : [{
          text: 'Rechazar',
          onPress: () => handleRejectTechnician(tech),
          style: 'destructive' as const
        }])
      ]
    );
  };

  const renderTechnician = ({ item }: { item: TechnicianApproval }) => (
    <View style={styles.technicianRow}>
      <View style={styles.technicianInfo}>
        <Text style={styles.technicianName}>
          {item.nombres} {item.apellidos}
        </Text>
        <Text style={styles.technicianSpecialty}>
          {item.servicios && item.servicios.length > 0 
            ? item.servicios.map(s => s.nombreServicio).join(', ')
            : 'Sin especialidad definida'
          }
        </Text>
      </View>
      <View style={styles.technicianStatus}>
        <View style={[
          styles.statusBadge, 
          item.isActive ? styles.statusVerified : styles.statusPending
        ]}>
          <Text style={styles.statusText}>
            {item.isActive ? 'Verificado' : 'Pendiente'}
          </Text>
        </View>
      </View>
      <View style={styles.technicianActions}>
        {!item.isActive && (
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleApproveTechnician(item)}
          >
            <Text style={styles.approveButtonText}>Aprobar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => showTechnicianDetail(item)}
        >
          <Text style={styles.detailButtonText}>Ver detalle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <LoadingView />;

  return (
    <SafeAreaView style={AdminStyles.container}>
      {/* Tabs: Pendientes / Aprobados */}
      <View style={AdminStyles.tabContainer}>
        <TouchableOpacity
          style={[AdminStyles.tabBtn, view === 'pending' && AdminStyles.tabBtnActive]}
          onPress={() => { setView('pending'); setFilterStatus('ALL'); }}
        >
          <Text style={[AdminStyles.tabBtnText, view === 'pending' && AdminStyles.tabBtnTextActive]}>
            Pendientes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[AdminStyles.tabBtn, view === 'approved' && AdminStyles.tabBtnActive]}
          onPress={() => setView('approved')}
        >
          <Text style={[AdminStyles.tabBtnText, view === 'approved' && AdminStyles.tabBtnTextActive]}>
            Verificados
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtros de estado (solo en vista Aprobados) */}
      {view === 'approved' && (
        <View style={[AdminStyles.filterContainer, { paddingTop: 0 }]}>
          {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map(status => (
            <TouchableOpacity
              key={status}
              style={[
                AdminStyles.filterBtn,
                filterStatus === status && AdminStyles.filterBtnActive,
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[
                AdminStyles.filterBtnText,
                filterStatus === status && AdminStyles.filterBtnTextActive,
              ]}>
                {status === 'ALL' ? 'Todos' : status === 'ACTIVE' ? 'Activos' : 'Inactivos'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Lista de técnicos */}
      <View style={AdminStyles.section}>
        <FlatList
          data={filteredTechnicians}
          renderItem={renderTechnician}
          keyExtractor={item => item.idTecnico.toString()}
          contentContainerStyle={AdminStyles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={AdminStyles.emptyContainer}>
              <Text style={AdminStyles.emptyText}>
                {view === 'pending' ? 'No hay técnicos pendientes' : 'No hay técnicos aprobados'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  technicianRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  technicianInfo: {
    flex: 1,
  },
  technicianName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  technicianSpecialty: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  technicianStatus: {
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusVerified: {
    backgroundColor: '#27AE60',
  },
  statusPending: {
    backgroundColor: '#F39C12',
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  technicianActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
