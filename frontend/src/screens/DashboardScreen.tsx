import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { DashboardSummary } from '../types';
import { CalorieCard } from '../components/CalorieCard';
import { MacroBar } from '../components/MacroBar';
import { ScreenName } from '../components/NavigationTab';

interface DashboardScreenProps {
  summary: DashboardSummary;
  onNavigate: (screen: ScreenName) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ summary, onNavigate }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Calorie Overview Gauge */}
      <CalorieCard
        consumed={summary.consumed_calories}
        target={summary.target_calories}
        burned={summary.burned_calories}
        remaining={summary.remaining_calories}
      />

      {/* AI Suggestion Insight Banner */}
      <TouchableOpacity style={styles.aiCard} onPress={() => onNavigate('BudgetMeals')}>
        <View style={styles.aiHeader}>
          <Text style={styles.aiBadge}>🤖 SmartCal AI Insight</Text>
        </View>
        <Text style={styles.aiHeadline}>{summary.ai_insight_headline}</Text>
        <Text style={styles.aiAction}>Tap to view budget meal options →</Text>
      </TouchableOpacity>

      {/* Macronutrient Breakdown */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>MACRONUTRIENT TARGETS</Text>
        <MacroBar label="Protein" consumed={summary.consumed_protein_g} target={summary.target_protein_g} color={Colors.proteinBar} />
        <MacroBar label="Carbohydrates" consumed={summary.consumed_carbs_g} target={summary.target_carbs_g} color={Colors.carbsBar} />
        <MacroBar label="Fat" consumed={summary.consumed_fat_g} target={summary.target_fat_g} color={Colors.fatBar} />
      </View>

      {/* Budget & Activity Quick Cards */}
      <View style={styles.gridRow}>
        {/* Budget Card */}
        <View style={[styles.gridCard, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.gridLabel}>TODAY'S BUDGET</Text>
          <Text style={styles.gridValue}>₹{Math.round(summary.remaining_budget_inr)}</Text>
          <Text style={styles.gridSub}>Remaining of ₹{Math.round(summary.daily_budget_inr)}</Text>
        </View>

        {/* Activity Card */}
        <View style={[styles.gridCard, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.gridLabel}>ACTIVITY BURN</Text>
          <Text style={[styles.gridValue, { color: Colors.accent }]}>{Math.round(summary.burned_calories)} kcal</Text>
          <Text style={styles.gridSub}>Estimated MET expenditure</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionGrid}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.primary }]} onPress={() => onNavigate('AddMeal')}>
          <Text style={styles.actionBtnText}>🥗 Add Meal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.secondary }]} onPress={() => onNavigate('AddActivity')}>
          <Text style={styles.actionBtnText}>🔥 Add Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.purple }]} onPress={() => onNavigate('BudgetMeals')}>
          <Text style={styles.actionBtnText}>💰 Budget Meals</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.cardBgHover, borderWidth: 1, borderColor: Colors.cardBorder }]} onPress={() => onNavigate('AICompanion')}>
          <Text style={[styles.actionBtnText, { color: Colors.textPrimary }]}>💬 Chat AI</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },
  aiCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  aiHeader: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  aiBadge: {
    color: Colors.purple,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  aiHeadline: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 8,
  },
  aiAction: {
    color: Colors.purple,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  gridRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 6,
  },
  gridCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  gridValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.purple,
  },
  gridSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: Colors.bgDark,
    fontSize: 15,
    fontWeight: '800',
  }
});
