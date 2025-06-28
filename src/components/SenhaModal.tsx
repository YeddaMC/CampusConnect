// src/components/SenhaModal.tsx
import React, { useState } from 'react'; // Importa hooks do React
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
import { getAuth, updatePassword } from 'firebase/auth'; // Funções de autenticação Firebase

type Props = { // Tipo de props para o componente
  visible: boolean; // Visibilidade do modal
  onClose: () => void; // Função para fechar o modal
  onPasswordChanged: () => void; // Função chamada após a senha ser alterada
};

const SenhaModal: React.FC<Props> = ({ visible, onClose, onPasswordChanged }) => { // Definição do componente SenhaModal
  const [newPassword, setNewPassword] = useState(''); // Estado da nova senha
  const [confirmPassword, setConfirmPassword] = useState(''); // Estado da confirmação da nova senha
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const auth = getAuth(); // Inicializa autenticação Firebase
  
  const handleChangePassword = async () => { // Função para alterar a senha
    const user = auth.currentUser; // Obtém usuário logado NO MOMENTO DA AÇÃO

    if (!user) { // Se não houver usuário logado
      Alert.alert('Erro', 'Nenhum usuário logado. Por favor, faça login novamente.'); // Alerta de erro mais claro
      onClose(); // Fecha o modal
      return; // Sai da função
    }

    if (!newPassword || !confirmPassword) { // Se algum campo estiver vazio
      Alert.alert('Erro', 'Preencha todos os campos.'); // Alerta para preencher campos
      return; // Sai da função
    }
    if (newPassword !== confirmPassword) { // Se nova senha e confirmação não coincidem
      Alert.alert('Erro', 'A nova senha e a confirmação não coincidem.'); // Alerta de erro
      return; // Sai da função
    }
    if (newPassword.length < 6) { // Se nova senha tiver menos de 6 caracteres
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres.'); // Alerta de erro
      return; // Sai da função
    }

    setLoading(true); // Inicia o carregamento
    try { // Tenta alterar senha
      // Não é mais necessário reautenticar com a senha antiga.
      // Apenas atualizamos a nova senha diretamente no usuário logado.
      await updatePassword(user, newPassword); // Atualiza a senha no Firebase

      Alert.alert('Sucesso', 'Senha alterada com sucesso!'); // Alerta de sucesso

      setNewPassword(''); // Limpa campo de nova senha
      setConfirmPassword(''); // Limpa campo de confirmação de senha
      onPasswordChanged(); // Notifica o componente pai
      onClose(); // Fecha o modal
    } catch (error: any) { // Captura erros
      console.error('Erro ao alterar senha:', error); // Loga o erro no console - ESTE É O ERRO QUE PRECISAMOS!
      let errorMessage = 'Não foi possível alterar a senha.'; // Mensagem de erro padrão
      if (error.code === 'auth/requires-recent-login') { // Sessão expirada
        errorMessage = 'Sua sessão expirou. Por favor, faça login novamente para alterar sua senha.';
        // Você pode considerar deslogar o usuário ou redirecioná-lo para a tela de login aqui
      } else if (error.message) { // Outra mensagem de erro do Firebase
        errorMessage = error.message;
      }
      Alert.alert('Erro', errorMessage); // Exibe alerta de erro
    } finally { // Finaliza a execução (com ou sem erro)
      setLoading(false); // Termina o carregamento
    }
  };

  return ( // Renderização do componente
    <Modal // Componente de modal
      visible={visible} // Visibilidade do modal
      animationType="slide" // Tipo de animação
      transparent={true} // Fundo transparente
      onRequestClose={onClose} // Fecha modal ao apertar botão de voltar (Android)
    >
      <KeyboardAvoidingView // Ajusta a tela para o teclado
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} // Comportamento (padding para iOS)
        style={styles.modalBackground} // Estilo de fundo do modal
      >
        <View style={styles.modalContainer}> {/* Container interno do modal */}
          <Text style={styles.title}>Alterar Senha</Text> {/* Título do modal */}

          <TextInput // Campo de nova senha
            placeholder="Nova senha" // Placeholder
            secureTextEntry // Esconde o texto
            value={newPassword} // Valor do campo
            onChangeText={setNewPassword} // Atualiza estado ao digitar
            style={styles.input} // Estilo do input
            autoCapitalize="none" // Desabilita capitalização automática
            textContentType="newPassword" // Tipo de conteúdo para autofill
            editable={!loading} // Desabilita input durante o carregamento
          />

          <TextInput // Campo de confirmação de nova senha
            placeholder="Confirme a nova senha" // Placeholder
            secureTextEntry // Esconde o texto
            value={confirmPassword} // Valor do campo
            onChangeText={setConfirmPassword} // Atualiza estado ao digitar
            style={styles.input} // Estilo do input
            autoCapitalize="none" // Desabilita capitalização automática
            textContentType="newPassword" // Tipo de conteúdo para autofill
            editable={!loading} // Desabilita input durante o carregamento
          />

          <View style={styles.buttons}> {/* Container dos botões */}
            <Button title="Cancelar" color="gray" onPress={onClose} disabled={loading} /> {/* Botão Cancelar */}
            <Button // Botão Confirmar
              title={loading ? 'Confirmando...' : 'Confirmar'} // Título dinâmico (carregando/confirmar)
              onPress={handleChangePassword} // Ação de alterar senha
              disabled={loading} // Desabilita botão durante o carregamento
            />
          </View>
          {loading && <ActivityIndicator size="small" color="#0000ff" style={{ marginTop: 10 }} />} {/* Indicador de carregamento */}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({ // Definição dos estilos
  modalBackground: { // Estilo de fundo do modal
    flex: 1, // Preenchimento total
    backgroundColor: 'rgba(0,0,0,0.5)', // Fundo semi-transparente
    justifyContent: 'center', // Alinha conteúdo ao centro (vertical)
    alignItems: 'center', // Alinha conteúdo ao centro (horizontal)
  },
  modalContainer: { // Container interno do modal
    width: '90%', // Largura
    backgroundColor: 'white', // Cor de fundo
    borderRadius: 8, // Borda arredondada
    padding: 20, // Preenchimento interno
    elevation: 10, // Sombra (Android)
  },
  title: { // Estilo do título
    fontSize: 22, // Tamanho da fonte
    fontWeight: 'bold', // Peso da fonte
    marginBottom: 20, // Margem inferior
    textAlign: 'center', // Alinhamento do texto
  },
  input: { // Estilo dos campos de input
    borderWidth: 1, // Largura da borda
    borderColor: '#ccc', // Cor da borda
    borderRadius: 6, // Borda arredondada
    paddingHorizontal: 12, // Preenchimento horizontal
    height: 45, // Altura
    marginBottom: 15, // Margem inferior
  },
  buttons: { // Estilo do container dos botões
    flexDirection: 'row', // Layout em linha
    justifyContent: 'space-between', // Espaçamento entre itens
  },
});

export default SenhaModal; // Exporta o componente