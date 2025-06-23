import React from 'react';
import { View, Image } from 'react-native';
import { headerStyles } from '../styles/components/headerStyles';

const Header = () => {
  return (
    <View style={headerStyles.top}>
      <Image
        source={require('../assets/logoAzulVerde.jpg')} // ajuste o caminho conforme seu projeto
        style={headerStyles.logo}
      />
    </View>
  );
};

export default Header;
