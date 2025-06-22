//src\screens\InicialScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type InicialScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Inicial'
>;

type Props = {
  navigation: InicialScreenNavigationProp;
};

const InicialScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Campus Connect!</Text>
      <Text style={styles.subtitle}>Sua plataforma de conexão com o IFPR - Campus Pinhais.</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')}
        />
        <View style={styles.spacer} />
        <Button
          title="Cadastro"
          onPress={() => navigation.navigate('Cadastro')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', // Cor de fundo base, ajustar conforme Figma
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  spacer: {
    width: 20, // Espaço entre os botões
  },
});

export default InicialScreen;

