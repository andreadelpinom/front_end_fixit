import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { colors } from "../theme/colors";

interface CertificationBannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificationBanner({
  isOpen,
  onClose
}: CertificationBannerProps) {
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

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 12
  },
  banner: {
    width: "100%",
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.text.tertiary,
    fontWeight: "700"
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.borderLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16
  },
  icon: {
    fontSize: 32
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 8,
    textAlign: "center"
  },
  description: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 18
  },
  benefitsContainer: {
    width: "100%",
    marginBottom: 16,
    gap: 8
  },
  benefit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6
  },
  benefitIcon: {
    fontSize: 16,
    color: colors.status.success,
    fontWeight: "700"
  },
  benefitText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: "500"
  },
  button: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center"
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600"
  }
});
