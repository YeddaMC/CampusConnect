// src\styles\components\globalStyles.ts
import { StyleSheet } from 'react-native';
import { DefaultTheme } from 'react-native-paper';

// Você pode estender o tema padrão do React Native Paper
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1E88E5', // Um azul mais vibrante
    accent: '#FFC107', // Um amarelo/laranja
    background: '#F5F5F5', // Um cinza claro para o fundo
    text: '#333333',
    // Adicione outras cores que você queira padronizar
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10, // Ajuste para o conteúdo não ficar colado no header
  },
  // Adicione outros estilos globais aqui, se necessário
});