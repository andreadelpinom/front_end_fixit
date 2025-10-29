import { View, Text, Button } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { logout, user } = useAuth();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text>Perfil</Text>
      <Text>{user?.name}</Text>
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}
