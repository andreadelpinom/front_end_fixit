// C:\front_end_fixit\front_end_fixit\App.tsx

import { SafeAreaProvider } from "react-native-safe-area-context";

// CORRECCIÓN: Añadir la extensión .tsx para asegurar la resolución
import { RootNavigator } from "./src/navigation/RootNavigator"; 

// CORRECCIÓN: Añadir la extensión .tsx para asegurar la resolución
import { AuthProvider } from "./src/context/AuthContext.tsx"; 

/**
 * Root App Component
 * * Architecture:
 * - SafeAreaProvider: Handles notches and safe areas on mobile devices
 * - AuthProvider: Manages authentication state and provides auth context
 * - RootNavigator: Conditional navigation based on auth state
 */
export default function App() {
  return (
    <SafeAreaProvider>
      {/* AuthProvider debe envolver a RootNavigator para que useAuth funcione */}
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}