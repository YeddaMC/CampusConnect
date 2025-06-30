import React, { useRef, useEffect } from 'react';
import { Animated, View, Text, StyleSheet, Dimensions, Easing } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { height, width } = Dimensions.get('window');

const WELCOME_LINES = [
  'Bem-vindo!',
  'Que a sua jornada seja memorável.',
  'Bora crescer juntos?',
  'O futuro começa aqui.'
];

export default function InicialScreen({ navigation }: any) {
  const animatedValue = useRef(new Animated.Value(height * 0.3)).current;
  const naveScale = useRef(new Animated.Value(1)).current;
  const navePositionX = useRef(new Animated.Value(0)).current;
  // Centralização absoluta: nave e círculo ficam no centro da tela
  const naveStartY = height / 2 + height / 2 - 80; // começa fora da tela embaixo
  const naveEndY = 0; // para no centro
  const navePositionY = useRef(new Animated.Value(naveStartY)).current;
  const arrowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: -height * 1.2,
      duration: 11000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        Animated.parallel([
          Animated.timing(naveScale, {
            toValue: 2.5,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(navePositionX, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          // Animação de subida: translateY vai de naveStartY até 0
          Animated.timing(navePositionY, {
            toValue: naveEndY,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(arrowOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
              Animated.timing(arrowOpacity, { toValue: 0, duration: 800, useNativeDriver: true }),
            ])
          ),
        ]).start();
      }
    });
  }, []);

  const handleNavePress = () => {
    navigation.navigate('Login');
  };

  const starPositions = Array.from({ length: 150 }).map(() => ({
    top: Math.random() * height,
    left: Math.random() * width,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.8 + 0.2,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Campus Connect</Text>
      </View>
      {starPositions.map((star, i) => (
        <View
          key={i}
          style={[
            styles.star,
            {
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
      <Animated.View
        style={[
          styles.crawlContainer,
          {
            transform: [
              { perspective: 600 },
              { rotateX: '10deg' },
              { translateY: animatedValue },
            ],
          },
        ]}
      >
        {WELCOME_LINES.map((line, index) => (
          <Text key={index} style={styles.crawlText}>{line}</Text>
        ))}
      </Animated.View>
      <Animated.View
        style={[
          styles.arrowContainer,
          {
            alignSelf: 'center',
            opacity: arrowOpacity,
            transform: [
              { translateY: Animated.add(navePositionY, 120) }
            ],
          },
        ]}
      >
        <Text style={styles.arrow}>⬇️</Text>
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          top: height / 2 - 80, // centraliza o círculo e a nave no centro da tela
          left: 0,
          right: 0,
          alignItems: 'center',
          // A nave agora sobe até o centro exato da tela
          transform: [
            { scale: naveScale },
            { translateX: navePositionX },
            { translateY: navePositionY },
          ],
        }}
      >
        <View style={styles.naveGlow} pointerEvents="none" />
        <MaterialCommunityIcons
          name="ufo"
          size={110}
          color="#00f0ff"
          onPress={handleNavePress}
          style={styles.naveIcon}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#001f4d',
  },
  titleContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  crawlContainer: {
    position: 'absolute',
    bottom: 50,
    width: width * 0.9,
    alignSelf: 'center',
  },
  crawlText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  star: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 50,
  },
  tapText: {
    position: 'absolute',
    bottom: 180,
    alignSelf: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: '#00ffff',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  arrow: {
    fontSize: 35,
    color: '#00ffff',
    textShadowColor: '#00ffff',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  naveIcon: {
    textShadowColor: '#00ffff',
    textShadowRadius: 20,
    textShadowOffset: { width: 0, height: 0 },
  },
  naveGlow: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#00f0ff55',
    shadowColor: '#00f0ff',
    shadowRadius: 30,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
  },
  arrowContainer: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
