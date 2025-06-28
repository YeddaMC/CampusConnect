// src/navigation/AppNavigator.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Importa MaterialCommunityIcons para os ícones das abas

import InicialScreen from '../screens/InicialScreen';
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import FeedNoticiasScreen from '../screens/FeedNoticiasScreen';
import FeedAnunciosScreen from '../screens/FeedAnunciosScreen';
import PerfilScreen from '../screens/PerfilScreen';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function HeaderRightUserIcon() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Perfil')}
      style={styles.headerButton}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="person-circle" size={35} color="#888" />
    </TouchableOpacity>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerRight: () => <HeaderRightUserIcon />,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Notícias') {
            // Ícone de jornal para a aba Notícias
            return <MaterialCommunityIcons name="newspaper" size={size} color={color} />;
          } else if (route.name === 'Anúncios') {
            // Ícone de megafone para a aba Anúncios
            return <MaterialCommunityIcons name="bullhorn" size={size} color={color} />;
          }
          return null;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Notícias" component={FeedNoticiasScreen} />
      <Tab.Screen name="Anúncios" component={FeedAnunciosScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicial" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicial" component={InicialScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} options={{ headerShown: true, title: 'Perfil' }} />
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
});
