// src/navigation/AppNavigator.tsx
import { TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import FeedNoticiasScreen from '../screens/FeedNoticiasScreen';
import FeedAnunciosScreen from '../screens/FeedAnunciosScreen';
import PerfilScreen from '../screens/PerfilScreen';
import AuthGate from './AuthGate';
import InicialScreen from '../screens/InicialScreen';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, MainTabsParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

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

type TabRoute = keyof MainTabsParamList;

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: TabRoute } }) => ({
        headerShown: true,
        headerRight: () => <HeaderRightUserIcon />,
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          if (route.name === 'Notícias') {
            return <MaterialCommunityIcons name="newspaper" size={size} color={color} />;
          } else if (route.name === 'Anúncios') {
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
        <Stack.Screen name="MainTabs" component={() => (
          <AuthGate>
            <MainTabs />
          </AuthGate>
        )} />
        <Stack.Screen name="Perfil" component={(props: NativeStackScreenProps<RootStackParamList, 'Perfil'>) => (
          <AuthGate>
            <PerfilScreen {...props} />
          </AuthGate>
        )} options={{ headerShown: true, title: 'Perfil' }} />
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
