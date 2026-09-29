import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { MealParseResponse } from '../types';
import { api } from '../services/api';

interface MealResultScreenProps {
  parseResult: MealParseResponse;
  onLoggedSuccess: () => void;
  onBack: () => void;
}

export const MealResultScreen: React.FC<MealResultScreenProps> = ({ parseResult, onLoggedSuccess, onBack }) => {
  const [logging, setLogging] = useState(false);

  const handleConfirmLog = async () => {
    setLogging(true);
    try {
      await api.logMeal(parseResult);
      onLoggedSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setLogging(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Calculated Meal Breakdown 📊</Text>
      <Text style={styles.originalText}>"{parseResult.original_text}"</Text>

      {/* Summary Totals Card */}
      <View style={styles.summaryCard}>
        <View style={styles.mainTotalRow}>
          <Text style={styles.bigCal}>{Math.round(parseResult.total_calories)}</Text>
          <Text style={styles.calLabel}>kcal</Text>
        </View>

        <View style={styles.macroGrid}>
          <View style={styles.macroItem}>
            <Text style={styles.macroVal}>{parseResult.total_protein}g</Text>
            <Text style={styles.macroSub}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroVal}>{parseResult.total_carbs}g</Text>
            <Text style={styles.macroSub}>Carbs</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroVal}>{parseResult.total_fat}g</Text>
            <Text style={styles.macroSub}>Fat</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroVal}>₹{parseResult.total_cost_inr}</Text>
            <Text style={styles.macroSub}>Est. Cost</Text>
          </View>
        </View>
      </View>

      {/* Parsed Items List */}
      <Text style={styles.sectionHeader}>PARSED INGREDIENTS</Text>
      {parseResult.parsed_items.map((item, idx) => (
        <View key={idx} style={styles.itemRow}>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQty}>{item.quantity} {item.unit}</Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.itemCal}>{item.calories} kcal</Text>
            <Text style={styles.itemProtein}>{item.protein}g protein | ₹{item.estimated_cost_inr}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.disclaimer}>{parseResult.confidence_note}</Text>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onBack}>
          <Text style={styles.cancelBtnText}>Edit Text</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmLog} disabled={logging}>
          <Text style={styles.confirmBtnText}>Confirm & Log Meal →</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  originalText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 24,
    alignItems: 'center',
  },
  mainTotalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  bigCal: {
    fontSize: 46,
    fontWeight: '900',
    color: Colors.primary,
  },
  calLabel: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginLeft: 6,
    fontWeight: '700',
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  macroSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  itemRow: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  itemQty: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemCal: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  itemProtein: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  disclaimer: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginVertical: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: Colors.bgDark,
    fontWeight: '800',
  }
});
