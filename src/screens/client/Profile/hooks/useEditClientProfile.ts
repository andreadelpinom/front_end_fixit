import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { clientProfileService } from '../../../../services/client-profile.service';
import { storageService } from '../../../../services/storage.service';
import { ErrorUtils } from '../../../../utils/error.utils';
import { User } from '../../../../types/auth.types';

type FormErrors = {
  nombres?: string;
  apellidos?: string;
};

type SubmitResult =
  | { status: 'REMOTE_SUCCESS'; user: User }
  | { status: 'LOCAL_FALLBACK'; user: User }
  | { status: 'INVALID_FORM' }
  | { status: 'ERROR'; message: string };

const getStatusCode = (error: unknown): number | null => {
  if (!error || typeof error !== 'object') {
    return null;
  }

  if ('statusCode' in error && typeof (error as any).statusCode === 'number') {
    return (error as any).statusCode;
  }

  if ('status' in error && typeof (error as any).status === 'number') {
    return (error as any).status;
  }

  if ('response' in error && error.response && typeof error.response === 'object') {
    const response = (error as any).response;
    if ('status' in response && typeof response.status === 'number') {
      return response.status;
    }
  }

  return null;
};

export function useEditClientProfile() {
  const { user, setUser } = useAuth();
  const [nombres, setNombres] = useState<string>(user?.nombres ?? '');
  const [apellidos, setApellidos] = useState<string>(user?.apellidos ?? '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    setNombres(user?.nombres ?? '');
    setApellidos(user?.apellidos ?? '');
    setErrors({});
    setSubmissionError(null);
  }, [user]);

  const validate = useCallback(() => {
    const newErrors: FormErrors = {};

    if (!nombres.trim()) {
      newErrors.nombres = 'El nombre es requerido';
    }

    if (!apellidos.trim()) {
      newErrors.apellidos = 'El apellido es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [apellidos, nombres]);

  const handleNameChange = useCallback((value: string) => {
    setNombres(value);
    setErrors(prev => ({ ...prev, nombres: undefined }));
    setSubmissionError(null);
  }, []);

  const handleLastnameChange = useCallback((value: string) => {
    setApellidos(value);
    setErrors(prev => ({ ...prev, apellidos: undefined }));
    setSubmissionError(null);
  }, []);

  const submit = useCallback(async (): Promise<SubmitResult> => {
    if (!user) {
      const message = 'Usuario no encontrado';
      setSubmissionError(message);
      return { status: 'ERROR', message };
    }

    if (!validate()) {
      return { status: 'INVALID_FORM' };
    }

    const payload = {
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
    } as const;

    setSaving(true);
    setSubmissionError(null);

    try {
      const updated = await clientProfileService.updateProfile(user.idUser, payload);
      setUser(updated);
      await storageService.saveUserData(updated);
      return { status: 'REMOTE_SUCCESS', user: updated };
    } catch (err) {
      const statusCode = getStatusCode(err);

      if (statusCode === 403 || statusCode === 404 || statusCode === 0) {
        const fallbackUser: User = {
          ...user,
          nombres: payload.nombres,
          apellidos: payload.apellidos,
        };
        setUser(fallbackUser);
        await storageService.saveUserData(fallbackUser);
        return { status: 'LOCAL_FALLBACK', user: fallbackUser };
      }

      const message = ErrorUtils.getErrorMessage(err);
      setSubmissionError(message);
      return { status: 'ERROR', message };
    } finally {
      setSaving(false);
    }
  }, [apellidos, nombres, setUser, user, validate]);

  const canSubmit = useMemo(() => {
    return Boolean(nombres.trim() && apellidos.trim()) && !saving;
  }, [apellidos, nombres, saving]);

  return {
    nombres,
    apellidos,
    errors,
    saving,
    submissionError,
    canSubmit,
    handleNameChange,
    handleLastnameChange,
    submit,
  };
}
