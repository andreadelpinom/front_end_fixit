import { View, Text, TouchableOpacity, Animated } from "react-native";
import { CertificationBannerStyles as styles } from "../styles";
import { CertificationBannerProps } from "../interface";
import { useEffect, useState } from "react";

export default function CertificationBanner({
  isOpen,
  onClose
}: Readonly<CertificationBannerProps>) {
  const [scaleAnim] = useState(new Animated.Value(isOpen ? 1 : 0.95));
  const [opacityAnim] = useState(new Animated.Value(isOpen ? 1 : 0));

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [isOpen]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim
        }
      ]}
    >
      <View style={styles.banner}>
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          activeOpacity={0.7}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🎓</Text>
        </View>

        {/* Content */}
        <Text style={styles.title}>¡Felicidades!</Text>
        <Text style={styles.subtitle}>
          Has sido certificado como técnico verificado
        </Text>
        <Text style={styles.description}>
          Tu perfil ahora cuenta con el distintivo oficial de técnico certificado por FixIt
          Home. Esto te ayudará a conseguir más clientes.
        </Text>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>Más visibilidad en búsquedas</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>Mayor confianza de clientes</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>Mejor posicionamiento</Text>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleClose}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Ver mi perfil certificado</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
