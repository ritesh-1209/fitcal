import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  profile: UserProfile;
  onEditOnboarding: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ profile, onEditOnboarding }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.location}>{profile.location} • {profile.sex.toUpperCase()}</Text>
      </View>

      {/* Info List */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>BODY METRICS & GOALS</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Age</Text>
          <Text style={styles.infoVal}>{profile.age} years</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Height & Weight</Text>
          <Text style={styles.infoVal}>{profile.height_cm} cm | {profile.weight_kg} kg</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Activity Level</Text>
          <Text style={styles.infoVal}>{profile.activity_level}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fitness Goal</Text>
          <Text style={[styles.infoVal, { color: Colors.primary }]}>{profile.goal.replace('_', ' ')}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Diet Preference</Text>
          <Text style={styles.infoVal}>{profile.dietary_preference}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Daily Target Budget</Text>
          <Text style={[styles.infoVal, { color: Colors.purple }]}>₹{profile.daily_budget_inr}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editBtn} onPress={onEditOnboarding}>
        <Text style={styles.editBtnText}>✏️ Edit Profile & Recalculate BMR</Text>
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
  avatarCard: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.cardBg,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  location: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 20,
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  infoVal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    textTransform: 'capitalize',
  },
  editBtn: {
    backgroundColor: Colors.inputBg,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  editBtnText: {
    color: Colors.textPrimary,
    fontWeight: '700',
  }
});
