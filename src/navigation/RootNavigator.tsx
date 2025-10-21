import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

// Navigators por rol
import ClientNavigator from "./ClientNavigator";
import TecnicoNavigator from "./TecnicoNavigation";

// Pantallas de autenticación
import LoginScreen from "../screens/common/Login";
import RegisterScreen from "../screens/common/Register";

// Stack para autenticación
const AuthStack = createNativeStackNavigator();

/**
 * RootNavigator
 * 
 * - Si el usuario no está logueado → AuthStack (Login/Register)
 * - Si el usuario está logueado:
 *    - Rol cliente → ClientNavigator
 *    - Rol técnico → TecnicoNavigator
 */
export function RootNavigator() {
  const { isSignedIn, user } = useAuth();

  // Extraer la lógica fuera del JSX para evitar ternarios anidados
  let content;
  if (isSignedIn && user) {
    content = user.role === "cliente" ? <ClientNavigator /> : <TecnicoNavigator />;
  } else {
    content = (
      <AuthStack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FFFFFF" }
        }}
      >
        <AuthStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ animationTypeForReplace: "pop" }}
        />
        <AuthStack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ animationTypeForReplace: "pop" }}
        />
      </AuthStack.Navigator>
    );
  }

  return <NavigationContainer>{content}</NavigationContainer>;
}
