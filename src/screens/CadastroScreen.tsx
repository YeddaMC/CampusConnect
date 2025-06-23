import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

import { cadastroScreenStyles } from '../styles/components/cadastroScreenStyles';

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
    // Validação campos obrigatórios
    if (!nome || !username || !cpf || !whatsapp || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validação username: mínimo 3 caracteres, sem espaços
    if (username.length < 3 || /\s/.test(username)) {
      Alert.alert('Erro', 'Nome de usuário inválido. Mínimo 3 caracteres, sem espaços.');
      return;
    }

    // Validação senhas
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    // Validação email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    // Validação CPF
    if (!/^\d{11}$/.test(cpf)) {
      Alert.alert('Erro', 'Por favor, insira um CPF válido (apenas 11 números).');
      return;
    }

    // Validação WhatsApp
    if (!/^\d{10,15}$/.test(whatsapp)) {
      Alert.alert('Erro', 'Por favor, insira um número de WhatsApp válido (10 a 15 dígitos).');
      return;
    }

    setLoading(true);

    try {
      const nomeUpperCase = nome.toUpperCase();
      const usernameLowerCase = username.toLowerCase();

      // Cria usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Atualiza displayName com o username
      await updateProfile(user, {
        displayName: usernameLowerCase,
      });

      // Salva dados adicionais no Firestore
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
        errorMessage = 'A senha é muito fraca. Ela deve ter no mínimo 8 caracteres.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }

      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={cadastroScreenStyles.container}>
      <Text style={cadastroScreenStyles.title}>Cadastro</Text>

      <TextInput
        style={cadastroScreenStyles.input}
        placeholder="Nome Completo"
        value={nome}
        onChangeText={setNome}
        editable={!loading}
      />

      <TextInput
        style={cadastroScreenStyles.input}
        placeholder="Nome de Usuário (username)"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        style={cadastroScreenStyles.input}
        placeholder="CPF (apenas números)"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
        editable={!loading}
        maxLength={11}
      />

      <TextInput
        style={cadastroScreenStyles.input}
        placeholder="WhatsApp (apenas números)"
        value={whatsapp}
        onChangeText={setWhatsapp}
        keyboardType="phone-pad"
        editable={!loading}
      />

      <TextInput
        style={cadastroScreenStyles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        style={cadastroScreenStyles.input}
        placeholder="Senha (mínimo 8 caracteres)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <TextInput
        style={cadastroScreenStyles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!loading}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Cadastrar" onPress={handleCadastro} />
      )}

      <View style={cadastroScreenStyles.spacer} />

      <Button
        title="Já tem conta? Faça Login"
        onPress={() => navigation.navigate('Login')}
        disabled={loading}
      />
    </View>
  );
};

export default CadastroScreen;
