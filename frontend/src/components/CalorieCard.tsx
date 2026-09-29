import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface CalorieCardProps {
  consumed: number;
  target: number;
  burned: number;
  remaining: number;
}

export const CalorieCard: React.FC<CalorieCardProps> = ({ consumed, target, burned, remaining }) => {
  const percentage = Math.min(100, Math.round((consumed / (target || 1)) * 100));

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>TODAY'S CALORIES</Text>
      
      <View style={styles.mainRow}>
        <View style={styles.calBigContainer}>
          <Text style={styles.bigCal}>{Math.round(consumed)}</Text>
          <Text style={styles.targetSub}>/ {Math.round(target)} kcal</Text>
        </View>

        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{percentage}% of Target</Text>
          </View>
        </View>
      </View>

      {/* Progress Line */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Remaining</Text>
          <Text style={[styles.metricValue, { color: Colors.primary }]}>{Math.round(remaining)} kcal</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Activity Burned</Text>
          <Text style={[styles.metricValue, { color: Colors.accent }]}>{Math.round(burned)} kcal</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  calBigContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bigCal: {
    fontSize: 38,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  targetSub: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 6,
    fontWeight: '600',
  },
  badgeContainer: {
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: Colors.primaryGlow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    height: 10,
    backgroundColor: Colors.inputBg,
    borderRadius: 5,
    marginVertical: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 4,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.cardBorder,
  }
});
