import React, { useMemo } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { styles } from './ProposalDetailScreen.styles';
import { ProposalDetailRequestSection } from './sections/ProposalDetailRequestSection';
import { ProposalDetailTechnicianSection } from './sections/ProposalDetailTechnicianSection';
import { ProposalDetailOfferSection } from './sections/ProposalDetailOfferSection';
import { useProposalDetail } from './useProposalDetail';
import { ProposalListItem, ProposalsRequestSummary } from './useProposalsList';
import { theme } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { ClientServicesStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<ClientServicesStackParamList, 'ProposalDetail'>;

type RouteParams = {
  idSolicitud: number;
  proposal: ProposalListItem;
  summary?: ProposalsRequestSummary | null;
};

export default function ProposalDetailScreen({ navigation, route }: Props): React.ReactElement {
  const { idSolicitud, proposal: initialProposal, summary } = route.params as RouteParams;
  const { proposal, accepting, isAccepted, error, acceptProposal } = useProposalDetail(initialProposal, idSolicitud);

  const publishableStatuses = useMemo(() => ['PENDIENTE', 'PUBLICADA'], []);

  const navigateBackToRequestDetails = () => {
    const state = navigation.getState();
    const { routes } = state;
    const requestDetailsIndex = routes.findIndex(route => route.name === 'RequestDetails');

    if (requestDetailsIndex >= 0) {
      const routesToPop = routes.length - 1 - requestDetailsIndex;
      if (routesToPop > 0) {
        navigation.pop(routesToPop);
      }
      return;
    }

    navigation.popToTop();
    navigation.navigate('RequestDetails', { idSolicitud });
  };

  const handleAccept = async () => {
    const result = await acceptProposal();
    if (!result.success) {
      return;
    }

    const nextStatus = (result.details?.estadoSolicitud ?? '').toUpperCase();
    const handlePostAlertNavigation = () => {
      if (!publishableStatuses.includes(nextStatus) || result.proposalsCount === 0) {
        navigateBackToRequestDetails();
        return;
      }

      navigation.goBack();
    };

    Alert.alert('Propuesta aceptada', 'El técnico fue asignado a tu solicitud.', [
      { text: 'Aceptar', onPress: handlePostAlertNavigation },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ProposalDetailRequestSection requestId={idSolicitud} summary={summary ?? null} />
          <ProposalDetailTechnicianSection proposal={proposal} />
          <ProposalDetailOfferSection proposal={proposal} />

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Garantía</Text>
            </View>
            <View style={styles.guaranteeCard}>
              <Ionicons name="shield-checkmark" size={28} color={theme.colors.primary} />
              <Text style={styles.guaranteeTitle}>Cobertura FixIt</Text>
              <Text style={styles.guaranteeText}>
                Si algo no sale como esperabas, nuestro equipo de soporte te ayudará a coordinar una revisión adicional sin costo.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.actionsContainer}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            disabled={accepting || isAccepted}
            onPress={handleAccept}
            style={({ pressed }) => [
              styles.primaryButton,
              (accepting || isAccepted) && styles.primaryButtonDisabled,
              pressed && !accepting && !isAccepted ? { opacity: 0.85 } : null,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {isAccepted ? 'Propuesta aceptada' : accepting ? 'Aceptando...' : 'Aceptar propuesta'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.secondaryButton, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.secondaryButtonText}>Seguir comparando</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
