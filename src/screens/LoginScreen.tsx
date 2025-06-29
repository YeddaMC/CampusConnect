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

import Header from '../components/Header';
import Footer from '../components/Footer';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const STORAGE_EMAIL_KEY = '@campusconnect_email';
const STORAGE_USERS_KEY = '@campusconnect_users'; // novo para múltiplos usuários
const STORAGE_CPF_KEY = '@campusconnect_cpf'; // para lembrar o último CPF logado

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const savedCpf = await AsyncStorage.getItem(STORAGE_CPF_KEY);
        if (savedCpf) {
          setCpf(savedCpf);
        }
      } catch (e) {
        console.warn('Erro ao carregar CPF salvo', e);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!cpf || !password) {
      Alert.alert('Erro', 'Preencha CPF e senha.');
      return;
    }
    setLoading(true);
    try {
      const usersData = await AsyncStorage.getItem(STORAGE_USERS_KEY);
      const users = usersData ? JSON.parse(usersData) : [];
      const user = users.find((u: any) => u.cpf === cpf && u.password === password);
      if (user) {
        await AsyncStorage.setItem(STORAGE_CPF_KEY, cpf);
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        Alert.alert('Erro', 'CPF ou senha incorretos.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header showLogo={true} title="Campus Connect" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}> </Text>
        <TextInput
          style={styles.input}
          placeholder="CPF (apenas números)"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          autoCapitalize="none"
          editable={!loading}
          maxLength={11}
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
            <Button title="Não tem conta? Cadastre-se" onPress={() => navigation.navigate('Cadastro')} disabled={loading} />
          </>
        )}
      </ScrollView>
      <Footer />
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
