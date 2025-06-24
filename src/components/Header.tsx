import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderProps {
  title: string;
  showLogo: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showLogo }) => {
  return (
    <LinearGradient
      colors={['#00C853', '#007AFF']} // gradiente verde para azul (invertido)
      start={{ x: 1, y: 0 }} // começa da direita
      end={{ x: 0, y: 0 }}   // vai para a esquerda
      style={styles.header}
    >
      {showLogo && (
        <Image
          source={require('../assets/logoAzulVerde.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      )}
      <Text style={styles.title}>{title}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    // Removido backgroundColor para usar o gradiente
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // texto branco para contraste com o gradiente
  },
});

export default Header;
