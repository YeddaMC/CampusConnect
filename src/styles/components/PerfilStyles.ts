import { StyleSheet } from 'react-native';

export const PerfilStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'transparent', // Para não cobrir o degradê
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  // Luz expandida na foto: shadowRadius maior e borderRadius maior que a imagem
  imageWrapper: {
  shadowColor: '#00f0ff',        // Cor azul suave da sombra
  shadowOffset: { width: 0, height: 0 }, // Sem deslocamento para sombra centralizada
  shadowOpacity: 0.8,             // Aumente para deixar a sombra mais intensa (0 a 1)
  shadowRadius: 80,               // AUMENTAR para mais luz espalhada
  elevation: 25,                  // AumentAR para sombra mais forte no Android
  borderRadius: 80,               // metade do tamanho do container para manter círculo perfeito
  width: 160,                    // largura do container da sombra (maior que a imagem)
  height: 160,                   // Altura do container da sombra
  alignItems: 'center',          // Centraliza a imagem dentro do wrapper
  justifyContent: 'center',
  backgroundColor: 'transparent', // Fundo transparente para não cobrir a sombra
},
profileImage: {
  width: 120,
  height: 120,
  borderRadius: 60,
  backgroundColor: '#ccc',
},

  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  userInfo: {
    fontSize: 16,
    marginVertical: 5,
  },
  spacer: {
    height: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});
