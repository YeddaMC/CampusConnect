import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';

import Header from '../components/Header'; // mesmo Header da tela de anúncios
import Footer from '../components/Footer'; // mesmo Footer da tela de anúncios

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

import { auth, db } from '../utils/firebaseService';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

type CadastroScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Cadastro'
>;

type Props = {
  navigation: CadastroScreenNavigationProp;
};

const CadastroScreen: React.FC<Props> = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [cpf, setCpf] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    // Validações iguais ao seu código
    if (!nome || !cpf || !whatsapp || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    // username agora é opcional
    if (username && (username.length < 3 || /\s/.test(username))) {
      Alert.alert('Erro', 'Nome de usuário inválido. Mínimo 3 caracteres, sem espaços.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres (letras ou números).');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }
    if (!/^\d{11}$/.test(cpf)) {
      Alert.alert('Erro', 'Por favor, insira um CPF válido (apenas 11 números).');
      return;
    }
    if (!/^\d{10,15}$/.test(whatsapp)) {
      Alert.alert('Erro', 'Por favor, insira um número de WhatsApp válido (10 a 15 dígitos).');
      return;
    }

    setLoading(true);

    try {
      const nomeUpperCase = nome.toUpperCase();
      const usernameLowerCase = username.toLowerCase();

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: usernameLowerCase,
      });

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        nome: nomeUpperCase,
        username: usernameLowerCase,
        cpf,
        whatsapp,
        email,
        createdAt: new Date().toISOString(),
      });

      Alert.alert(
        'Sucesso',
        'Cadastro realizado com sucesso! Agora faça o login.',
        [{ text: 'OK', onPress: () => navigation.replace('Login') }]
      );
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      let errorMessage = 'Ocorreu um erro ao tentar realizar o cadastro.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'O formato do e-mail é inválido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha é muito fraca. Ela deve ter no mínimo 6 caracteres (letras ou números).';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      // Exibe o erro detalhado para debug
      Alert.alert('Erro', errorMessage + (error.message ? `\n${error.message}` : ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Reutiliza o Header da tela de anúncios */}
      <Header title="Cadastro" showLogo={true} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          value={nome}
          onChangeText={setNome}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Nome de Usuário (username)"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="CPF (apenas números)"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          editable={!loading}
          maxLength={11}
        />

        <TextInput
          style={styles.input}
          placeholder="WhatsApp (apenas números)"
          value={whatsapp}
          onChangeText={setWhatsapp}
          keyboardType="phone-pad"
          editable={!loading}
        />

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
          placeholder="Senha (mínimo 6 caracteres, letras ou números)"
          value={password}
          onChangeText={setPassword}
          // use secureTextEntry={true}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          // use secureTextEntry={true}
          editable={!loading}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Cadastrar" onPress={handleCadastro} />
        )}

        <View style={{ height: 20 }} />

        <Button
          title="Já tem conta? Faça Login"
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        />
      </ScrollView>

      {/* Reutiliza o Footer da tela de anúncios, agora sem passar navigation */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80, // espaço para o footer
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
});

export default CadastroScreen;
