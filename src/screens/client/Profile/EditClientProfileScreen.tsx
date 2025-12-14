import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { editProfileStyles } from './EditProfileScreen.styles';
import { useEditClientProfile } from './hooks/useEditClientProfile';
import { ThemedText } from '../../../ui';
import { theme } from '../../../theme';
import { ClientProfileStackParamList } from '../../../navigation/types';

export type EditClientProfileScreenProps = NativeStackScreenProps<
  ClientProfileStackParamList,
  'EditProfile'
>;

export function EditClientProfileScreen({ navigation }: EditClientProfileScreenProps) {
  const {
    nombres,
    apellidos,
    errors,
    saving,
    submissionError,
    canSubmit,
    handleNameChange,
    handleLastnameChange,
    submit,
  } = useEditClientProfile();

  const avatarLetter = useMemo(() => {
    const name = nombres?.trim() || apellidos?.trim();
    return name ? name.charAt(0).toUpperCase() : 'U';
  }, [apellidos, nombres]);

  const handleSave = async () => {
    const result = await submit();

    switch (result.status) {
      case 'INVALID_FORM':
        return;
      case 'REMOTE_SUCCESS':
        Alert.alert('Perfil actualizado', 'Tus datos fueron actualizados correctamente.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
        break;
      case 'LOCAL_FALLBACK':
        Alert.alert(
          'Cambios guardados',
          'Guardamos los cambios localmente. Se sincronizarán cuando el servicio esté disponible.',
          [
            {
              text: 'Entendido',
              onPress: () => navigation.goBack(),
            },
          ],
        );
        break;
      case 'ERROR':
        Alert.alert('No pudimos guardar tus cambios', result.message);
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={editProfileStyles.safeArea}>
      <ScrollView
        style={editProfileStyles.scroll}
        contentContainerStyle={editProfileStyles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={editProfileStyles.avatarContainer}>
          <View style={editProfileStyles.avatar}>
            <ThemedText variant="heading" color="inverse" style={editProfileStyles.avatarLetter}>
              {avatarLetter}
            </ThemedText>
          </View>
          <ThemedText variant="caption" color="muted" style={editProfileStyles.hintText}>
            Próximamente podrás personalizar tu foto de perfil.
          </ThemedText>
        </View>

        <View style={editProfileStyles.form}>
          <View style={editProfileStyles.field}>
            <ThemedText variant="caption" color="secondary" style={editProfileStyles.label}>
              Nombres
            </ThemedText>
            <TextInput
              value={nombres}
              onChangeText={handleNameChange}
              placeholder="Ingresa tus nombres"
              placeholderTextColor={theme.colors.text.muted}
              style={[
                editProfileStyles.input,
                errors.nombres && editProfileStyles.inputError,
              ]}
              autoCapitalize="words"
              editable={!saving}
              maxLength={60}
              returnKeyType="next"
            />
            {errors.nombres ? (
              <ThemedText variant="caption" style={editProfileStyles.errorText}>
                {errors.nombres}
              </ThemedText>
            ) : null}
          </View>

          <View style={editProfileStyles.field}>
            <ThemedText variant="caption" color="secondary" style={editProfileStyles.label}>
              Apellidos
            </ThemedText>
            <TextInput
              value={apellidos}
              onChangeText={handleLastnameChange}
              placeholder="Ingresa tus apellidos"
              placeholderTextColor={theme.colors.text.muted}
              style={[
                editProfileStyles.input,
                errors.apellidos && editProfileStyles.inputError,
              ]}
              autoCapitalize="words"
              editable={!saving}
              maxLength={60}
              returnKeyType="done"
            />
            {errors.apellidos ? (
              <ThemedText variant="caption" style={editProfileStyles.errorText}>
                {errors.apellidos}
              </ThemedText>
            ) : null}
          </View>
        </View>

        {submissionError ? (
          <View style={editProfileStyles.submissionError}>
            <ThemedText variant="body" style={editProfileStyles.errorText}>
              {submissionError}
            </ThemedText>
          </View>
        ) : null}

        <View style={editProfileStyles.footer}>
          <Pressable
            onPress={handleSave}
            disabled={!canSubmit}
            style={[editProfileStyles.primaryButton, !canSubmit && editProfileStyles.primaryButtonDisabled]}
            accessibilityRole="button"
          >
            {saving ? (
              <ActivityIndicator color={theme.colors.text.inverse} />
            ) : (
              <ThemedText variant="body" color="inverse" style={editProfileStyles.primaryButtonLabel}>
                Guardar cambios
              </ThemedText>
            )}
          </Pressable>

          <Pressable
            onPress={() => navigation.goBack()}
            disabled={saving}
            style={editProfileStyles.secondaryButton}
            accessibilityRole="button"
          >
            <ThemedText variant="body" style={editProfileStyles.secondaryButtonLabel}>
              Cancelar
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default EditClientProfileScreen;
