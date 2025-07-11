import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Alert, Linking } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabsParamList } from '../navigation/types';
import { Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../components/Header';
import Footer from '../components/Footer';
import NoticiaCard from '../components/NoticiaCard'; // Reutilizando o card de notícia para exibir anúncios
import { globalStyles } from '../styles/components/globalStyles';
import { feedAnunciosScreenStyles } from '../styles/components/feedAnunciosScreenStyles';

// Dados de exemplo para anúncios (unificado e corrigido)
const anunciosData = [
  {
    id: 'a5',
    title: 'Notebook à venda',
    description: 'Notebook seminovo, ótimo estado, ideal para estudos. Interessados chamar no WhatsApp.',
    date: '30/06/2025',
    imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.7Ni7A92p963N9huvmTzDggHaEh?pid=Api&P=0&h=180',
    whatsappNumber: '5511999999999',
  },
  {
    id: 'a6',
    title: 'Kit Festa',
    description: 'Kit festa completo. Doces, salgados, bolo, refrigerantes e descartáveis. Falar com Amanda da sala 10.',
    date: '30/06/2025',
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.QV5_nZLxExe55Kr75XDcbQHaFl?pid=Api&P=0&h=180',
    whatsappNumber: '5541999999999',
  },
  {
    id: 'a1',
    title: 'Venda de Livros Usados',
    description: 'Livros de programação e design disponíveis. Contato via WhatsApp.',
    date: '20/05/2025',
    imageUrl: 'https://tse3.mm.bing.net/th?id=OIP.hlg5JnBXmlkgI1AEF6FAKAHaDc&pid=Api&P=0&h=180',
    whatsappNumber: '5511999999999',
  },
  {
    id: 'a2',
    title: 'Bolo Caseiro',
    description: 'Deliciosos bolos feitos sob encomenda. Entre em contato pelo WhatsApp.',
    date: '18/05/2025',
    imageUrl: 'https://up.yimg.com/ib/th?id=OIP.DWa-5TgeoelTuAIWZI-YqAHaE8&pid=Api&rs=1&c=1&qlt=95&w=161&h=107',
    whatsappNumber: '5541984779013',
  },
  {
    id: 'a3',
    title: 'Formatação e Manutenção de PC',
    description: 'Serviço rápido e confiável de formatação, limpeza e otimização do seu computador. Atendimento presencial e remoto.',
    date: '22/06/2025',
    imageUrl: 'https://tse3.mm.bing.net/th?id=OIP.I5F0cXrHNssPVWrOVvT_3wHaDe&pid=Api&P=0&h=180',
    whatsappNumber: '5511977777777',
  },
  {
    id: 'a4',
    title: 'Aulas Particulares de Programação',
    description: 'Aprenda programação do básico ao avançado com aulas personalizadas. Professores experientes e aulas online ou presenciais.',
    date: '21/06/2025',
    imageUrl: 'https://tse3.mm.bing.net/th?id=OIP.mjw2SNguF-x1XI99XdP6jgHaEK&pid=Api&P=0&h=180',
    whatsappNumber: '5511966666666',
  },
  {
    id: 'a5',
    title: 'Notebook com Pouco Uso',
    description: 'Vendo notebook com pouco uso. Interessados chamar no WhatsApp.',
    date: '19/05/2025',
    imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.7Ni7A92p963N9huvmTzDggHaEh?pid=Api&P=0&h=180',
    whatsappNumber: '5511912345678',
  },
  {
    id: 'a6',
    title: 'Docinhos e Salgadinhos',
    description: 'Docinhos e salgadinhos sob encomenda. Peça pelo WhatsApp ou fale com Amanda na sala 10.',
    date: '17/05/2025',
    imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.bwih3bWJh1pAdbds4oGzHQHaHa?pid=Api&P=0&h=180',
    whatsappNumber: '5541998765432',
  },
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

type FeedAnunciosScreenNavigationProp = BottomTabNavigationProp<
  MainTabsParamList,
  'Anúncios'
>;

type Props = {
  navigation: FeedAnunciosScreenNavigationProp;
};

const STORAGE_KEY = '@profile_image_uri';

const FeedAnunciosScreen: React.FC<Props> = ({ navigation }) => {
  const [userPhotoUri, setUserPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    const loadPhoto = async () => {
      const uri = await AsyncStorage.getItem(STORAGE_KEY);
      if (uri) setUserPhotoUri(uri);
    };
    loadPhoto();
  }, []);

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
        <Text style={feedAnunciosScreenStyles.title}>☺</Text>
        <FlatList
          data={anunciosData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={feedAnunciosScreenStyles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Footer />
    </View>
  );
};

export default FeedAnunciosScreen;
