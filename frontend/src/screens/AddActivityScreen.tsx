import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { ActivityResult } from '../types';
import { api } from '../services/api';

interface AddActivityScreenProps {
  onActivityLogged: (result: ActivityResult) => void;
}

export const AddActivityScreen: React.FC<AddActivityScreenProps> = ({ onActivityLogged }) => {
  const [selectedActivity, setSelectedActivity] = useState('walking');
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState('moderate');
  const [loading, setLoading] = useState(false);

  const activities = [
    { id: 'walking', label: '🚶 Walking' },
    { id: 'running', label: '🏃 Running' },
    { id: 'cycling', label: '🚴 Cycling' },
    { id: 'gym', label: '🏋️ Gym / Strength' },
    { id: 'swimming', label: '🏊 Swimming' },
    { id: 'yoga', label: '🧘 Yoga' },
    { id: 'badminton', label: '🏸 Badminton' },
    { id: 'cricket', label: '🏏 Cricket' },
    { id: 'football', label: '⚽ Football' },
    { id: 'stairs', label: '🪜 Stairs' }
  ];

  const handleCalculate = async () => {
    const durNum = parseFloat(duration) || 30;
    setLoading(true);
    try {
      const res = await api.logActivity(selectedActivity, durNum, intensity);
      onActivityLogged(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Manual Activity Logger 🔥</Text>
      <Text style={styles.subTitle}>Select your physical activity to calculate MET-based estimated calorie burn.</Text>

      {/* Activity Grid Selector */}
      <Text style={styles.label}>Select Activity</Text>
      <View style={styles.grid}>
        {activities.map((act) => (
          <TouchableOpacity
            key={act.id}
            style={[styles.actChip, selectedActivity === act.id && styles.activeActChip]}
            onPress={() => setSelectedActivity(act.id)}
          >
            <Text style={[styles.actChipText, selectedActivity === act.id && styles.activeActChipText]}>{act.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Duration */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="30"
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {/* Intensity Toggle */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Intensity Level</Text>
        <View style={styles.toggleRow}>
          {['light', 'moderate', 'vigorous'].map((lvl) => (
            <TouchableOpacity
              key={lvl}
              style={[styles.toggleBtn, intensity === lvl && styles.activeToggle]}
              onPress={() => setIntensity(lvl)}
            >
              <Text style={[styles.toggleText, intensity === lvl && styles.activeToggleText]}>{lvl}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleCalculate} disabled={loading}>
        <Text style={styles.submitBtnText}>Calculate & Log Activity →</Text>
      </TouchableOpacity>
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
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  actChip: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  activeActChip: {
    backgroundColor: Colors.primaryGlow,
    borderColor: Colors.primary,
  },
  actChipText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  activeActChipText: {
    color: Colors.primary,
    fontWeight: '800',
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeToggle: {
    backgroundColor: Colors.accent,
  },
  toggleText: {
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  activeToggleText: {
    color: Colors.bgDark,
    fontWeight: '800',
  },
  submitBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: Colors.bgDark,
    fontSize: 16,
    fontWeight: '800',
  }
});
