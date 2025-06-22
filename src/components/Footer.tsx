// src/components/Footer.tsx

import React from 'react';
import { View, Linking, Alert } from 'react-native'; // REMOVIDO StyleSheet daqui
import { Appbar, useTheme } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebaseService'; // Importar a instância de autenticação


// IMPORTAR O TIPO CORRETO DE NAVEGAÇÃO AQUI
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // Importar RootStackParamList

// IMPORTAR OS ESTILOS DO ARQUIVO SEPARADO

import { footerStyles } from '@styles/components/footerStyles';
// Definir o tipo para a prop 'navigation' de forma mais específica
type FooterNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  keyof RootStackParamList //qualquer rota da RootStackParamList
>;

interface FooterProps {
  navigation: FooterNavigationProp; // Usar o tipo específico aqui
}

const Footer: React.FC<FooterProps> = ({ navigation }) => {
  const theme = useTheme();

  const handleWhatsAppPress = () => {
    const whatsappNumber = '5541999999999';
    const url = `whatsapp://send?phone=${whatsappNumber}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Erro', 'WhatsApp não está instalado ou não é possível abrir o link.');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('Erro ao abrir WhatsApp:', err));
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair do aplicativo',
      'Tem certeza que deseja fazer logout?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                })
              );
              Alert.alert('Logout', 'Você foi desconectado com sucesso.');
            } catch (error: any) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  return (
    // USANDO footerStyles.bottom AQUI
    <Appbar style={[footerStyles.bottom, { backgroundColor: theme.colors.primary }]}>
      <Appbar.Action
        icon="whatsapp"
        onPress={handleWhatsAppPress}
        color="white"
        size={28}
      />
      <Appbar.Content title="" />
      <Appbar.Action
        icon="logout"
        onPress={handleLogout}
        color="white"
        size={28}
      />
    </Appbar>
  );
};

// REMOVIDO TODO  BLOCO 'const styles = StyleSheet.create({...});' DAQUI

export default Footer;