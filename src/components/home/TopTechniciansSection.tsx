import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { homeService, TechPreview } from '../../services/home.service';

export default function TopTechniciansSection(): React.ReactElement {
  const [loading, setLoading] = useState(true);
  const [techs, setTechs] = useState<TechPreview[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const t = await homeService.getTopRatedTechs(10);
        if (!mounted) return;
        setTechs(t);
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
      <Text>Error loading top technicians</Text>
    </View>
  );

  if (techs.length === 0) return (
    <View>
      <Text>No top technicians</Text>
    </View>
  );

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Top Rated Technicians</Text>
      {techs.map((t) => (
        <Text key={t.idTecnico}>- {t.nombres} {t.apellidos ?? ''} ({t.rating ?? '-'})</Text>
      ))}
    </View>
  );
}
