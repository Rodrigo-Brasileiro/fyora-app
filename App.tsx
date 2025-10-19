import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AuthNavigator from './navigation/AuthNavigator';
import MainNavigator from './navigation/TabNavigator';
import { Colors } from './constants/Colors';

export default function App() {
  // 'false' para ver a tela de Login
  // 'true' para ver a navegação principal do app
  const userIsLoggedIn = true;

  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      {userIsLoggedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
