import React from 'react';
import { View, Text } from 'react-native';
import { Banner } from '../../services/home.service';

type Props = {
  banners: Banner[];
};

export default function MockBanner({ banners }: Props): React.ReactElement {
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
