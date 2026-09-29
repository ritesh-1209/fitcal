import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

export type ScreenName =
  | 'Dashboard'
  | 'AddMeal'
  | 'AddActivity'
  | 'BudgetMeals'
  | 'Progress'
  | 'AICompanion'
  | 'Profile'
  | 'Onboarding'
  | 'Login'
  | 'Register'
  | 'Settings';

interface NavigationTabProps {
  currentScreen: ScreenName;
  onSelectScreen: (screen: ScreenName) => void;
}

export const NavigationTab: React.FC<NavigationTabProps> = ({ currentScreen, onSelectScreen }) => {
  const tabs: Array<{ name: ScreenName; label: string; icon: string }> = [
    { name: 'Dashboard', label: 'Home', icon: '🏠' },
    { name: 'AddMeal', label: 'Add Food', icon: '🥗' },
    { name: 'BudgetMeals', label: 'Budget', icon: '💰' },
    { name: 'AICompanion', label: 'AI Coach', icon: '🤖' },
    { name: 'Progress', label: 'Progress', icon: '📈' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => onSelectScreen(tab.name)}
          >
            <Text style={[styles.icon, isActive && styles.activeIcon]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: Colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 4,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.6,
  },
  activeIcon: {
    opacity: 1.0,
    transform: [{ scale: 1.15 }],
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  activeLabel: {
    color: Colors.primary,
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 3,
  }
});
