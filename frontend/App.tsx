import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Colors } from './src/theme/colors';
import { UserProfile, DashboardSummary, MealParseResponse, ActivityResult } from './src/types';
import { api } from './src/services/api';

import { Header } from './src/components/Header';
import { NavigationTab, ScreenName } from './src/components/NavigationTab';

import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { AddMealScreen } from './src/screens/AddMealScreen';
import { MealResultScreen } from './src/screens/MealResultScreen';
import { AddActivityScreen } from './src/screens/AddActivityScreen';
import { ActivityResultScreen } from './src/screens/ActivityResultScreen';
import { BudgetMealsScreen } from './src/screens/BudgetMealsScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { AICompanionScreen } from './src/screens/AICompanionScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName | 'Splash' | 'MealResult' | 'ActivityResult'>('Splash');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [pendingMealParse, setPendingMealParse] = useState<MealParseResponse | null>(null);
  const [pendingActivityResult, setPendingActivityResult] = useState<ActivityResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshDashboard = async () => {
    try {
      const summary = await api.getDashboard();
      setDashboardSummary(summary);
      const prof = await api.getProfile();
      setProfile(prof);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await refreshDashboard();
      setLoading(false);
    };
    loadInitialData();
  }, []);

  const handleOnboardingComplete = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    await api.updateProfile(newProfile);
    await refreshDashboard();
    setCurrentScreen('Dashboard');
  };

  const handleMealParseSuccess = (parseRes: MealParseResponse) => {
    setPendingMealParse(parseRes);
    setCurrentScreen('MealResult');
  };

  const handleMealLogged = async () => {
    await refreshDashboard();
    setCurrentScreen('Dashboard');
  };

  const handleActivityLogged = async (res: ActivityResult) => {
    setPendingActivityResult(res);
    await refreshDashboard();
    setCurrentScreen('ActivityResult');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Standalone screen views without standard nav tabs
  if (currentScreen === 'Splash') {
    return <SplashScreen onFinish={() => setCurrentScreen('Onboarding')} />;
  }

  if (currentScreen === 'Onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (currentScreen === 'Login') {
    return <LoginScreen onLoginSuccess={() => setCurrentScreen('Dashboard')} onGoToRegister={() => setCurrentScreen('Register')} />;
  }

  if (currentScreen === 'Register') {
    return <RegisterScreen onRegisterSuccess={() => setCurrentScreen('Onboarding')} onGoToLogin={() => setCurrentScreen('Login')} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      
      {/* App Header */}
      <Header
        userName={profile?.name || 'Ritesh'}
        onPressProfile={() => setCurrentScreen('Profile')}
      />

      {/* Screen Body */}
      <View style={styles.screenContainer}>
        {currentScreen === 'Dashboard' && dashboardSummary && (
          <DashboardScreen summary={dashboardSummary} onNavigate={(scr) => setCurrentScreen(scr)} />
        )}

        {currentScreen === 'AddMeal' && (
          <AddMealScreen onParseSuccess={handleMealParseSuccess} />
        )}

        {currentScreen === 'MealResult' && pendingMealParse && (
          <MealResultScreen
            parseResult={pendingMealParse}
            onLoggedSuccess={handleMealLogged}
            onBack={() => setCurrentScreen('AddMeal')}
          />
        )}

        {currentScreen === 'AddActivity' && (
          <AddActivityScreen onActivityLogged={handleActivityLogged} />
        )}

        {currentScreen === 'ActivityResult' && pendingActivityResult && (
          <ActivityResultScreen
            result={pendingActivityResult}
            onDone={() => setCurrentScreen('Dashboard')}
          />
        )}

        {currentScreen === 'BudgetMeals' && (
          <BudgetMealsScreen />
        )}

        {currentScreen === 'Progress' && (
          <ProgressScreen />
        )}

        {currentScreen === 'AICompanion' && (
          <AICompanionScreen />
        )}

        {currentScreen === 'Profile' && profile && (
          <ProfileScreen profile={profile} onEditOnboarding={() => setCurrentScreen('Onboarding')} />
        )}

        {currentScreen === 'Settings' && (
          <SettingsScreen onLogout={() => setCurrentScreen('Login')} />
        )}
      </View>

      {/* Bottom Tab Navigation */}
      <NavigationTab
        currentScreen={typeof currentScreen === 'string' && ['Dashboard', 'AddMeal', 'BudgetMeals', 'AICompanion', 'Progress'].includes(currentScreen) ? currentScreen as ScreenName : 'Dashboard'}
        onSelectScreen={(screen) => setCurrentScreen(screen)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    flex: 1,
  }
});
