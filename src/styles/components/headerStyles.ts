import { StyleSheet } from 'react-native';

export const headerStyles = StyleSheet.create({
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // ou a cor do seu tema
    zIndex: 10, // para ficar acima dos outros componentes
    elevation: 5, // sombra no Android
    shadowColor: '#000', // sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
});
