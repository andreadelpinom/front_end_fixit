import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { homeService, Banner } from '../../services/home.service';

export default function MockBanner(): React.ReactElement {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await homeService.getHomeBanners();
        if (!mounted) return;
        setBanners(data ?? []);
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

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error loading banners</Text>
      </View>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <View>
        <Text>No banners</Text>
      </View>
    );
  }

  return (
    <View>
      {banners.map((b) => (
        <View key={b.id}>
          <Text>{b.title}</Text>
          {!!b.subtitle && <Text>{b.subtitle}</Text>}
        </View>
      ))}
    </View>
  );
}
