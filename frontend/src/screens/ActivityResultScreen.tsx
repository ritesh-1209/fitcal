import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { ActivityResult } from '../types';

interface ActivityResultScreenProps {
  result: ActivityResult;
  onDone: () => void;
}

export const ActivityResultScreen: React.FC<ActivityResultScreenProps> = ({ result, onDone }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.badge}>🔥 ACTIVITY LOGGED</Text>
        <Text style={styles.activityName}>{result.activity_type.toUpperCase()}</Text>
        <Text style={styles.subText}>{result.duration_minutes} mins ({result.intensity} intensity)</Text>

        <View style={styles.burnedContainer}>
          <Text style={styles.burnedVal}>{result.calories_burned}</Text>
          <Text style={styles.burnedSub}>ESTIMATED KCAL BURNED</Text>
        </View>

        <Text style={styles.disclaimer}>{result.disclaimer}</Text>

        <TouchableOpacity style={styles.doneBtn} onPress={onDone}>
          <Text style={styles.doneBtnText}>Back to Dashboard →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  badge: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  activityName: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  subText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  burnedContainer: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: 16,
  },
  burnedVal: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.accent,
  },
  burnedSub: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.8,
    marginTop: 4,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  doneBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  doneBtnText: {
    color: Colors.bgDark,
    fontSize: 16,
    fontWeight: '800',
  }
});
