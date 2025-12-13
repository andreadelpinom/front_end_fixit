import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { clientProfileService } from '../../../../services/client-profile.service';
import { ErrorUtils } from '../../../../utils/error.utils';
import { User } from '../../../../types/auth.types';

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

export function useClientProfile() {
  const {
    user,
    setUser,
    logout,
    switchRole,
    isLoading: authLoading,
  } = useAuth();

  const [profile, setProfile] = useState<User | null>(user);
  const [loading, setLoading] = useState<boolean>(authLoading);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProfile(user);
    if (!user) {
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = useCallback(
    async (options: { showLoader: boolean } = { showLoader: true }) => {
      if (!user) {
        setLoading(false);
        setProfile(null);
        return;
      }

      if (options.showLoader) {
        setLoading(true);
      }

      try {
        const latest = await clientProfileService.fetchProfile(user.idUser);
        setProfile(latest);
        setUser(latest);
        setError(null);
      } catch (err) {
        const statusCode = getStatusCode(err);
        // 403 indicates endpoint unavailable for current role, fallback silently to context data
        if (statusCode !== 403) {
          setError(ErrorUtils.getErrorMessage(err));
        }
      } finally {
        setLoading(false);
      }
    },
    [setUser, user],
  );

  const lastFetchedUserId = useRef<number | null>(null);

  useEffect(() => {
    if (!user) {
      lastFetchedUserId.current = null;
      return;
    }

    if (lastFetchedUserId.current === user.idUser) {
      return;
    }

    lastFetchedUserId.current = user.idUser;
    fetchProfile({ showLoader: true });
  }, [fetchProfile, user]);

  const onRefresh = useCallback(async () => {
    if (!user) {
      return;
    }

    setRefreshing(true);
    try {
      const latest = await clientProfileService.fetchProfile(user.idUser);
      setProfile(latest);
      setUser(latest);
      setError(null);
    } catch (err) {
      const statusCode = getStatusCode(err);
      if (statusCode !== 403) {
        setError(ErrorUtils.getErrorMessage(err));
      }
    } finally {
      setRefreshing(false);
    }
  }, [setUser, user]);

  const switchToTechnician = useCallback(async () => {
    await switchRole('TECNICO');
  }, [switchRole]);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return useMemo(
    () => ({
      profile,
      loading,
      error,
      refreshing,
      hasProfile: Boolean(profile),
      onRefresh,
      retry: fetchProfile,
      switchToTechnician,
      logout: handleLogout,
    }),
    [error, fetchProfile, handleLogout, loading, onRefresh, profile, refreshing, switchToTechnician],
  );
}
