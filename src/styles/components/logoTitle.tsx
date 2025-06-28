//src\styles\components\logoTitle.tsx

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function LogoTitle() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logoAzulVerde.jpg')} // ajuste o caminho conforme seu projeto
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 40,
  },
});
