type RoleType = 'CLIENTE' | 'TECNICO';

const listeners = new Set<(role: RoleType) => void>();

export function notifyRoleChange(role: RoleType): void {
  listeners.forEach(listener => {
    try {
      listener(role);
    } catch (error) {
      console.error('[roleChangeEmitter] Listener failed', error);
    }
  });
}

export function subscribeToRoleChange(listener: (role: RoleType) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
