import React, { useRef, useEffect } from 'react';
import { Animated, View, Text, StyleSheet, Dimensions, Easing } from 'react-native'; // animações, dimensões, easing
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // ícones vetoriais

const { height, width } = Dimensions.get('window'); // dimensões da tela

const WELCOME_LINES = [ // frases separadas para renderizar
  'Bem-vindo!',
  'Que a sua jornada seja memoravel',
  
  'Bora crescer juntos?',

  'O futuro começa aqui.'
];

export default function InicialScreen({ navigation }: any) {
  const animatedValue = useRef(new Animated.Value(height * 0.3)).current; // posição vertical inicial do texto
  const naveScale = useRef(new Animated.Value(1)).current; // escala inicial da nave
  const navePositionX = useRef(new Animated.Value(0)).current; // posição horizontal da nave (0 = centro)
  const navePositionY = useRef(new Animated.Value(20)).current; // posição vertical da nave (bottom)
  const arrowOpacity = useRef(new Animated.Value(0)).current; // opacidade da seta piscando

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: -height * 1.2, // distância que o texto sobe
      duration: 11000,        // VELOCIDADE ANIMAÇAO DO TEXTO - MAIS RAPIDO
      easing: Easing.linear,  // velocidade constante
      useNativeDriver: true,  // otimização nativa
    }).start(({ finished }) => {
      if (finished) {
        Animated.parallel([
          Animated.timing(naveScale, {
            toValue: 2.5,       // escala final da nave (aumenta rápido)
            duration: 300,      // tempo para aumentar (mais rápido)
            useNativeDriver: true,
          }),
          Animated.timing(navePositionX, {
            toValue: 0,         // posição horizontal final (centrado)
            duration: 500,      // tempo para mover (mais rápido)
            useNativeDriver: true,
          }),
          Animated.timing(navePositionY, {
            toValue: height / 2 - (110 * 2.5) / 2, // sobe para meio da tela (considerando escala e tamanho ícone 110)
            duration: 300,      // tempo para subir se diminui fica mais rapido
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(arrowOpacity, { toValue: 1, duration: 800, useNativeDriver: true }), // fade in seta
              Animated.timing(arrowOpacity, { toValue: 0, duration: 800, useNativeDriver: true }), // fade out seta
            ])
          ), // inicia loop da animação da seta
        ]).start();
      }
    });
  }, []);

  const handleNavePress = () => {
    navigation.navigate('Login'); // navegação ao clicar na nave
  };

  // gera 150 estrelas com posições, tamanhos e brilhos aleatórios
  const starPositions = Array.from({ length: 150 }).map(() => ({
    top: Math.random() * height,     // posição vertical
    left: Math.random() * width,     // posição horizontal
    size: Math.random() * 3 + 1,     // tamanho
    opacity: Math.random() * 0.8 + 0.2, // brilho
  }));

  return (
    <View style={styles.container}>
      <View style={styles.background} /> {/* fundo sólido escuro */}

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Campus Connect</Text> {/* título topo */}
      </View>

      {/* estrelas */}
      {starPositions.map((star, i) => (
        <View
          key={i}
          style={[
            styles.star,
            {
              top: star.top,           // posição vertical
              left: star.left,         // posição horizontal
              width: star.size,        // largura
              height: star.size,       // altura
              opacity: star.opacity,   // brilho
            },
          ]}
        />
      ))}

      {/* texto animado */}
      <Animated.View
        style={[
          styles.crawlContainer,
          {
            transform: [
              { perspective: 600 },    // perspectiva 3D
              { rotateX: '10deg' },    // inclinação texto
              { translateY: animatedValue }, // animação subida texto
            ],
          },
        ]}
      >
        {WELCOME_LINES.map((line, index) => (
          <Text key={index} style={styles.crawlText}>
            {line} {/* frases separadas */}
          </Text>
        ))}
      </Animated.View>

      {/* seta piscando e subindo junto com a nave */}
      <Animated.Text
        style={[
          styles.arrow,
          {
            opacity: arrowOpacity,            // opacidade animada
            position: 'absolute',
            bottom: Animated.add(navePositionY, new Animated.Value(130)), // sobe junto com a nave (130 é offset abaixo da nave)
            alignSelf: 'center',
          },
        ]}
      >
        ⬇️
      </Animated.Text>

      {/* nave animada */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: navePositionY,           // posição vert. 
          alignSelf: 'center',
          transform: [
            { scale: naveScale },          // escala 
            { translateX: navePositionX }, // posição horiz.
          ],
        }}
      >
        <MaterialCommunityIcons
          name="ufo"
          size={110}                      // tamanho base do ícone
          color="#00f0ff"                 // cor 
          onPress={handleNavePress}       // clique nave
          style={styles.naveIcon}         // estilo brilho
        />
        <View style={styles.naveGlow} pointerEvents="none" /> {/* brilho difuso */}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                       // ocupa toda a tela
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#001f4d',    // fundo azul escuro sólido
  },
  titleContainer: {
    marginTop: 40,                 // margem topo
    alignItems: 'center',          // centraliza horizontal
  },
  titleText: {
    fontSize: 36,                  // tamanho fonte título
    fontWeight: 'bold',            // negrito
    color: 'white',                // cor branca
    textShadowColor: '#000',       // sombra preta
    textShadowOffset: { width: 2, height: 2 }, // deslocamento sombra
    textShadowRadius: 8,           // raio sombra
  },
  crawlContainer: {
    position: 'absolute',          // posição absoluta para animação
    bottom: 50,                   // distância base
    width: width * 0.9,           // largura 90% tela
    alignSelf: 'center',          // centraliza horizontal
  },
  crawlText: {
    color: 'white',               // cor texto
    fontSize: 32,                 // tamanho fonte texto
    fontWeight: 'bold',           // negrito
    textAlign: 'center',          // alinhamento centro
    marginBottom: 10,             // espaço entre frases
    textShadowColor: '#000',      // sombra preta
    textShadowOffset: { width: 2, height: 2 }, // deslocamento sombra
    textShadowRadius: 5,          // raio sombra
  },
  star: {
    position: 'absolute',         // posição absoluta
    backgroundColor: 'white',     // cor branca
    borderRadius: 50,             // borda arredondada (círculo)
  },
  tapText: {
    position: 'absolute',         // posição absoluta
    bottom: 180,                 // distância base
    alignSelf: 'center',          // centraliza horizontal
    color: 'white',              // cor branca
    fontSize: 18,                // tamanho fonte
    fontWeight: '600',           // semi-negrito
    textShadowColor: '#00ffff',  // sombra azul clara
    textShadowRadius: 10,        // raio sombra
    textShadowOffset: { width: 0, height: 0 }, // deslocamento sombra
  },
  arrow: {
    fontSize: 35,                // tamanho da seta
    color: '#00ffff',            // cor azul clara
    textShadowColor: '#00ffff',  // sombra azul clara
    textShadowRadius: 10,        // raio sombra
    textShadowOffset: { width: 0, height: 0 }, // deslocamento sombra
  },
  naveIcon: {
    textShadowColor: '#00ffff',  // brilho ícone
    textShadowRadius: 20,        // raio brilho
    textShadowOffset: { width: 0, height: 0 }, // deslocamento brilho
  },
  naveGlow: {
    position: 'absolute',         // posição absoluta
    bottom: 15,                  // distância base
    alignSelf: 'center',         // centraliza horizontal
    width: 160,                  // largura brilho
    height: 160,                 // altura brilho
    borderRadius: 80,            // borda arredondada
    backgroundColor: '#00f0ff55', // cor translúcida
    shadowColor: '#00f0ff',      // cor sombra
    shadowRadius: 30,            // raio sombra
    shadowOpacity: 0.8,          // opacidade sombra
    shadowOffset: { width: 0, height: 0 }, // deslocamento sombra
  },
});
