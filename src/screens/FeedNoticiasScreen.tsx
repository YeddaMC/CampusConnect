// src/screens/FeedNoticiasScreen.tsx
import React from 'react';
import { View, FlatList, StyleSheet, Linking, Alert, TouchableOpacity } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabsParamList } from '../navigation/types';
import { Text } from 'react-native-paper';

import Header from '../components/Header';
import Footer from '../components/Footer';
import NoticiaCard from '../components/NoticiaCard';
import { theme, globalStyles } from '../styles/components/globalStyles';

const noticiasData = [
  {
    id: '3',
    title: 'Conheça a Biblioteca do Campus Pinhais',
    description: 'Convidamos todos os alunos a conhecer e usufruir do espaço da Biblioteca do IFPR Pinhais, um ambiente acolhedor para estudos, pesquisas e leitura.',
    date: '23/06/2025',
    imageUrl: 'https://ifpr.edu.br/wp-content/uploads/2024/02/bib_pinhais-1536x864.png',
    url: 'https://ifpr.edu.br/rede-de-bibliotecas-do-ifpr/nossas-bibliotecas/biblioteca-pinhais/',
  },
  {
    id: '1',
    title: 'Oficina de Produção de Resumos – V SciTec',
    description: 'Não perca.',
    date: '25/06/2025',
    imageUrl: 'https://ifpr.edu.br/pinhais/wp-content/uploads/sites/22/2025/06/Post-curso-tecnologia-para-mulheres-moderno-neon-1.webp',
    url: 'https://ifpr.edu.br/pinhais/oficina-de-producao-de-resumos-v-scitec/',
  },
  {
    id: '2',
    title: 'As férias estão chegando',
    description: 'Prepare-se para o período de descanso! Confira o calendário acadêmico e planeje suas férias.',
    date: '24/05/2025',
    imageUrl: 'https://tse2.mm.bing.net/th?id=OIP.RB0YPUCwyMG3N0BYa6D0OwHaE3&pid=Api&P=0&h=180',
    url: 'https://ifpr.edu.br/menu-academico/calendario-academico/',
  },
];

const openExternalLink = (url: string) => {
  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        Alert.alert('Erro', 'Não foi possível abrir o link');
      } else {
        return Linking.openURL(url);
      }
    })
    .catch(() => Alert.alert('Erro', 'Não foi possível abrir o link'));
};

type FeedNoticiasScreenNavigationProp = BottomTabNavigationProp<
  MainTabsParamList,
  'Notícias'
>;

type Props = {
  navigation: FeedNoticiasScreenNavigationProp;
};

const FeedNoticiasScreen: React.FC<Props> = ({ navigation }) => {
  const renderItem = ({ item }: { item: typeof noticiasData[0] }) => (
    <TouchableOpacity onPress={() => openExternalLink(item.url)}>
      <NoticiaCard
        title={item.title}
        description={item.description}
        date={item.date}
        imageUrl={item.imageUrl}
      />
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      <Header title="  " showLogo={true} />

      <View style={globalStyles.content}>
        <Text style={styles.title}>Últimas Notícias</Text>
        <FlatList
          data={noticiasData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: theme.colors.text,
  },
  listContent: {
    paddingBottom: 70,
  },
});

export default FeedNoticiasScreen;
