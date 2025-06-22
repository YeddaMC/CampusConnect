// src/components/Header.tsx

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { globalStyles } from '../styles/components/globalStyles';

interface HeaderProps {
  title: string;
  showLogo?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showLogo = false }) => {
  const theme = useTheme();

  return (
    <Appbar.Header style={[styles.header, { backgroundColor: theme.colors.primary }]}>
      {showLogo ? (
        // Linha da imagem comentada
        // <Image
        //   source={require('../../assets/logoAzulVerde.jpg')}
        //   style={styles.logo}
        //   resizeMode="contain"
        // />
        null
      ) : (
        null
      )}
      <Appbar.Content title={title} titleStyle={[styles.title, { color: theme.colors.onPrimary }]} />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
});

export default Header;