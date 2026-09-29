import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import { ChatMessage } from '../types';
import { api } from '../services/api';

export const AICompanionScreen: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hi Ritesh! I'm your SmartCal AI Companion. I have real-time access to your daily logs, calorie targets, protein requirements, and food budget. Ask me anything!",
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'What should I eat under ₹80?',
    'How many calories do I have left?',
    'Why am I short on protein today?',
    'I burned 300 calories today, what should I eat?'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const reply = await api.sendAIChatMessage(query);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        timestamp: 'Just now',
        tools_called: ['get_today_summary', 'recommend_budget_meal']
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>SmartCal AI Companion 🤖</Text>
      <Text style={styles.headerSub}>Tool-aware AI fitness coach connected directly to your database logs.</Text>

      {/* Messages Scroll Area */}
      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.bubble,
              msg.sender === 'user' ? styles.userBubble : styles.aiBubble
            ]}
          >
            {msg.sender === 'ai' && (
              <Text style={styles.aiLabel}>🤖 SmartCal Assistant</Text>
            )}
            <Text style={[styles.msgText, msg.sender === 'user' && styles.userMsgText]}>{msg.text}</Text>
          </View>
        ))}

        {loading && (
          <View style={[styles.bubble, styles.aiBubble, { paddingVertical: 12 }]}>
            <ActivityIndicator color={Colors.purple} />
          </View>
        )}
      </ScrollView>

      {/* Quick Prompts */}
      <View style={styles.promptRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
          {quickPrompts.map((p, i) => (
            <TouchableOpacity key={i} style={styles.promptChip} onPress={() => handleSend(p)}>
              <Text style={styles.promptText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask AI coach a question..."
          placeholderTextColor={Colors.textMuted}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 12,
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: 18,
    padding: 14,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.purple,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.purple,
    marginBottom: 4,
  },
  msgText: {
    color: Colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  userMsgText: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  promptRow: {
    paddingVertical: 8,
    backgroundColor: Colors.bgDark,
  },
  promptChip: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  promptText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: Colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: Colors.purple,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  sendBtnText: {
    color: Colors.textPrimary,
    fontWeight: '800',
  }
});
