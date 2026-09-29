import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Colors } from '../theme/colors';

interface SettingsScreenProps {
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onLogout }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>App Settings ⚙️</Text>

      <View style={styles.card}>
        <Text style={styles.cardHeader}>PREFERENCES</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch value={true} trackColor={{ false: Colors.inputBg, true: Colors.primary }} />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Daily Reminders</Text>
          <Switch value={true} trackColor={{ false: Colors.inputBg, true: Colors.primary }} />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Show Indian Market Prices</Text>
          <Switch value={true} trackColor={{ false: Colors.inputBg, true: Colors.primary }} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardHeader}>ABOUT SMARTCAL MVP</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoVal}>1.0.0 (Zero-Cost Free Tier Build)</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>BMR Equation</Text>
          <Text style={styles.infoVal}>Mifflin-St Jeor (Deterministic)</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>AI Model</Text>
          <Text style={styles.infoVal}>Google Gemini API (Free Tier)</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutBtnText}>Log Out</Text>
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
    marginBottom: 20,
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  settingText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.rose,
    marginTop: 10,
  },
  logoutBtnText: {
    color: Colors.rose,
    fontWeight: '800',
  }
});
