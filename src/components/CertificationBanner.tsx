import { useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";
import { GenericModal } from "./GenericModal";

export default function CertificationBanner({ isOpen, onClose }: any) {
  const [scaleAnim] = useState(new Animated.Value(isOpen ? 1 : 0.95));
  const [opacityAnim] = useState(new Animated.Value(isOpen ? 1 : 0));

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true })
      ]).start();
    }
  }, [isOpen]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 300, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => onClose());
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={handleClose}
      content={
        <View>
          <Text>🎓 ¡Felicidades! Has sido certificado</Text>
          <Text>Tu perfil ahora cuenta con el distintivo oficial de técnico certificado.</Text>
        </View>
      }
    />
  );
}
