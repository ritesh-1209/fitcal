import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onGoToRegister }) => {
  const [email, setEmail] = useState('ritesh@example.com');
  const [password, setPassword] = useState('password123');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back ⚡</Text>
      <Text style={styles.subtitle}>Sign in to access your daily targets & budget meal logs.</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="email@example.com" placeholderTextColor={Colors.textMuted} autoCapitalize="none" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" placeholderTextColor={Colors.textMuted} />
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={onLoginSuccess}>
        <Text style={styles.loginBtnText}>Sign In →</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkBtn} onPress={onGoToRegister}>
        <Text style={styles.linkText}>Don't have an account? <Text style={{ color: Colors.primary }}>Create one</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  loginBtnText: {
    color: Colors.bgDark,
    fontSize: 16,
    fontWeight: '800',
  },
  linkBtn: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    color: Colors.textSecondary,
    fontSize: 14,
  }
});
