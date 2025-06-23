import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

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
    >
      <Ionicons name="person-circle" size={35} color="#888" />
    </TouchableOpacity>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerRight: () => <HeaderRightUserIcon />,
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
        <Stack.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Perfil' }} />
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
