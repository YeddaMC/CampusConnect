// src/styles/components/feedAnunciosScreenStyles.ts
import { StyleSheet } from 'react-native';
import { theme } from './globalStyles';
// caminho relativo correto para o tema global

export const feedAnunciosScreenStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: theme.colors.text,
  },
  listContent: {
    paddingBottom: 70,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  whatsapp: {
    fontSize: 12,
    color: '#25D366', // verde WhatsApp
    fontWeight: 'bold',
  },
});
