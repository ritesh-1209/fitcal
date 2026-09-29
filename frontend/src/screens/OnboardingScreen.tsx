import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { UserProfile } from '../types';

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState('Ritesh');
  const [age, setAge] = useState('24');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('72');
  const [goal, setGoal] = useState<'weight_loss' | 'maintenance' | 'weight_gain'>('weight_loss');
  const [activity, setActivity] = useState<'sedentary' | 'light' | 'moderate' | 'very_active'>('light');
  const [diet, setDiet] = useState<'vegetarian' | 'vegan' | 'eggitarian' | 'non-vegetarian'>('vegetarian');
  const [budget, setBudget] = useState('100');

  const handleSubmit = () => {
    const profile: UserProfile = {
      user_id: 'user_123',
      name: name || 'Fitness Enthusiast',
      age: parseInt(age) || 24,
      sex,
      height_cm: parseFloat(height) || 175,
      weight_kg: parseFloat(weight) || 70,
      activity_level: activity,
      goal,
      dietary_preference: diet,
      daily_budget_inr: parseFloat(budget) || 100,
      location: 'India'
    };
    onComplete(profile);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Personalize Your SmartCal Plan</Text>
      <Text style={styles.headerSub}>We use Mifflin-St Jeor equation to calculate your exact BMR and TDEE calorie requirements.</Text>

      {/* Name Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" placeholderTextColor={Colors.textMuted} />
      </View>

      {/* Age, Height, Weight Row */}
      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Age</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" placeholder="24" placeholderTextColor={Colors.textMuted} />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginHorizontal: 4 }]}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="numeric" placeholder="175" placeholderTextColor={Colors.textMuted} />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="72" placeholderTextColor={Colors.textMuted} />
        </View>
      </View>

      {/* Sex Selector */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sex (for BMR equation)</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity style={[styles.toggleBtn, sex === 'male' && styles.activeToggle]} onPress={() => setSex('male')}>
            <Text style={[styles.toggleText, sex === 'male' && styles.activeToggleText]}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, sex === 'female' && styles.activeToggle]} onPress={() => setSex('female')}>
            <Text style={[styles.toggleText, sex === 'female' && styles.activeToggleText]}>Female</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Goal Selector */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Primary Fitness Goal</Text>
        <View style={styles.toggleColumn}>
          {[
            { id: 'weight_loss', label: '🔥 Weight Loss (Modest Deficit ~450 kcal)' },
            { id: 'maintenance', label: '⚖️ Weight Maintenance (TDEE Balance)' },
            { id: 'weight_gain', label: '💪 Muscle / Weight Gain (+350 kcal Surplus)' }
          ].map((item) => (
            <TouchableOpacity key={item.id} style={[styles.optionCard, goal === item.id && styles.activeOptionCard]} onPress={() => setGoal(item.id as any)}>
              <Text style={[styles.optionText, goal === item.id && styles.activeOptionText]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Dietary Preference */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Dietary Preference</Text>
        <View style={styles.chipRow}>
          {['vegetarian', 'vegan', 'eggitarian', 'non-vegetarian'].map((d) => (
            <TouchableOpacity key={d} style={[styles.chip, diet === d && styles.activeChip]} onPress={() => setDiet(d as any)}>
              <Text style={[styles.chipText, diet === d && styles.activeChipText]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Daily Food Budget */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Daily Target Food Budget (INR ₹)</Text>
        <Text style={styles.subText}>Used by SmartCal AI to suggest affordable protein meals.</Text>
        <TextInput style={styles.input} value={budget} onChangeText={setBudget} keyboardType="numeric" placeholder="100" placeholderTextColor={Colors.textMuted} />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Calculate Plan & Launch →</Text>
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
    padding: 24,
    paddingBottom: 50,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  headerSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 8,
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
  row: {
    flexDirection: 'row',
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
    backgroundColor: Colors.primary,
  },
  toggleText: {
    color: Colors.textMuted,
    fontWeight: '600',
  },
  activeToggleText: {
    color: Colors.bgDark,
    fontWeight: '800',
  },
  toggleColumn: {
    gap: 8,
  },
  optionCard: {
    backgroundColor: Colors.cardBg,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  activeOptionCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.cardBgHover,
  },
  optionText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  activeOptionText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.inputBg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  activeChip: {
    backgroundColor: Colors.primaryGlow,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  activeChipText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitBtnText: {
    color: Colors.bgDark,
    fontSize: 16,
    fontWeight: '800',
  }
});
