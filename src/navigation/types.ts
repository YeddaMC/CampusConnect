//src\navigation\types.ts
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Inicial: undefined;
  Login: undefined;
  Cadastro: undefined;
  // Agora MainTabs aceita um parâmetro opcional com a tela da aba
  MainTabs: { screen?: keyof MainTabsParamList } | undefined;
  FeedNoticias: undefined;
  FeedAnuncios: undefined;
};

export type MainTabsParamList = {
  Notícias: undefined;
  Anúncios: undefined;
};

// Este tipo combina a navegação das Tabs com a navegação do Stack para permitir usar métodos como 'replace'
export type MainTabsNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabsParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;
