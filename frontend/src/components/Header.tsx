import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';

interface HeaderProps {
  userName: string;
  onPressProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userName, onPressProfile }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.brand}>Smart<Text style={styles.brandAccent}>Cal</Text></Text>
        <Text style={styles.greeting}>Hello, {userName} 👋</Text>
      </View>
      <TouchableOpacity style={styles.avatarButton} onPress={onPressProfile}>
        <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.bgDark,
  },
  brand: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  brandAccent: {
    color: Colors.primary,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  }
});
