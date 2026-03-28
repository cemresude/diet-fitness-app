import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ChatScreen } from '../../components/chat';
import { COLORS } from '../../utils/constants';

export default function ChatTab() {
  return (
    <SafeAreaView style={styles.container}>
      <ChatScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.chatBackground,
  },
});
