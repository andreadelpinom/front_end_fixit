import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/common/Login";
import RegisterScreen from "../screens/common/Register";

const Stack = createNativeStackNavigator();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#FFFFFF" } }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
