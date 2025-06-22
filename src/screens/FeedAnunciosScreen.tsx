import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Text as PaperText } from 'react-native-paper';

import Header from '../components/Header';
import Footer from '../components/Footer';
import NoticiaCard from '../components/NoticiaCard'; // Reutilizando o card de notícia para exibir anúncios
import { globalStyles } from '../styles/components/globalStyles';
import { feedAnunciosScreenStyles } from '../styles/components/feedAnunciosScreenStyles';

// Dados de exemplo para anúncios
const anunciosData = [
  {
    id: 'a1',
    title: 'Venda de Livros Usados',
    description: 'Livros de programação e design disponíveis. Contato via WhatsApp.',
    date: '20/05/2025',
    imageUrl: 'https://via.placeholder.com/400x200/FF5722/FFFFFF?text=Livros+Usados',
    whatsappNumber: '5511999999999', // Número do anunciante no formato internacional
  },
  {
    id: 'a2',
    title: 'Bolo Caseiro',
    description: 'Deliciosos bolos feitos sob encomenda. Entre em contato pelo WhatsApp.',
    date: '18/05/2025',
    imageUrl: 'https://via.placeholder.com/400x200/4CAF50/FFFFFF?text=Bolo+Caseiro',
    whatsappNumber: '5511988888888', // Número do anunciante no formato internacional
  },
  // ... outros anúncios
];

// Função para abrir WhatsApp com número do anunciante
const openWhatsApp = (phoneNumber: string) => {
  const url = `whatsapp://send?phone=${phoneNumber}`;

  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        Alert.alert('Erro', 'WhatsApp não está instalado no dispositivo');
      } else {
        return Linking.openURL(url);
      }
    })
    .catch(() => Alert.alert('Erro', 'Não foi possível abrir o WhatsApp'));
};

type FeedAnunciosScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FeedAnuncios'
>;

type Props = {
  navigation: FeedAnunciosScreenNavigationProp;
};

const FeedAnunciosScreen: React.FC<Props> = ({ navigation }) => {
  const renderItem = ({ item }: { item: typeof anunciosData[0] }) => (
    <TouchableOpacity onPress={() => openWhatsApp(item.whatsappNumber)}>
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
      <Header title="Anúncios do Campus" showLogo={true} />

      <View style={globalStyles.content}>
        <PaperText style={feedAnunciosScreenStyles.title}>Anúncios Recentes</PaperText>
        <FlatList
          data={anunciosData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={feedAnunciosScreenStyles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Footer navigation={navigation} />
    </View>
  );
};

export default FeedAnunciosScreen;
