import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { homeService, Category } from '../../services/home.service';

export default function CategoriesSection(): React.ReactElement {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const cats = await homeService.getCategories();
        if (!mounted) return;
        setCategories(cats);
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
      <Text>Error loading categories</Text>
    </View>
  );

  if (categories.length === 0) return (
    <View>
      <Text>No categories</Text>
    </View>
  );

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Categories</Text>
      {categories.map((c) => (
        <Text key={c.id}>- {c.name}</Text>
      ))}
    </View>
  );
}
