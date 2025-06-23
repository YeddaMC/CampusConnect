import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Button,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { getAuth, updatePassword } from 'firebase/auth';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { PerfilStyles } from '../styles/components/PerfilStyles';

import ExcluirContaModal from '../components/ExcluirContaModal'; // ajuste o caminho se necessário

type PerfilScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Perfil'
>;

type Props = {
  navigation: PerfilScreenNavigationProp;
};

const STORAGE_KEY = '@profile_image_uri';

const PerfilScreen: React.FC<Props> = ({ navigation }) => {
  const auth = getAuth();
  const [user] = useState(auth.currentUser);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  // Carrega a imagem salva no AsyncStorage ao montar
  useEffect(() => {
    const loadImage = async () => {
      try {
        const uri = await AsyncStorage.getItem(STORAGE_KEY);
        if (uri) setImageUri(uri);
      } catch {
        // erro ignorado
      }
    };
    loadImage();
  }, []);

  // Função para pedir permissões e abrir opções
  const pickImage = async () => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para acessar a câmera e a galeria.'
        );
        return;
      }

      Alert.alert(
        'Selecionar Foto',
        'Deseja tirar uma foto ou escolher da galeria?',
        [
          {
            text: 'Câmera',
            onPress: async () => {
              try {
                const result = await ImagePicker.launchCameraAsync({
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 1,
                });
                if (!result.canceled && result.assets.length > 0) {
                  await saveImageLocally(result.assets[0].uri);
                }
              } catch {
                Alert.alert('Erro', 'Não foi possível abrir a câmera.');
              }
            },
          },
          {
            text: 'Galeria',
            onPress: async () => {
              try {
                const result = await ImagePicker.launchImageLibraryAsync({
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 1,
                });
                if (!result.canceled && result.assets.length > 0) {
                  await saveImageLocally(result.assets[0].uri);
                }
              } catch {
                Alert.alert('Erro', 'Não foi possível abrir a galeria.');
              }
            },
          },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    } catch {
      Alert.alert('Erro', 'Falha ao solicitar permissões.');
    }
  };

  // Salva URI da imagem no AsyncStorage e atualiza estado
  const saveImageLocally = async (uri: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, uri);
      setImageUri(uri);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a imagem localmente.');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');
    } catch {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  // Agora só abre o modal para exclusão
  const handleDeleteAccount = () => {
    setModalVisible(true);
  };

  // Função chamada após exclusão bem-sucedida pelo modal
  const handleAccountDeleted = () => {
    setModalVisible(false);
    navigation.replace('Login');
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      if (user) {
        await updatePassword(user, newPassword);
        Alert.alert('Sucesso', 'Senha alterada com sucesso.');
        setNewPassword('');
        setChangingPassword(false);
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível alterar a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={PerfilStyles.container} keyboardShouldPersistTaps="handled">
      
      {/* Botão Voltar no topo */}
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Voltar"
      >
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
        <Text style={{ color: '#007AFF', fontSize: 18, marginLeft: 5 }}>Voltar</Text>
      </TouchableOpacity>

      <View style={PerfilStyles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={PerfilStyles.profileImage} />
        ) : (
          <View
            style={[
              PerfilStyles.profileImage,
              { justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccc' },
            ]}
          >
            <Ionicons name="person-circle" size={120} color="#888" />
          </View>
        )}

        <TouchableOpacity onPress={pickImage} style={PerfilStyles.cameraIconContainer}>
          <Ionicons name="camera" size={30} color="#555" />
        </TouchableOpacity>
      </View>

      <Text style={PerfilStyles.userInfo}> {user?.displayName || 'Usuário'}</Text>
      <Text style={PerfilStyles.userInfo}>E-mail: {user?.email}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Logout" onPress={handleLogout} />
          <View style={PerfilStyles.spacer} />
          <Button title="Excluir Conta" color="red" onPress={handleDeleteAccount} />
          <View style={PerfilStyles.spacer} />

          {changingPassword ? (
            <>
              <TextInput
                placeholder="Nova senha"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                style={[PerfilStyles.input, { marginBottom: 10 }]}
              />
              <Button title="Confirmar alteração" onPress={handleUpdatePassword} />
              <View style={PerfilStyles.spacer} />
              <Button title="Cancelar" color="gray" onPress={() => setChangingPassword(false)} />
            </>
          ) : (
            <Button title="Alterar Senha" onPress={() => setChangingPassword(true)} />
          )}
        </>
      )}

      <ExcluirContaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAccountDeleted={handleAccountDeleted}
      />
    </ScrollView>
  );
};

export default PerfilScreen;
