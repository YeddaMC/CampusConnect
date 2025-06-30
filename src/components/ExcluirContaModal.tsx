import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Modal, Text, StyleSheet } from 'react-native';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../utils/firebaseService'; // auth centralizado

type Props = {
  visible: boolean;
  onClose: () => void;
  onAccountDeleted: () => void;
};

const ExcluirContaModal: React.FC<Props> = ({ visible, onClose, onAccountDeleted }) => {
  const [senha, setSenha] = useState('');
  const user = auth.currentUser;

  const handleConfirmar = async () => {
    if (!senha) {
      Alert.alert('Erro', 'Por favor, digite sua senha.');
      return;
    }
    if (!user || !user.email) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, senha);

    try {
      await reauthenticateWithCredential(user, credential);
      await user.delete();
      Alert.alert('Sucesso', 'Conta excluída com sucesso.');
      setSenha('');
      onAccountDeleted();
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Erro', 'Senha incorreta. Tente novamente.');
      } else {
        Alert.alert('Erro', error.message || 'Não foi possível excluir a conta.');
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Confirme sua senha</Text>
          <TextInput
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
            autoCapitalize="none"
          />
          <Button title="Confirmar" onPress={handleConfirmar} />
          <View style={{ height: 10 }} />
          <Button title="Cancelar" onPress={() => { setSenha(''); onClose(); }} color="red" />
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

export default ExcluirContaModal;
