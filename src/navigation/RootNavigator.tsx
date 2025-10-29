import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import ClientNavigator from "./ClientNavigator";
import TecnicoNavigator from "./TecnicoNavigator";
import { AuthNavigator } from "./AuthNavigator";

export function RootNavigator() {
  const { isSignedIn, user } = useAuth();

  const getNavigator = () => {
    if (!isSignedIn || !user) return <AuthNavigator />;
    return user.role === "cliente" ? <ClientNavigator /> : <TecnicoNavigator />;
  };

  return <NavigationContainer>{getNavigator()}</NavigationContainer>;
}
