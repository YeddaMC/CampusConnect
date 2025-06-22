// src/components/AnuncioCard.tsx

import React from 'react';
// REMOVIDO StyleSheet daqui
import { Card, Title, Paragraph } from 'react-native-paper';

// NOVO: Importa os estilos do arquivo separado
import { anuncioCardStyles } from '../styles/components/feedAnunciosScreenStyles';

interface AnuncioCardProps {
  title: string;
  description: string;
  imageUrl?: string; // URL opcional para a imagem (virá do Firebase Storage)
}

const AnuncioCard: React.FC<AnuncioCardProps> = ({ title, description, imageUrl }) => {
  return (
    <Card style={anuncioCardStyles.card}> {/* USANDO o novo nome do objeto de estilos */}
      {imageUrl && <Card.Cover source={{ uri: imageUrl }} style={anuncioCardStyles.cardImage} />} {/* USANDO o novo nome do objeto de estilos */}
      <Card.Content>
        <Title style={anuncioCardStyles.cardTitle}>{title}</Title> {/* USANDO o novo nome do objeto de estilos */}
        <Paragraph style={anuncioCardStyles.cardDescription}>{description}</Paragraph> {/* USANDO o novo nome do objeto de estilos */}
      </Card.Content>
    </Card>
  );
};

// REMOVIDO bloco de estilos daqui

export default AnuncioCard;