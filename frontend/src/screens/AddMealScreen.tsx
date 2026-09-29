import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import { MealParseResponse } from '../types';
import { api } from '../services/api';

interface AddMealScreenProps {
  onParseSuccess: (result: MealParseResponse) => void;
}

export const AddMealScreen: React.FC<AddMealScreenProps> = ({ onParseSuccess }) => {
  const [text, setText] = useState('3 rotis, 1 bowl yellow dal and 250ml milk');
  const [loading, setLoading] = useState(false);

  const quickSamples = [
    '3 rotis and 1 bowl yellow dal',
    '150g rice + 100g rajma',
    '2 bananas and 50g roasted chana',
    '50g soy chunks and 200g cooked rice',
    '3 whole boiled eggs and 2 toast'
  ];

  const handleParse = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await api.parseMealText(text);
      onParseSuccess(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Natural AI Meal Logger 🥗</Text>
      <Text style={styles.subTitle}>Type what you ate in natural plain English or Hindi names. Gemini AI will convert it to exact nutrition items.</Text>

      {/* Main Natural Language Text Box */}
      <View style={styles.inputCard}>
        <TextInput
          style={styles.textArea}
          value={text}
          onChangeText={setText}
          placeholder="e.g. 3 rotis, 1 bowl dal, 250ml milk"
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.parseBtn} onPress={handleParse} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.bgDark} />
          ) : (
            <Text style={styles.parseBtnText}>⚡ AI Calculate Nutrition →</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Meal Samples */}
      <Text style={styles.sampleTitle}>Or tap a common sample:</Text>
      <View style={styles.sampleContainer}>
        {quickSamples.map((sample, idx) => (
          <TouchableOpacity key={idx} style={styles.sampleChip} onPress={() => setText(sample)}>
            <Text style={styles.sampleText}>{sample}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 24,
  },
  textArea: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 14,
    color: Colors.textPrimary,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  parseBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  parseBtnText: {
    color: Colors.bgDark,
    fontSize: 16,
    fontWeight: '800',
  },
  sampleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 12,
  },
  sampleContainer: {
    gap: 10,
  },
  sampleChip: {
    backgroundColor: Colors.cardBg,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  sampleText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  }
});
