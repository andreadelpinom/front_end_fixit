import { User } from '../types';
import * as storage from '../shared/storage';

export interface IAuthService {
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export class AuthService implements IAuthService {
  private readonly storageKey = '@auth_user';

  async login(email: string, _password: string): Promise<User> {
    // Example API call
    // const response = await api.login(email, password);
    const user: User = { id: '1', name: email }; // mocked
    await storage.saveData(this.storageKey, user);
    return user;
  }

  async logout(): Promise<void> {
    await storage.removeData(this.storageKey);
  }

  async getCurrentUser(): Promise<User | null> {
    return storage.getData<User>(this.storageKey);
  }
}

export const authService = new AuthService();
