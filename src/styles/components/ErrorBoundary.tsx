//src\styles\components\ErrorBoundary.tsx
import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo deu errado. Por favor, tente novamente mais tarde.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
