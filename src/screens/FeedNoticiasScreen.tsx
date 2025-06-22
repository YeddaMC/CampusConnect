import React from 'react';
import { View, FlatList, StyleSheet, Linking, Alert, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Text as PaperText } from 'react-native-paper';

import Header from '../components/Header';
import Footer from '../components/Footer';
import NoticiaCard from '../components/NoticiaCard';
import { theme, globalStyles } from '../styles/components/globalStyles';

// Dados das notícias, agora com campo url para link externo
const noticiasData = [
  {
    id: '1',
    title: 'Palestra sobre Inteligência Artificial no IFPR',
    description: 'Não perca a palestra sobre as últimas tendências em IA, dia 30/05 às 19h no auditório.',
    date: '25/05/2025',
    imageUrl: 'https://via.placeholder.com/400x200/FF5722/FFFFFF?text=IA+no+IFPR',
    url: 'https://ifpr.edu.br/noticia/ia-no-ifpr', // Exemplo de link externo
  },
  {
    id: '2',
    title: 'Abertura de Inscrições para Curso de Extensão',
    description: 'Inscrições abertas para o curso de desenvolvimento web com React. Vagas limitadas!',
    date: '24/05/2025',
    imageUrl: 'https://via.placeholder.com/400x200/4CAF50/FFFFFF?text=Curso+React',
    url: 'https://ifpr.edu.br/noticia/curso-react',
  },
  // ... demais notícias com url
];

// Função para abrir link externo com tratamento de erros
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

type FeedNoticiasScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FeedNoticias'
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
      <Header title="Notícias do Campus" showLogo={true} />

      <View style={globalStyles.content}>
        <PaperText style={styles.title}>Últimas Notícias</PaperText>
        <FlatList
          data={noticiasData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Footer navigation={navigation} />
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
