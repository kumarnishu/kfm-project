import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './contexts/UserContext';
import { AlertProvider } from './contexts/AlertContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      retry: false,
      staleTime: 200,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SafeAreaProvider>
          <AlertProvider>
            <AppNavigator />
          </AlertProvider>
        </SafeAreaProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
