import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { maestritoChatStyles as styles } from './MaestritoChatScreen.styles';
import { useMaestritoChat } from './useMaestritoChat';
import { MessageListSection } from './sections/MessageListSection';
import { ComposerSection } from './sections/ComposerSection';
import { EmptyStateSection } from './sections/EmptyStateSection';
import { ClientServicesStackParamList } from '../../../navigation/types';
import { ThemedText, ThemedView } from '../../../ui';
import { theme } from '../../../theme';

type Props = NativeStackScreenProps<ClientServicesStackParamList, 'MaestritoChat'>;

export const MaestritoChatScreen: React.FC<Props> = ({ navigation }) => {
  const [inputValue, setInputValue] = useState('');
  const {
    sessionId,
    loading,
    sending,
    typing,
    messages,
    error,
    maestritoError,
    isCompleted,
    createdSolicitudId,
    sendMessage,
    retry,
    endChat,
  } = useMaestritoChat();

  const handleEndChat = useCallback(() => {
    const close = () => {
      endChat().finally(() => {
        navigation.goBack();
      });
    };

    if (messages.length === 0 || isCompleted) {
      close();
      return;
    }

    Alert.alert(
      'Cerrar chat',
      '¿Deseas finalizar la conversación con Maestrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Finalizar', style: 'destructive', onPress: close },
      ],
    );
  }, [endChat, isCompleted, messages.length, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Chat con Maestrito',
      headerRight: () => (
        <Pressable
          onPress={handleEndChat}
          style={({ pressed }) => [styles.headerAction, pressed && styles.headerActionPressed]}
        >
          <ThemedText variant="caption" color="inverse" style={styles.headerActionText}>
            Cerrar
          </ThemedText>
        </Pressable>
      ),
    });
  }, [handleEndChat, navigation]);

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }
    sendMessage(trimmed);
    setInputValue('');
  }, [inputValue, sendMessage]);

  const handleChangeText = useCallback((text: string) => {
    setInputValue(text);
  }, []);

  const handleRetry = useCallback(() => {
    retry();
  }, [retry]);

  const handleContinueWizard = useCallback(() => {
    endChat().finally(() => {
      navigation.navigate('CreateRequestStack');
    });
  }, [endChat, navigation]);

  const handleViewRequest = useCallback(() => {
    if (!createdSolicitudId) {
      return;
    }
    navigation.navigate('RequestDetails', { idSolicitud: createdSolicitudId });
  }, [createdSolicitudId, navigation]);

  const isComposerDisabled =
    !sessionId || loading || sending || isCompleted || Boolean(error);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <ThemedText color="muted" style={styles.loadingText}>
              Preparando a Maestrito...
            </ThemedText>
          </View>
        ) : (
          <>
            {error && (
              <View style={[styles.banner, styles.errorBanner]}>
                <ThemedText style={styles.bannerText}>{error}</ThemedText>
                <View style={styles.bannerActions}>
                  <Pressable
                    onPress={handleRetry}
                    style={({ pressed }) => [styles.bannerButton, pressed && styles.bannerButtonPressed]}
                  >
                    <ThemedText style={styles.bannerButtonText}>Reintentar</ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={handleContinueWizard}
                    style={({ pressed }) => [styles.bannerButton, pressed && styles.bannerButtonPressed]}
                  >
                    <ThemedText style={styles.bannerButtonText}>Continuar con wizard</ThemedText>
                  </Pressable>
                </View>
              </View>
            )}

            {maestritoError && !error && (
              <View style={[styles.banner, styles.warningBanner]}>
                <ThemedText style={styles.bannerText}>{maestritoError}</ThemedText>
                <View style={styles.bannerActions}>
                  <Pressable
                    onPress={handleContinueWizard}
                    style={({ pressed }) => [styles.bannerButton, pressed && styles.bannerButtonPressed]}
                  >
                    <ThemedText style={styles.bannerButtonText}>Continuar con wizard</ThemedText>
                  </Pressable>
                </View>
              </View>
            )}

            <View style={styles.listWrapper}>
              {messages.length === 0 ? (
                <EmptyStateSection onRetry={handleRetry} disabled={Boolean(error)} />
              ) : (
                <MessageListSection
                  messages={messages}
                  isTyping={typing}
                  showTypingIndicator={!isCompleted}
                />
              )}
            </View>

            {isCompleted && createdSolicitudId != null && (
              <View style={styles.completionCard}>
                <ThemedText style={styles.completionTitle}>¡Solicitud creada!</ThemedText>
                <ThemedText style={styles.completionDescription}>
                  Identificador #{createdSolicitudId}. Puedes revisar los detalles y gestionar la solicitud desde la vista principal.
                </ThemedText>
                <Pressable
                  onPress={handleViewRequest}
                  style={({ pressed }) => [styles.completionButton, pressed && styles.completionButtonPressed]}
                >
                  <ThemedText style={styles.completionButtonText}>Ver solicitud</ThemedText>
                </Pressable>
              </View>
            )}

            <ComposerSection
              value={inputValue}
              onChangeText={handleChangeText}
              onSend={handleSend}
              sending={sending}
              disabled={isComposerDisabled}
            />

            {isCompleted && (
              <ThemedText style={styles.disabledInputNotice}>
                La conversación se ha cerrado porque la solicitud fue creada.
              </ThemedText>
            )}
          </>
        )}
      </ThemedView>
    </SafeAreaView>
  );
};

export default MaestritoChatScreen;
