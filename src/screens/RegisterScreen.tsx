import React, { useState } from 'react';
import {
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  View,
} from 'react-native';
import { authService } from '../services/auth.service';
import { createTechnician } from '../services/technician.service';
import { RegisterStyle } from 'styles';

type RolType = 'CLIENTE' | 'TECNICO';

export const RegisterScreen = ({ onBack }: { onBack: () => void }) => {
  const [form, setForm] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: '',
  });

  const [selectedRole, setSelectedRole] = useState<RolType>('CLIENTE');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleRegister = async () => {
    // Validación básica
    if (!form.cedula || !form.nombres || !form.apellidos || !form.email || !form.password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Crear usuario
      const userResponse = await authService.register({
        ...form,
        rol: selectedRole,
        emailVerificado: false,
        isActive: true,
      });

      // 2. Si es TÉCNICO, crear perfil de técnico
      if (selectedRole === 'TECNICO' && userResponse?.idUser) {
        try {
          await createTechnician(userResponse.idUser);
          Alert.alert(
            'Éxito', 
            'Usuario y perfil de técnico creados correctamente.\nAhora puedes iniciar sesión.'
          );
        } catch (techError: any) {
          Alert.alert(
            'Advertencia',
            `Usuario creado pero hubo un problema al crear el perfil de técnico: ${techError.message}`
          );
        }
      } else {
        Alert.alert('Éxito', 'Usuario creado correctamente.\nAhora puedes iniciar sesión.');
      }

      onBack();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo registrar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={RegisterStyle.container}>
      <Text style={RegisterStyle.title}>Crear cuenta</Text>

      {/* Selector de Rol */}
      <View style={RegisterStyle.roleContainer}>
        <Text style={RegisterStyle.roleLabel}>Registrarse como:</Text>
        <View style={RegisterStyle.roleButtons}>
          <TouchableOpacity
            style={[
              RegisterStyle.roleButton,
              selectedRole === 'CLIENTE' && RegisterStyle.roleButtonActive,
            ]}
            onPress={() => setSelectedRole('CLIENTE')}
            disabled={isLoading}
          >
            <Text
              style={[
                RegisterStyle.roleButtonText,
                selectedRole === 'CLIENTE' && RegisterStyle.roleButtonTextActive,
              ]}
            >
              👤 Cliente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              RegisterStyle.roleButton,
              selectedRole === 'TECNICO' && RegisterStyle.roleButtonActive,
            ]}
            onPress={() => setSelectedRole('TECNICO')}
            disabled={isLoading}
          >
            <Text
              style={[
                RegisterStyle.roleButtonText,
                selectedRole === 'TECNICO' && RegisterStyle.roleButtonTextActive,
              ]}
            >
              🔧 Técnico
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Campos del formulario */}
      <TextInput
        style={RegisterStyle.input}
        placeholder="Cédula"
        value={form.cedula}
        onChangeText={text => handleChange('cedula', text)}
        keyboardType="numeric"
        maxLength={10}
        editable={!isLoading}
      />

      <TextInput
        style={RegisterStyle.input}
        placeholder="Nombres"
        value={form.nombres}
        onChangeText={text => handleChange('nombres', text)}
        editable={!isLoading}
      />

      <TextInput
        style={RegisterStyle.input}
        placeholder="Apellidos"
        value={form.apellidos}
        onChangeText={text => handleChange('apellidos', text)}
        editable={!isLoading}
      />

      <TextInput
        style={RegisterStyle.input}
        placeholder="Email"
        value={form.email}
        onChangeText={text => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />

      <TextInput
        style={RegisterStyle.input}
        placeholder="Teléfono"
        value={form.telefono}
        onChangeText={text => handleChange('telefono', text)}
        keyboardType="phone-pad"
        editable={!isLoading}
      />

      <TextInput
        style={RegisterStyle.input}
        placeholder="Contraseña"
        value={form.password}
        onChangeText={text => handleChange('password', text)}
        secureTextEntry
        editable={!isLoading}
      />

      <TouchableOpacity 
        style={[
          RegisterStyle.button,
          isLoading && RegisterStyle.buttonDisabled
        ]} 
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={RegisterStyle.buttonText}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onBack} disabled={isLoading}>
        <Text style={RegisterStyle.link}>Volver al login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};