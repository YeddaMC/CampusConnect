import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

// IMPORTS DO FIREBASE SDK
import { auth } from '../utils/firebaseService';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

// IMPORTS PARA GOOGLE SIGN-IN COM EXPO
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID, WEB_CLIENT_ID } from '../utils/firebaseService';
import { makeRedirectUri } from 'expo-auth-session';

// Para que o WebBrowser não feche imediatamente no Android
WebBrowser.maybeCompleteAuthSession();

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectUri = makeRedirectUri({
    useProxy: true,
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    redirectUri,
  });

  useEffect(() => {
    if (request) {
      console.log('URI de Redirecionamento do Expo:', request.redirectUri);
    }
  }, [request]);

  useEffect(() => {
    if (response?.type === 'success') {
      const { idToken } = response.authentication!;
      const credential = GoogleAuthProvider.credential(idToken);
      setLoading(true);
      signInWithCredential(auth, credential)
        .then(() => {
          console.log('Login Google bem-sucedido! Navegando para FeedNoticias.');
          navigation.replace('FeedNoticias');
        })
        .catch((error) => {
          console.error('Erro ao fazer login com Google:', error);
          Alert.alert('Erro', 'Ocorreu um erro ao fazer login com o Google.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (response?.type === 'cancel') {
      Alert.alert('Login cancelado', 'Você cancelou o login com o Google.');
    } else if (response?.type === 'error') {
      console.error('Erro no Login Google:', response.error);
      Alert.alert('Erro no Login Google', 'Não foi possível completar o login com o Google. Verifique o console para mais detalhes.');
    }
  }, [response, navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha e-mail e senha.');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('FeedNoticias');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      let errorMessage = 'Ocorreu um erro ao tentar fazer login.';

      if (error.code === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido. Por favor, verifique o formato.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'E-mail não cadastrado. Que tal criar uma conta?';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta. Tente novamente.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciais inválidas. Verifique seu e-mail e senha.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }

      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Entrar" onPress={handleLogin} />
          <View style={styles.spacer} />
          <Button
            title="Entrar com Google"
            onPress={() => {
              console.log('Botão Entrar com Google clicado. Chamando promptAsync().');
              promptAsync();
            }}
            disabled={!request || loading}
          />
        </>
      )}
      <View style={styles.spacer} />
      <Button
        title="Não tem conta? Cadastre-se"
        onPress={() => navigation.navigate('Cadastro')}
        disabled={loading}
      />
      <View style={styles.spacer} />
      <Button
        title="Voltar para Início"
        onPress={() => navigation.navigate('Inicial')}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  spacer: {
    height: 15,
  },
});

export default LoginScreen;
