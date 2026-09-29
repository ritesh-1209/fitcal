import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import { BudgetMealOption } from '../types';
import { api } from '../services/api';

export const BudgetMealsScreen: React.FC = () => {
  const [budget, setBudget] = useState<number>(75);
  const [diet, setDiet] = useState<string>('vegetarian');
  const [mealType, setMealType] = useState<string>('any');
  const [options, setOptions] = useState<BudgetMealOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const budgetTiers = [50, 75, 100, 150];

  const fetchOptions = async (selectedBudget: number, selectedDiet: string, selectedType: string) => {
    setLoading(true);
    try {
      const res = await api.getBudgetMealRecommendations(selectedBudget, selectedDiet, selectedType);
      setOptions(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions(budget, diet, mealType);
  }, [budget, diet, mealType]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>AI Budget Meal Planner 💰</Text>
      <Text style={styles.subtitle}>SmartCal calculates what you can eat NEXT based on your remaining calories, protein goal & available money.</Text>

      {/* Budget Tier Selector */}
      <Text style={styles.filterLabel}>Available Budget (INR ₹)</Text>
      <View style={styles.chipRow}>
        {budgetTiers.map((b) => (
          <TouchableOpacity
            key={b}
            style={[styles.chip, budget === b && styles.activeChip]}
            onPress={() => setBudget(b)}
          >
            <Text style={[styles.chipText, budget === b && styles.activeChipText]}>₹{b}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Diet Filter */}
      <Text style={styles.filterLabel}>Diet Preference</Text>
      <View style={styles.chipRow}>
        {['vegetarian', 'vegan', 'eggitarian', 'non-vegetarian'].map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.chip, diet === d && styles.activeChip]}
            onPress={() => setDiet(d)}
          >
            <Text style={[styles.chipText, diet === d && styles.activeChipText]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recommended Meal Cards */}
      <Text style={styles.sectionHeader}>RECOMMENDED MEALS (RANKED BY PROTEIN / ₹)</Text>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 30 }} />
      ) : (
        options.map((opt) => (
          <View key={opt.id} style={styles.mealCard}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mealTitle}>{opt.title}</Text>
                <Text style={styles.prepText}>⏱ {opt.prep_complexity}</Text>
              </View>
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>Est. ₹{opt.estimated_cost_inr}</Text>
              </View>
            </View>

            {/* Macro Pills */}
            <View style={styles.macroPillRow}>
              <View style={[styles.macroPill, { backgroundColor: Colors.primaryGlow, borderColor: Colors.primary }]}>
                <Text style={[styles.macroPillText, { color: Colors.primary }]}>{opt.estimated_calories} kcal</Text>
              </View>
              <View style={[styles.macroPill, { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: Colors.secondary }]}>
                <Text style={[styles.macroPillText, { color: Colors.secondary }]}>{opt.estimated_protein_g}g Protein</Text>
              </View>
              <View style={[styles.macroPill, { backgroundColor: Colors.inputBg, borderColor: Colors.inputBorder }]}>
                <Text style={styles.macroPillText}>{opt.estimated_carbs_g}g Carbs</Text>
              </View>
            </View>

            {/* Ingredients Breakdown */}
            <Text style={styles.ingrHeader}>INGREDIENTS:</Text>
            {opt.items.map((it, i) => (
              <Text key={i} style={styles.ingrLine}>• {it.name} ({it.quantity} {it.unit}) - ₹{it.cost}</Text>
            ))}

            {/* AI Explanation Banner */}
            {opt.ai_explanation && (
              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>💡 Why this recommendation?</Text>
                <Text style={styles.explanationBody}>{opt.ai_explanation}</Text>
              </View>
            )}

            {/* Source & Date Footer */}
            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>Prices checked: {opt.price_checked_date}</Text>
              <Text style={styles.footerText}>Sources: {opt.sources.join(', ')}</Text>
            </View>
          </View>
        ))
      )}
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
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
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
    backgroundColor: Colors.purple,
    borderColor: Colors.purple,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  activeChipText: {
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginTop: 10,
    marginBottom: 14,
  },
  mealCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  prepText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  priceBadge: {
    backgroundColor: Colors.primaryGlow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  priceText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  macroPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  macroPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  macroPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  ingrHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  ingrLine: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  explanationBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.purple,
  },
  explanationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.purple,
    marginBottom: 4,
  },
  explanationBody: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  cardFooter: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  footerText: {
    fontSize: 10,
    color: Colors.textMuted,
  }
});
