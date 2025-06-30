import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

const STORAGE_CPF_KEY = '@campusconnect_cpf';

interface AuthGateProps {
    children: React.ReactNode;
}

const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        (async () => {
            const cpf = await AsyncStorage.getItem(STORAGE_CPF_KEY);
            if (!cpf) {
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }
            setChecking(false);
        })();
    }, [navigation]);

    if (checking) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return <>{children}</>;
};

export default AuthGate;
