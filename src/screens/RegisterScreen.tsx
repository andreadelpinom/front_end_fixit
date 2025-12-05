import React, { useState } from 'react';
import {
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { authService } from '../services/auth.service';
import { RegisterStyle } from 'styles';

export const RegisterScreen = ({ onBack }: { onBack: () => void }) => {
  const [form, setForm] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: '',
    rol: 'CLIENTE' as const,
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleRegister = async () => {
    try {
      await authService.register({
        ...form,
        emailVerificado: false,
        isActive: true,
      });

      Alert.alert('Éxito', 'Usuario creado correctamente');
      onBack();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo registrar');
    }
  };

  return (
    <ScrollView contentContainerStyle={RegisterStyle.container}>
      <Text style={RegisterStyle.title}>Crear cuenta</Text>

      {['cedula', 'nombres', 'apellidos', 'email', 'telefono', 'password'].map(
        field => (
          <TextInput
            key={field}
            style={RegisterStyle.input}
            placeholder={field}
            secureTextEntry={field === 'password'}
            onChangeText={text => handleChange(field, text)}
          />
        ),
      )}

      <TouchableOpacity style={RegisterStyle.button} onPress={handleRegister}>
        <Text style={RegisterStyle.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onBack}>
        <Text style={RegisterStyle.link}>Volver al login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
