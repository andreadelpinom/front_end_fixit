import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { homeService, RequestPreview } from '../../services/home.service';

export default function RecentRequestsSection(): React.ReactElement {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<RequestPreview[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const r = await homeService.getRecentRequests();
        if (!mounted) return;
        setRequests(r);
      } catch (e: any) {
        if (!mounted) return;
        setError(String(e?.message ?? e));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return (
    <View>
      <ActivityIndicator />
    </View>
  );

  if (error) return (
    <View>
      <Text>Error loading recent requests</Text>
    </View>
  );

  if (requests.length === 0) return (
    <View>
      <Text>No recent requests</Text>
    </View>
  );

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Recent Requests</Text>
      {requests.map((r) => (
        <Text key={r.idSolicitud}>- {r.titulo ?? `Solicitud ${r.idSolicitud}`}</Text>
      ))}
    </View>
  );
}
