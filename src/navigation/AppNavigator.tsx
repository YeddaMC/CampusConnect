import React from 'react';
import { Alert, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import FeedNoticiasScreen from '../screens/FeedNoticiasScreen';
import FeedAnunciosScreen from '../screens/FeedAnunciosScreen';

import { MainTabsNavigationProp, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs({ navigation }: { navigation: MainTabsNavigationProp }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerRight: () => (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              Alert.alert(
                "Logout",
                "Tem certeza que deseja sair?",
                [
                  { text: "Cancelar", style: "cancel" },
                  { text: "Sair", onPress: () => navigation.replace('Login') }
                ]
              );
            }}
          >
            <Text style={styles.headerButtonText}>Logout</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tab.Screen name="Notícias" component={FeedNoticiasScreen} />
      <Tab.Screen name="Anúncios" component={FeedAnunciosScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 15,
    padding: 5,
  },
  headerButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
