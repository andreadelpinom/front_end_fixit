import React from 'react';
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputSubmitEditingEventData,
  View,
} from 'react-native';
import { composerStyles as styles } from './ComposerSection.styles';
import { ThemedText } from '../../../../ui';
import { theme } from '../../../../theme';

type ComposerSectionProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  sending: boolean;
  disabled: boolean;
};

export const ComposerSection: React.FC<ComposerSectionProps> = ({
  value,
  onChangeText,
  onSend,
  sending,
  disabled,
}) => {
  const handleSubmitEditing = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    event.preventDefault();
    if (!disabled && !sending) {
      onSend();
    }
  };

  const handlePressSend = () => {
    if (!disabled && !sending) {
      onSend();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Describe tu problema..."
        placeholderTextColor={theme.colors.text.muted}
        editable={!disabled}
        multiline
        onSubmitEditing={handleSubmitEditing}
        returnKeyType="send"
        blurOnSubmit={false}
      />
      <Pressable
        onPress={handlePressSend}
        disabled={disabled || sending}
        style={({ pressed }) => [
          styles.sendButton,
          (disabled || sending) && styles.sendButtonDisabled,
          pressed && styles.sendButtonPressed,
        ]}
      >
        {sending ? (
          <ActivityIndicator color={theme.colors.text.inverse} style={styles.indicator} />
        ) : (
          <ThemedText style={styles.sendButtonText}>Enviar</ThemedText>
        )}
      </Pressable>
    </View>
  );
};
