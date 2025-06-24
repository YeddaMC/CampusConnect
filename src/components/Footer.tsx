import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Footer() {
  const openWhatsApp = () => {
    const phoneNumber = '5511999999999'; // ajuste para seu número no formato internacional
    const url = `whatsapp://send?phone=${phoneNumber}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert('Erro', 'WhatsApp não está instalado no dispositivo');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(() => Alert.alert('Erro', 'Não foi possível abrir o WhatsApp'));
  };

  return (
    <LinearGradient
      colors={['#007AFF', '#00C853']} // gradiente azul para verde
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <TouchableOpacity style={styles.button} onPress={openWhatsApp} activeOpacity={0.7}>
        <Ionicons name="logo-whatsapp" size={30} color="#fff" />
        <Text style={styles.text}>Fale Conosco</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontStyle: 'italic',
    fontSize: 18,
    marginLeft: 8,
  },
});
