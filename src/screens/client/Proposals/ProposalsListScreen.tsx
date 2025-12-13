import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { proposalsListStyles as styles } from './ProposalsListScreen.styles';
import { useProposalsList, ProposalListItem } from './useProposalsList';
import { ProposalCardSection } from './sections/ProposalCardSection';
import { EmptyProposalsSection } from './sections/EmptyProposalsSection';
import { RequestSummarySection } from './sections/RequestSummarySection';
import { theme } from '../../../theme';
import { ClientServicesStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<ClientServicesStackParamList, 'ProposalsList'>;

type RouteParams = {
  idSolicitud: number;
};

export default function ProposalsListScreen({ route, navigation }: Props): React.ReactElement {
  const { idSolicitud } = route.params as RouteParams;
  const { proposals, summary, loading, refreshing, error, refresh, hasContent } = useProposalsList(idSolicitud);

  const proposalsSubtitle = useMemo(() => {
    if (proposals.length === 0) {
      return 'Consulta las propuestas de los técnicos para elegir la ideal.';
    }

    const suffix = proposals.length === 1 ? 'propuesta recibida' : 'propuestas recibidas';
    return `${proposals.length} ${suffix}`;
  }, [proposals.length]);

  const handleOpenProposal = (proposal: ProposalListItem) => {
    navigation.navigate('ProposalDetail', {
      idSolicitud,
      proposal,
      summary,
    });
  };

  if (loading && !hasContent) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loaderText}>Cargando propuestas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={proposals}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProposalCardSection proposal={item} onPressDetail={handleOpenProposal} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={theme.colors.primary}
            />
          }
          ListHeaderComponent={() => (
            <>
              <RequestSummarySection
                summary={summary}
                subtitle={proposalsSubtitle}
                onRefresh={refresh}
                isLoading={(loading && hasContent) || refreshing}
              />
              {error && hasContent ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
            </>
          )}
          ListEmptyComponent={() => (
            <EmptyProposalsSection onRetry={refresh} error={error} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}
