// src/components/SenhaModal.tsx
import { useState } from 'react'; // Importa hooks do React
import {
  Modal, // Componente de modal
  View, // Container genérico
  Text, // Componente para texto
  TextInput, // Campo de entrada de texto
  Button, // Componente de botão
  StyleSheet, // Para estilos CSS-in-JS
  Alert, // Para exibir alertas nativos
  KeyboardAvoidingView, // Ajusta a tela para o teclado
  Platform, // Detecta plataforma (iOS/Android)
  Keyboard, // Controla o teclado (mantido para utilidades futuras, se necessário)
  ActivityIndicator, // Indicador de carregamento
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_USERS_KEY = '@campusconnect_users';
const STORAGE_CPF_KEY = '@campusconnect_cpf';

type Props = { // Tipo de props para o componente
  visible: boolean; // Visibilidade do modal
  onClose: () => void; // Função para fechar o modal
  onPasswordChanged: () => void; // Função chamada após a senha ser alterada
};

const SenhaModal = ({ visible, onClose, onPasswordChanged }: Props) => { // Definição do componente SenhaModal
  const [newPassword, setNewPassword] = useState(''); // Estado da nova senha
  const [confirmPassword, setConfirmPassword] = useState(''); // Estado da confirmação da nova senha
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const handleChangePassword = async () => { // Função para alterar a senha
    // Busca o CPF do usuário logado
    const cpf = await AsyncStorage.getItem(STORAGE_CPF_KEY);
    if (!cpf) {
      Alert.alert('Erro', 'Nenhum usuário logado. Por favor, faça login novamente.');
      onClose();
      return;
    }
    if (!newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'A nova senha e a confirmação não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      // Busca todos os usuários
      const usersData = await AsyncStorage.getItem(STORAGE_USERS_KEY);
      let users = usersData ? JSON.parse(usersData) : [];
      // Encontra o usuário pelo CPF
      const userIndex = users.findIndex((u: any) => u.cpf === cpf);
      if (userIndex === -1) {
        throw new Error('Usuário não encontrado.');
      }
      users[userIndex].password = newPassword;
      await AsyncStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      setNewPassword('');
      setConfirmPassword('');
      onPasswordChanged();
      onClose();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível alterar a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Alterar Senha</Text>
          <TextInput
            placeholder="Nova senha"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            autoCapitalize="none"
            textContentType="newPassword"
            editable={!loading}
          />
          <TextInput
            placeholder="Confirme a nova senha"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            autoCapitalize="none"
            textContentType="newPassword"
            editable={!loading}
          />
          <Button title="Confirmar" onPress={handleChangePassword} disabled={loading} />
          <View style={{ height: 10 }} />
          <Button title="Cancelar" color="red" onPress={onClose} disabled={loading} />
          {loading && <ActivityIndicator size="small" color="#0000ff" style={{ marginTop: 10 }} />}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 320,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default SenhaModal; // Exporta o componente