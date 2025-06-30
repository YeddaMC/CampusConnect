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
import { getAuth, updatePassword, sendPasswordResetEmail } from 'firebase/auth'; // Adiciona sendPasswordResetEmail

type Props = {
  visible: boolean; // Visibilidade do modal
  onClose: () => void; // Função para fechar o modal
  onPasswordChanged: () => void; // Função chamada após a senha ser alterada
  modoEsqueciSenha?: boolean; // Novo: modo para "esqueci minha senha"
};

const SenhaModal: React.FC<Props> = ({ visible, onClose, onPasswordChanged, modoEsqueciSenha }) => {
  const [email, setEmail] = useState(''); // Novo: estado para email
  const [newPassword, setNewPassword] = useState(''); // Estado da nova senha
  const [confirmPassword, setConfirmPassword] = useState(''); // Estado da confirmação da nova senha
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const auth = getAuth(); // Inicializa autenticação Firebase

  const handleChangePassword = async () => { // Função para alterar a senha
    if (modoEsqueciSenha) {
      // Fluxo de redefinição por e-mail
      if (!email) {
        Alert.alert('Erro', 'Informe o e-mail cadastrado.');
        return;
      }
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, email);
        Alert.alert('Sucesso', 'E-mail de redefinição de senha enviado! Verifique sua caixa de entrada.');
        setEmail('');
        onPasswordChanged();
        onClose();
      } catch (error: any) {
        let errorMessage = 'Não foi possível enviar o e-mail de redefinição.';
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'E-mail não encontrado.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'E-mail inválido.';
        }
        Alert.alert('Erro', errorMessage);
      } finally {
        setLoading(false);
      }
      return;
    }
    // Fluxo normal para alteração de senha
    const user = auth.currentUser; // Obtém usuário logado NO MOMENTO DA AÇÃO

    if (!user) { // Se não houver usuário logado
      Alert.alert('Erro', 'Nenhum usuário logado. Por favor, faça login novamente.'); // Alerta de erro mais claro
      onClose(); // Fecha o modal
      return; // Sai da função
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await updatePassword(user, newPassword);
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      setNewPassword('');
      setConfirmPassword('');
      onPasswordChanged();
      onClose();
    } catch (error: any) {
      let errorMessage = 'Não foi possível alterar a senha.';
      if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Por segurança, faça login novamente para alterar a senha.';
      }
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{modoEsqueciSenha ? 'Redefinir Senha' : 'Alterar Senha'}</Text>
          {modoEsqueciSenha ? (
            <>
              <Text style={styles.label}>E-mail cadastrado:</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>Nova senha:</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Digite a nova senha"
                secureTextEntry
              />
              <Text style={styles.label}>Confirmar nova senha:</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirme a nova senha"
                secureTextEntry
              />
            </>
          )}
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <Button
              title={modoEsqueciSenha ? 'Enviar e-mail de redefinição' : 'Alterar Senha'}
              onPress={handleChangePassword}
              color="#007AFF"
            />
          )}
          <Button title="Cancelar" onPress={onClose} color="#888" />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007AFF',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
});

export default SenhaModal;