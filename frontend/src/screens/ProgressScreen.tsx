import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';

export const ProgressScreen: React.FC = () => {
  const weeklyData = [
    { day: 'Mon', cal: 2150, protein: 110, spend: 65, weight: 72.8 },
    { day: 'Tue', cal: 2200, protein: 125, spend: 70, weight: 72.5 },
    { day: 'Wed', cal: 1950, protein: 95, spend: 55, weight: 72.3 },
    { day: 'Thu', cal: 2300, protein: 130, spend: 80, weight: 72.1 },
    { day: 'Fri', cal: 2100, protein: 115, spend: 68, weight: 72.0 }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Weekly Progress & Adherence 📈</Text>
      <Text style={styles.subtitle}>Track weight trends, protein consistency, and food expenditure over time.</Text>

      {/* Stats Summary Grid */}
      <View style={styles.gridRow}>
        <View style={[styles.statCard, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.statLabel}>CALORIE ADHERENCE</Text>
          <Text style={[styles.statValue, { color: Colors.primary }]}>94%</Text>
          <Text style={styles.statSub}>Avg 2,140 kcal/day</Text>
        </View>

        <View style={[styles.statCard, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.statLabel}>PROTEIN TARGET</Text>
          <Text style={[styles.statValue, { color: Colors.secondary }]}>88%</Text>
          <Text style={styles.statSub}>Avg 115g/day</Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={[styles.statCard, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.statLabel}>AVG DAILY SPEND</Text>
          <Text style={[styles.statValue, { color: Colors.purple }]}>₹67.6</Text>
          <Text style={styles.statSub}>Under ₹100 budget</Text>
        </View>

        <View style={[styles.statCard, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.statLabel}>WEIGHT TREND</Text>
          <Text style={[styles.statValue, { color: Colors.accent }]}>-0.8 kg</Text>
          <Text style={styles.statSub}>72.8 → 72.0 kg</Text>
        </View>
      </View>

      {/* Daily History Table */}
      <Text style={styles.sectionTitle}>5-DAY LOGGED HISTORY</Text>
      <View style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 1 }]}>Day</Text>
          <Text style={[styles.th, { flex: 1.2 }]}>Weight</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>Calories</Text>
          <Text style={[styles.th, { flex: 1.2 }]}>Protein</Text>
          <Text style={[styles.th, { flex: 1 }]}>Spend</Text>
        </View>

        {weeklyData.map((row, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={[styles.td, { flex: 1, fontWeight: '700' }]}>{row.day}</Text>
            <Text style={[styles.td, { flex: 1.2 }]}>{row.weight} kg</Text>
            <Text style={[styles.td, { flex: 1.5, color: Colors.primary }]}>{row.cal} kcal</Text>
            <Text style={[styles.td, { flex: 1.2, color: Colors.secondary }]}>{row.protein}g</Text>
            <Text style={[styles.td, { flex: 1, color: Colors.purple }]}>₹{row.spend}</Text>
          </View>
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
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '900',
  },
  statSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginTop: 16,
    marginBottom: 12,
  },
  tableCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  th: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  td: {
    fontSize: 13,
    color: Colors.textPrimary,
  }
});
