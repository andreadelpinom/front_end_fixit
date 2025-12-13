import React, { useEffect, useRef } from 'react';
import { FlatList, View } from 'react-native';
import { messageListStyles as styles } from './MessageListSection.styles';
import { MaestritoChatMessage } from '../../../../types/maestrito';
import { ThemedText } from '../../../../ui';

type MessageListSectionProps = {
  messages: MaestritoChatMessage[];
  isTyping: boolean;
  showTypingIndicator?: boolean;
};

export const MessageListSection: React.FC<MessageListSectionProps> = ({
  messages,
  isTyping,
  showTypingIndicator = true,
}) => {
  const listRef = useRef<FlatList<MaestritoChatMessage>>(null);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderItem = ({ item }: { item: MaestritoChatMessage }) => {
    const isUser = item.author === 'user';
    const rowStyle = [styles.messageRow];
    if (isUser) {
      rowStyle.push(styles.messageRowUser);
    }

    const bubbleStyle = [styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant];
    if (!isUser && item.responseType === 'SOLICITUD_CREATED') {
      bubbleStyle.push(styles.bubbleSuccess);
    }

    const textStyle = [styles.messageText, isUser ? styles.messageTextUser : styles.messageTextAssistant];
    if (!isUser && item.responseType === 'SOLICITUD_CREATED') {
      textStyle.push(styles.messageTextSuccess);
    }

    const shouldShowMissingFields =
      !isUser && item.responseType === 'WAITING_INPUT' && item.missingFields && item.missingFields.length > 0;

    return (
      <View style={rowStyle}>
        <View style={bubbleStyle}>
          <ThemedText style={textStyle}>{item.text}</ThemedText>
          {shouldShowMissingFields && (
            <ThemedText variant="caption" style={styles.missingFieldsText}>
              Me falta: {item.missingFields!.join(', ')}
            </ThemedText>
          )}
        </View>
      </View>
    );
  };

  const footerComponent = showTypingIndicator && isTyping
    ? (
      <View style={styles.typingContainer}>
        <ThemedText style={styles.typingText}>Maestrito está escribiendo…</ThemedText>
      </View>
    )
    : <View style={styles.typingSpacer} />;

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListFooterComponent={footerComponent}
      />
    </View>
  );
};
