// src/styles/components/PerfilStyles.ts
import { StyleSheet } from 'react-native';

export const PerfilStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative', // Importante para posicionar o ícone da câmera
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
  },
  // O estilo cameraIconContainer DEVE estar aqui dentro do objeto
  cameraIconContainer: { // <<<< ESTA PROPRIEDADE PRECISA ESTAR AQUI
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 5,
    elevation: 3, // sombra android
    shadowColor: '#000', // sombra iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  changePhotoText: { // Se não for usar, pode remover
    marginTop: 8,
    color: '#007AFF',
    fontWeight: 'bold',
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
