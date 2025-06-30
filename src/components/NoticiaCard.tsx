// src/components/NoticiaCard.tsx
import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Card, Title, Paragraph, useTheme } from 'react-native-paper';

interface NoticiaCardProps {
  title: string;
  description: string;
  date: string;
  imageUrl?: string; // URL opcional para a imagem (virá do Firebase Storage)
}

const NoticiaCard: React.FC<NoticiaCardProps> = ({ title, description, date, imageUrl }) => {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.cardTitle}>{title}</Title>
      </Card.Content>
      {imageUrl && <Card.Cover source={{ uri: imageUrl }} style={styles.cardImage} />}
      <Card.Content>
        <Paragraph style={styles.cardDescription}>{description}</Paragraph>
        <Paragraph style={styles.cardDate}>{date}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 4,
    borderRadius: 10,
    elevation: 2, // Sombra para Android
    shadowOffset: { width: 0, height: 2 }, // Sombra para iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    height: 180, // Altura da imagem
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
});

export default NoticiaCard;