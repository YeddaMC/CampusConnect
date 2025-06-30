// src/screens/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

import { auth } from '../utils/firebaseService';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID, WEB_CLIENT_ID } from '../utils/firebaseService';
import { makeRedirectUri } from 'expo-auth-session';

import Header from '../components/Header';
import Footer from '../components/Footer';
import SenhaModal from '../components/SenhaModal';

WebBrowser.maybeCompleteAuthSession();

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const STORAGE_EMAIL_KEY = '@campusconnect_email';

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showSenhaModal, setShowSenhaModal] = useState(false);

  const redirectUri = makeRedirectUri();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    redirectUri,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    (async () => {
      try {
        const savedEmail = await AsyncStorage.getItem(STORAGE_EMAIL_KEY);
        if (savedEmail) {
          setEmail(savedEmail);
        }
      } catch (e) {
        console.warn('Erro ao carregar email salvo', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (!authentication) {
        Alert.alert('Erro', 'Autenticação Google falhou: dados ausentes');
        return;
      }

      const { idToken, accessToken } = authentication;
      const credential = idToken
        ? GoogleAuthProvider.credential(idToken)
        : GoogleAuthProvider.credential(null, accessToken);

      setLoading(true);
      signInWithCredential(auth, credential)
        .then(() => {
          navigation.replace('MainTabs');
        })
        .catch((error) => {
          console.error('Erro no login Google:', error);
          Alert.alert('Erro', 'Não foi possível fazer login com o Google.');
        })
        .finally(() => setLoading(false));
    } else if (response?.type === 'error') {
      Alert.alert('Erro', 'Login com Google cancelado ou falhou.');
    }
  }, [response]);

  const handleGoogleLogin = async () => {
    promptAsync();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha e-mail e senha.');
      return;
    }
    if (password.length < 4) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 4 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem(STORAGE_EMAIL_KEY, email);
      navigation.replace('MainTabs');
    } catch (error: any) {
      let message = 'Erro ao fazer login.';
      if (error.code === 'auth/invalid-email') message = 'E-mail inválido.';
      else if (error.code === 'auth/user-not-found') message = 'Usuário não encontrado.';
      else if (error.code === 'auth/wrong-password') message = 'Senha incorreta.';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header showLogo={true} title="Login" />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}> </Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleButtonText}>
              {passwordVisible ? 'Ocultar' : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button title="Entrar" onPress={handleLogin} />
            <View style={{ height: 15 }} />
            <Button title="Entrar com Google" disabled={!request} onPress={handleGoogleLogin} />
            <View style={{ height: 15 }} />
            <Button
              title="Esqueci minha senha"
              onPress={() => setShowSenhaModal(true)}
              disabled={loading}
            />
          </>
        )}

        <View style={{ height: 15 }} />

        <Button
          title="Não tem conta? Cadastre-se"
          onPress={() => navigation.navigate('Cadastro')}
          disabled={loading}
        />
      </ScrollView>

      <Footer />
      {showSenhaModal && (
        <SenhaModal
          visible={showSenhaModal}
          onClose={() => setShowSenhaModal(false)}
          onPasswordChanged={() => setShowSenhaModal(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  toggleButton: { paddingHorizontal: 10, paddingVertical: 6 },
  toggleButtonText: { color: '#007AFF', fontWeight: 'bold' },
});

export default LoginScreen;
