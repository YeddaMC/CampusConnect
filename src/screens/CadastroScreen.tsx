// src/screens/CadastroScreen.tsx

import React, { useState } from 'react';

import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

import { cadastroScreenStyles } from '../styles/components/cadastroScreenStyles';


// IMPORTS DO FIREBASE SDK
import { auth, db } from '../utils/firebaseService';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// NOVO: Importe os estilos específicos da tela


type CadastroScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Cadastro'
>;

type Props = {
  navigation: CadastroScreenNavigationProp;
};

const CadastroScreen: React.FC<Props> = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    // Validação de campos obrigatórios
    if (!nome || !cpf || !whatsapp || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validação de senhas coincidentes
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    // Validação de comprimento mínimo da senha (8 caracteres)
    if (password.length < 8) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    // Validação de formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    // Validação de CPF (11 dígitos numéricos)
    if (!/^\d{11}$/.test(cpf)) {
      Alert.alert('Erro', 'Por favor, insira um CPF válido (apenas 11 números).');
      return;
    }

    // Validação de WhatsApp (10 a 15 dígitos numéricos)
    if (!/^\d{10,15}$/.test(whatsapp)) {
      Alert.alert('Erro', 'Por favor, insira um número de WhatsApp válido (apenas números, 10 a 15 dígitos).');
      return;
    }

    setLoading(true);

    try {
      const nomeUpperCase = nome.toUpperCase();

      // 1. Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Salva os dados adicionais do usuário no Cloud Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        nome: nomeUpperCase,
        cpf: cpf,
        whatsapp: whatsapp,
        email: email,
        createdAt: new Date().toISOString(),
      });

      // 3. Mostra o alerta de sucesso e navega
      Alert.alert(
        'Sucesso',
        'Cadastro realizado com sucesso! Agora faça o login.',
        [{ text: 'OK', onPress: () => {
            navigation.replace('Login');
        }}]
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
     
      <View style={cadastroScreenStyles.spacer} />
      {/*<Button
        title="Voltar para Início"
        onPress={() => navigation.navigate('Inicial')}
        disabled={loading}
      />*/}
    </View>
  );
};

export default CadastroScreen;