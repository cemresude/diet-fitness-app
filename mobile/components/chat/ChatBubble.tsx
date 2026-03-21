import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';
import { ChatMessage, BOT_USER } from '../../types/chat';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isBot = message.user._id === BOT_USER._id;
  
  return (
    <View
      style={[
        styles.container,
        isBot ? styles.containerBot : styles.containerUser,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isBot ? styles.bubbleBot : styles.bubbleUser,
        ]}
      >
        <Text
          style={[
            styles.text,
            isBot ? styles.textBot : styles.textUser,
          ]}
        >
          {message.text}
        </Text>
      </View>
      <Text style={styles.time}>
        {new Date(message.createdAt).toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 12,
    maxWidth: '80%',
  },
  containerBot: {
    alignSelf: 'flex-start',
  },
  containerUser: {
    alignSelf: 'flex-end',
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  bubbleBot: {
    backgroundColor: COLORS.chatBubbleBot,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bubbleUser: {
    backgroundColor: COLORS.chatBubbleUser,
    borderBottomRightRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  textBot: {
    color: COLORS.text,
  },
  textUser: {
    color: COLORS.textLight,
  },
  time: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginHorizontal: 4,
  },
});

export default ChatBubble;
