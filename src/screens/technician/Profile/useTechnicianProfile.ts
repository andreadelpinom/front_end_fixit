import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getTechnicianByUser, updateTechnicianProfile, updateTechnicianStatus, TecnicoWithDetails, getMyProposals } from '../../../services/technician.service';
import { homeService } from '../../../services/home.service';

export interface TechnicianProfileData {
  technician: TecnicoWithDetails | null;
  loading: boolean;
  error: string | null;
  averageHours?: number;
}

export const useTechnicianProfile = () => {
  const { user, updateUser } = useAuth();
  const [technician, setTechnician] = useState<TecnicoWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageHours, setAverageHours] = useState<number | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    telefono: '',
    servicios: [] as string[],
    horario: '',
    zona: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setError(null);
      const data = await getTechnicianByUser(user.idUser);
      setTechnician(data);
      
      // Calculate average hours from completed jobs
      const avgHours = await calculateAverageHours();
      setAverageHours(avgHours);
      
      setEditData({
        telefono: user.telefono || '',
        servicios: data.servicios?.map(s => s.nombre) || [],
        horario: data.horario || '',
        zona: data.parroquias?.[0]?.nombre || '',
      });
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError(err?.message || 'Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageHours = async (): Promise<number | undefined> => {
    try {
      // Get all proposals
      const proposals = await getMyProposals();
      
      // Filter completed jobs (accepted with confirmation date)
      const completedJobs = proposals.filter(
        p => p.estadoAcuerdo === 'ACEPTADO' && p.fechaConfirmada
      );
      
      if (completedJobs.length === 0) {
        return undefined;
      }
      
      // For each completed job, get the request details to access duration
      const durations: number[] = [];
      
      for (const job of completedJobs) {
        try {
          const requestDetails = await homeService.getRequestDetails(job.idSolicitud);
          if (requestDetails.duracionEstimadaMin) {
            // Convert minutes to hours
            durations.push(requestDetails.duracionEstimadaMin / 60);
          }
        } catch (error) {
          console.warn(`Could not get duration for request ${job.idSolicitud}:`, error);
        }
      }
      
      if (durations.length === 0) {
        return undefined;
      }
      
      // Calculate average
      const totalHours = durations.reduce((sum, hours) => sum + hours, 0);
      return totalHours / durations.length;
      
    } catch (error) {
      console.error('Error calculating average hours:', error);
      return undefined;
    }
  };

  const startEditing = () => {
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    // Reset to original
    setEditData({
      telefono: user?.telefono || '',
      servicios: technician?.servicios?.map(s => s.nombre) || [],
      horario: technician?.horario || '',
      zona: technician?.parroquias?.[0]?.nombre || '',
    });
  };

  const saveProfile = async () => {
    if (!user || !technician) return;

    // Validation
    if (!editData.telefono.trim()) {
      setError('Teléfono es obligatorio');
      return;
    }
    if (editData.servicios.length === 0) {
      setError('Debe seleccionar al menos un servicio');
      return;
    }
    if (!editData.horario.trim()) {
      setError('Horario es obligatorio');
      return;
    }
    if (!editData.zona.trim()) {
      setError('Zona es obligatoria');
      return;
    }

    setSaving(true);
    try {
      // Update user telefono
      await updateUser({ telefono: editData.telefono });

      // Update technician profile
      await updateTechnicianProfile(technician.idTecnico, {
        servicios: editData.servicios,
        horario: editData.horario,
        zona: editData.zona,
      });

      // Check if complete
      const isComplete = editData.telefono && editData.servicios.length > 0 && editData.horario && editData.zona;
      if (isComplete) {
        await updateTechnicianStatus(technician.idTecnico, 'COMPLETO');
      }

      setEditing(false);
      await loadProfile(); // Reload
    } catch (err: any) {
      setError(err?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const updateEditData = (field: string, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return {
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
    loadProfile,
  };
};