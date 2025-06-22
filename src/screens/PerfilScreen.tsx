import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../utils/firebaseService';
import { PerfilStyles } from '../styles/components/PerfilStyles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type PerfilScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Perfil'
>;

type Props = {
  navigation: PerfilScreenNavigationProp;
};

const PerfilScreen: React.FC<Props> = ({ navigation }) => {
  const [user, setUser] = useState(auth.currentUser);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Função para escolher imagem da galeria ou câmera
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Permissão para acessar a galeria é necessária.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      // Aqui você pode implementar o upload da imagem para seu backend ou Firebase Storage
    }
  };

  // Função para logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  // Função para excluir conta
  const handleDeleteAccount = async () => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              if (user) {
                await user.delete();
                navigation.replace('Login');
              }
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Não foi possível excluir a conta.');
            }
          },
        },
      ]
    );
  };

  // Função para alterar senha (simplesmente navega para tela de alteração, que você pode criar)
  const handleChangePassword = () => {
    navigation.navigate('AlterarSenha'); // Você pode criar essa tela futuramente
  };

  // Função para esqueci senha (envia e-mail de redefinição)
  const handleForgotPassword = async () => {
    if (!user?.email) {
      Alert.alert('Erro', 'Nenhum e-mail associado à conta.');
      return;
    }
    setLoading(true);
    try {
      await auth.sendPasswordResetEmail(user.email);
      Alert.alert('Sucesso', 'E-mail de redefinição de senha enviado.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o e-mail de redefinição.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={PerfilStyles.container}>
      <TouchableOpacity onPress={pickImage} style={PerfilStyles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={PerfilStyles.profileImage} />
        ) : (
          <Image
            source={require('../assets/user-placeholder.png')}
            style={PerfilStyles.profileImage}
          />
        )}
        <Text style={PerfilStyles.changePhotoText}>Alterar Foto</Text>
      </TouchableOpacity>

      <Text style={PerfilStyles.userInfo}>Nome: {user?.displayName || 'Usuário'}</Text>
      <Text style={PerfilStyles.userInfo}>E-mail: {user?.email}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Logout" onPress={handleLogout} />
          <View style={PerfilStyles.spacer} />
          <Button title="Excluir Conta" color="red" onPress={handleDeleteAccount} />
          <View style={PerfilStyles.spacer} />
          <Button title="Alterar Senha" onPress={handleChangePassword} />
          <View style={PerfilStyles.spacer} />
          <Button title="Esqueci Senha" onPress={handleForgotPassword} />
        </>
      )}
    </View>
  );
};

export default PerfilScreen;
