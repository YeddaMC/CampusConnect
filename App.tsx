import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from './src/styles/components/ErrorBoundary';
// importa o ErrorBoundary

export default function App() {
  return (
    <ErrorBoundary> {/* envoltorio ErrorBoundary */}
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
