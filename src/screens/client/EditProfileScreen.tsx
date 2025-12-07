import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { WIZARD_COLORS } from './request-wizard/WizardShared';

type Props = NativeStackNavigationProp<any>;

interface EditProfileScreenProps {
  navigation: Props;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { user, setUser } = useAuth();
  
  // Form state
  const [nombres, setNombres] = useState(user?.nombres || '');
  const [apellidos, setApellidos] = useState(user?.apellidos || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ nombres?: string; apellidos?: string }>({});

  // Get avatar letter
  const avatarLetter = nombres?.charAt(0).toUpperCase() || 'U';

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { nombres?: string; apellidos?: string } = {};
    
    if (!nombres.trim()) {
      newErrors.nombres = 'El nombre es requerido';
    }
    if (!apellidos.trim()) {
      newErrors.apellidos = 'El apellido es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Usuario no encontrado');
      return;
    }

    try {
      setIsLoading(true);

      // Update user in context (MVP: no backend call yet)
      const updatedUser = {
        ...user,
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
      };

      // TODO: Replace with backend API call when endpoint is available
      // const response = await updateUserService.updateProfile(updatedUser);
      // if (response.success) { ... }

      if (setUser) {
        setUser(updatedUser);
      }

      Alert.alert('Éxito', 'Cambios guardados correctamente', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar los cambios');
      console.error('[EditProfileScreen] Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile photo change (placeholder)
  const handleChangePhoto = () => {
    Alert.alert(
      'Cambiar foto',
      'Función disponible próximamente',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>

          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={handleChangePhoto}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.changePhotoButtonText}>Cambiar foto de perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Nombres Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nombres *</Text>
            <TextInput
              style={[
                styles.input,
                errors.nombres && styles.inputError,
              ]}
              placeholder="Tu nombre"
              placeholderTextColor={WIZARD_COLORS.textLight}
              value={nombres}
              onChangeText={(text) => {
                setNombres(text);
                if (errors.nombres) {
                  setErrors({ ...errors, nombres: undefined });
                }
              }}
              editable={!isLoading}
              maxLength={50}
            />
            {errors.nombres && (
              <Text style={styles.errorText}>{errors.nombres}</Text>
            )}
          </View>

          {/* Apellidos Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Apellidos *</Text>
            <TextInput
              style={[
                styles.input,
                errors.apellidos && styles.inputError,
              ]}
              placeholder="Tu apellido"
              placeholderTextColor={WIZARD_COLORS.textLight}
              value={apellidos}
              onChangeText={(text) => {
                setApellidos(text);
                if (errors.apellidos) {
                  setErrors({ ...errors, apellidos: undefined });
                }
              }}
              editable={!isLoading}
              maxLength={50}
            />
            {errors.apellidos && (
              <Text style={styles.errorText}>{errors.apellidos}</Text>
            )}
          </View>

          {/* Info Text */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Email, Cédula y Rol no pueden ser modificados desde aquí.
            </Text>
          </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsSection}>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator color={WIZARD_COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Guardar cambios</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WIZARD_COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },

  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: WIZARD_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: WIZARD_COLORS.white,
  },
  changePhotoButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: WIZARD_COLORS.white,
    borderWidth: 1,
    borderColor: WIZARD_COLORS.border,
  },
  changePhotoButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: WIZARD_COLORS.primary,
  },

  // Form Section
  formSection: {
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: WIZARD_COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: WIZARD_COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: WIZARD_COLORS.text,
    backgroundColor: WIZARD_COLORS.white,
  },
  inputError: {
    borderColor: WIZARD_COLORS.error,
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    fontSize: 12,
    color: WIZARD_COLORS.error,
    marginTop: 4,
  },

  // Info Box
  infoBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  infoText: {
    fontSize: 12,
    color: WIZARD_COLORS.textSecondary,
    lineHeight: 16,
  },

  // Buttons Section
  buttonsSection: {
    gap: 10,
  },
  saveButton: {
    backgroundColor: WIZARD_COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: WIZARD_COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: WIZARD_COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: WIZARD_COLORS.border,
  },
  cancelButtonText: {
    color: WIZARD_COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },

  bottomSpacer: {
    height: 20,
  },
});

export default EditProfileScreen;
