import React, { useState, useEffect } from 'react'; // Importa hooks do React
import {
  ScrollView, // Componente de rolagem
  View, // Container genérico
  Text, // Componente para texto
  Button, // Componente de botão
  StyleSheet, // Para estilos CSS-in-JS
  Alert, // Para exibir alertas nativos
  Image, // Componente para imagens
  Modal, // Mantém, caso tenha outro modal que precise do react-native Modal (ex: ExcluirContaModal usa)
  ActivityIndicator, // Indicador de carregamento
  TouchableOpacity, // Componente para toque
  TextInput, // Campo de entrada de texto
  Dimensions, // Para obter dimensões da tela
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Ferramenta para seleção de imagens
import AsyncStorage from '@react-native-async-storage/async-storage'; // Armazenamento local assíncrono
import { Ionicons } from '@expo/vector-icons'; // Ícones

import { auth } from '../utils/firebaseService'; // auth centralizado

import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Tipo de navegação
import { RootStackParamList } from '../navigation/types'; // Definição de tipos de rotas
import { PerfilStyles } from '../styles/components/PerfilStyles'; // Estilos do perfil

import ExcluirContaModal from '../components/ExcluirContaModal'; // Importa modal de exclusão de conta
import SenhaModal from '../components/SenhaModal'; // Importa modal de alteração de senha (CAMINHO CORRIGIDO)

import { CommonActions } from '@react-navigation/native'; // Ações de navegação comuns

import { LinearGradient } from 'expo-linear-gradient'; // Componente de gradiente linear

type PerfilScreenNavigationProp = NativeStackNavigationProp< // Tipo de prop de navegação
  RootStackParamList,
  'Perfil'
>;

type Props = { // Tipo de props para o componente
  navigation: PerfilScreenNavigationProp; // Propriedade de navegação
};

const STORAGE_KEY = '@profile_image_uri'; // Chave para armazenamento local da imagem

const { width, height } = Dimensions.get('window'); // Largura e altura da janela
const NUM_STARS = 50; // Número de estrelas para o fundo

const PerfilScreen: React.FC<Props> = ({ navigation }) => { // Definição do componente PerfilScreen
  const [user] = useState(auth.currentUser); // Obtém usuário logado
  const [imageUri, setImageUri] = useState<string | null>(null); // Estado da URI da imagem de perfil
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [modalVisible, setModalVisible] = useState(false); // Estado de visibilidade do modal de Excluir Conta
  const [senhaModalVisible, setSenhaModalVisible] = useState(false); // Estado de visibilidade do modal de Senha

  useEffect(() => { // Hook para efeitos colaterais (carregar imagem ao montar)
    const loadImage = async () => { // Função assíncrona para carregar imagem
      try { // Tenta carregar imagem
        const uri = await AsyncStorage.getItem(STORAGE_KEY); // Pega URI do armazenamento local
        if (uri) setImageUri(uri); // Define URI se existir
      } catch { // Captura erros
        // erro ignorado // Ignora erros de carregamento
      }
    };
    loadImage(); // Chama a função para carregar imagem
  }, []); // Executa uma vez ao montar o componente

  const pickImage = async () => { // Função para escolher imagem
    try { // Tenta solicitar permissões
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync(); // Solicita permissão da câmera
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Solicita permissão da galeria

      if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') { // Se permissões não concedidas
        Alert.alert( // Alerta de permissão necessária
          'Permissão necessária',
          'Precisamos de permissão para acessar a câmera e a galeria.'
        );
        return; // Sai da função
      }

      Alert.alert( // Alerta para seleção de foto (câmera ou galeria)
        'Selecionar Foto',
        'Deseja tirar uma foto ou escolher da galeria?',
        [ // Opções do alerta
          {
            text: 'Câmera', // Opção Câmera
            onPress: async () => { // Ação ao selecionar Câmera
              try { // Tenta abrir a câmera
                const result = await ImagePicker.launchCameraAsync({ // Lança a câmera
                  allowsEditing: true, // Permite edição
                  aspect: [1, 1], // Proporção 1:1
                  quality: 1, // Qualidade máxima
                });
                if (!result.canceled && result.assets.length > 0) { // Se não cancelado e com asset
                  await saveImageLocally(result.assets[0].uri); // Salva imagem localmente
                }
              } catch { // Captura erro
                Alert.alert('Erro', 'Não foi possível abrir a câmera.'); // Alerta de erro
              }
            },
          },
          {
            text: 'Galeria', // Opção Galeria
            onPress: async () => { // Ação ao selecionar Galeria
              try { // Tenta abrir a galeria
                const result = await ImagePicker.launchImageLibraryAsync({ // Lança a galeria
                  allowsEditing: true, // Permite edição
                  aspect: [1, 1], // Proporção 1:1
                  quality: 1, // Qualidade máxima
                });
                if (!result.canceled && result.assets.length > 0) { // Se não cancelado e com asset
                  await saveImageLocally(result.assets[0].uri); // Salva imagem localmente
                }
              } catch { // Captura erro
                Alert.alert('Erro', 'Não foi possível abrir a galeria.'); // Alerta de erro
              }
            },
          },
          { text: 'Cancelar', style: 'cancel' }, // Opção Cancelar
        ]
      );
    } catch { // Captura erro de permissão
      Alert.alert('Erro', 'Falha ao solicitar permissões.'); // Alerta de erro
    }
  };

  const saveImageLocally = async (uri: string) => { // Função para salvar imagem localmente
    try { // Tenta salvar
      await AsyncStorage.setItem(STORAGE_KEY, uri); // Salva URI no armazenamento local
      setImageUri(uri); // Define URI no estado
    } catch { // Captura erro
      Alert.alert('Erro', 'Não foi possível salvar a imagem localmente.'); // Alerta de erro
    }
  };

  const handleLogout = async () => { // Função para fazer logout
    try {
      await AsyncStorage.removeItem('@campusconnect_cpf'); // Remove CPF salvo
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  const handleDeleteAccount = () => { // Função para lidar com exclusão de conta
    setModalVisible(true); // Abre o modal de exclusão
  };

  const handleAccountDeleted = () => { // Função chamada após conta ser excluída
    setModalVisible(false); // Fecha o modal de exclusão
    navigation.replace('Login'); // Navega para a tela de Login
  };

  const handlePasswordChangedInModal = () => { // Função chamada após senha ser alterada no modal
    setSenhaModalVisible(false); // Fecha o modal de senha
    // Opcional: Adicionar um alerta ou outra ação após a senha ser alterada
    // Alert.alert('Sucesso', 'Senha alterada com sucesso via modal!');
  };

  const starPositions = Array.from({ length: NUM_STARS }).map(() => ({ // Gera posições das estrelas
    top: Math.random() * height, // Posição Y aleatória
    left: Math.random() * width, // Posição X aleatória
    size: Math.random() * 2 + 1, // Tamanho aleatório
    opacity: Math.random() * 0.6 + 0.3, // Opacidade aleatória
  }));

  return ( // Renderização do componente
    <LinearGradient // Componente de gradiente de fundo
      colors={['#004e92', '#00b09b']} // Cores do gradiente
      style={{ flex: 1 }} // Estilo de preenchimento total
    >
      {/* Fundo estrelado */}
      {starPositions.map((star, i) => ( // Mapeia posições para renderizar estrelas
        <View
          key={i} // Chave única
          style={{ // Estilos da estrela
            position: 'absolute', // Posicionamento absoluto
            top: star.top, // Posição Y
            left: star.left, // Posição X
            width: star.size, // Largura
            height: star.size, // Altura
            borderRadius: star.size / 2, // Formato circular
            backgroundColor: 'white', // Cor branca
            opacity: star.opacity, // Opacidade
          }}
        />
      ))}

      <ScrollView contentContainerStyle={PerfilStyles.container} keyboardShouldPersistTaps="handled"> {/* ScrollView principal */}
        {/* Botão Voltar */}
        <TouchableOpacity // Botão de voltar
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }} // Estilo do container
          onPress={() => navigation.goBack()} // Ação de voltar
          accessibilityLabel="Voltar" // Rótulo de acessibilidade
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" /> {/* Ícone de seta para trás */}
          <Text style={{ color: '#007AFF', fontSize: 18, marginLeft: 5 }}>Voltar</Text> {/* Texto "Voltar" */}
        </TouchableOpacity>

        {/* Foto do usuário com iluminação expandida */}
        <View style={PerfilStyles.imageContainer}> {/* Container da imagem */}
          {imageUri ? ( // Se houver URI da imagem
            <View style={PerfilStyles.imageWrapper}> {/* Wrapper da imagem */}
              <Image source={{ uri: imageUri }} style={PerfilStyles.profileImage} /> {/* Imagem de perfil */}
            </View>
          ) : ( // Se não houver URI
            <View
              style={[ // Estilo da imagem de perfil padrão
                PerfilStyles.profileImage,
                { justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccc' },
              ]}
            >
              <Ionicons name="person-circle" size={120} color="#888" /> {/* Ícone de pessoa padrão */}
            </View>
          )}

          <TouchableOpacity onPress={pickImage} style={PerfilStyles.cameraIconContainer}> {/* Botão da câmera */}
            <Ionicons name="camera" size={30} color="#555" /> {/* Ícone da câmera */}
          </TouchableOpacity>
        </View>

        <Text style={PerfilStyles.userName}> {user?.displayName || 'Usuário'}</Text> {/* Nome do usuário em destaque */}
        <Text style={PerfilStyles.userInfo}>E-mail: {user?.email}</Text> {/* E-mail do usuário */}

        {loading ? ( // Se estiver carregando
          <ActivityIndicator size="large" color="#0000ff" /> // Exibe indicador de carregamento
        ) : ( // Se não estiver carregando
          <>
            {/* Botão Logout */}
            <Button title="Logout" onPress={handleLogout} /> {/* Botão de Logout */}
            <View style={PerfilStyles.spacer} /> {/* Espaçador */}

            {/* Botão Alterar Senha AGORA ABRE O MODAL */}
            <Button title="Alterar Senha" onPress={() => setSenhaModalVisible(true)} /> {/* Botão para abrir modal de senha */}
            <View style={PerfilStyles.spacer} /> {/* Espaçador */}

            {/* Botão Excluir Conta embaixo e cinza */}
            <Button // Botão de Excluir Conta
              title="Excluir Conta" // Título do botão
              color="#808080" // Cor do botão
              onPress={handleDeleteAccount} // Ação de abrir modal de exclusão
            />
            <View style={PerfilStyles.spacer} /> {/* Espaçador */}

            {/* Modal de Excluir Conta (já existente) */}
            <ExcluirContaModal // Componente do modal de exclusão
              visible={modalVisible} // Visibilidade do modal
              onClose={() => setModalVisible(false)} // Função para fechar o modal
              onAccountDeleted={handleAccountDeleted} // Função chamada após exclusão
            />

            {/* NOVO: Modal de Alterar Senha */}
            <SenhaModal // Componente do modal de senha
              visible={senhaModalVisible} // Visibilidade do modal
              onClose={() => setSenhaModalVisible(false)} // Função para fechar o modal
              onPasswordChanged={handlePasswordChangedInModal} // Função chamada após alteração
            />
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

// Se você já tem PerfilStyles definido em PerfilStyles.ts,
// pode remover este bloco de estilos e usar apenas PerfilStyles.
/*
const styles = StyleSheet.create({
  gradientBackground: { // Estilo de fundo gradiente
    flex: 1, // Preenchimento total
  },
  container: { // Estilo do container principal
    flexGrow: 1, // Cresce para preencher
    padding: 20, // Preenchimento interno
    alignItems: 'center', // Alinha itens ao centro
  },
  userIcon: { // Ícone de usuário (não usado diretamente no JSX atual)
    position: 'absolute', // Posicionamento absoluto
    top: 40, // Posição superior
    right: 20, // Posição direita
    zIndex: 10, // Ordem de empilhamento
  },
  avatarContainer: { // Container do avatar (não usado diretamente no JSX atual)
    marginTop: 80, // Margem superior
    marginBottom: 20, // Margem inferior
    position: 'relative', // Posicionamento relativo
    alignItems: 'center', // Alinha itens ao centro
  },
  avatar: { // Estilo do avatar (não usado diretamente no JSX atual)
    width: 140, // Largura
    height: 140, // Altura
    borderRadius: 70, // Borda circular
    borderWidth: 3, // Largura da borda
    borderColor: '#fff', // Cor da borda
  },
  avatarGlow: { // Efeito de brilho do avatar (não usado diretamente no JSX atual)
    position: 'absolute', // Posicionamento absoluto
    top: -10, // Posição superior
    left: -10, // Posição esquerda
    width: 160, // Largura
    height: 160, // Altura
    borderRadius: 80, // Borda circular
    backgroundColor: '#4c669f', // Cor de fundo
    opacity: 0.5, // Opacidade
    shadowColor: '#4c669f', // Cor da sombra
    shadowOffset: { width: 0, height: 0 }, // Offset da sombra
    shadowOpacity: 0.9, // Opacidade da sombra
    shadowRadius: 20, // Raio da sombra
    zIndex: -1, // Ordem de empilhamento
  },
  cameraIcon: { // Ícone da câmera (não usado diretamente no JSX atual)
    position: 'absolute', // Posicionamento absoluto
    bottom: 0, // Posição inferior
    right: 10, // Posição direita
    backgroundColor: '#3b5998', // Cor de fundo
    borderRadius: 20, // Borda circular
    padding: 6, // Preenchimento interno
  },
  starsContainer: { // Container das estrelas (não usado diretamente no JSX atual)
    flexDirection: 'row', // Layout em linha
    marginBottom: 15, // Margem inferior
  },
  star: { // Estilo da estrela (não usado diretamente no JSX atual)
    marginHorizontal: 2, // Margem horizontal
  },
  userNameInput: { // Input do nome do usuário (não usado diretamente no JSX atual)
    fontSize: 26, // Tamanho da fonte
    fontWeight: 'bold', // Peso da fonte
    color: '#fff', // Cor do texto
    marginBottom: 30, // Margem inferior
    width: '100%', // Largura total
    textAlign: 'center', // Alinhamento do texto
  },
  buttonsContainer: { // Container dos botões (não usado diretamente no JSX atual)
    width: '100%', // Largura total
  },
  spacer: { // Espaçador
    height: 15, // Altura
  },
  modalBackground: { // Estilo de fundo do modal (geralmente usado em componentes de modal)
    flex: 1, // Preenchimento total
    backgroundColor: 'rgba(0,0,0,0.5)', // Fundo semi-transparente
    justifyContent: 'center', // Alinha conteúdo ao centro (vertical)
    alignItems: 'center', // Alinha conteúdo ao centro (horizontal)
  },
  modalContainer: { // Container interno do modal (geralmente usado em componentes de modal)
    width: '90%', // Largura
    backgroundColor: 'white', // Cor de fundo
    borderRadius: 8, // Borda arredondada
    padding: 20, // Preenchimento interno
    elevation: 10, // Sombra (Android)
  },
  title: { // Título (geralmente usado em componentes de modal)
    fontSize: 22, // Tamanho da fonte
    fontWeight: 'bold', // Peso da fonte
    marginBottom: 20, // Margem inferior
    textAlign: 'center', // Alinhamento do texto
  },
  input: { // Campo de input (geralmente usado em componentes de modal)
    borderWidth: 1, // Largura da borda
    borderColor: '#ccc', // Cor da borda
    borderRadius: 6, // Borda arredondada
    paddingHorizontal: 12, // Preenchimento horizontal
    height: 45, // Altura
    marginBottom: 15, // Margem inferior
  },
  buttons: { // Container dos botões (geralmente usado em componentes de modal)
    flexDirection: 'row', // Layout em linha
    justifyContent: 'space-between', // Espaçamento entre itens
  },
});
*/
export default PerfilScreen; // Exporta o componente