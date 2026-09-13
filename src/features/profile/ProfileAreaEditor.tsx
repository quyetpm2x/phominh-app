import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { MapAreaPicker } from '../../components/ui/MapAreaPicker';
import { RadiusSlider } from '../../components/ui/RadiusSlider';
import type { HomeArea } from '../../lib/homeArea';

export function ProfileAreaEditor({
  area,
  place,
  onApply,
  onClose,
}: {
  area: HomeArea;
  place: string;
  onApply: (area: HomeArea) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(area);
  return (
    <BottomSheet visible onClose={onClose} variant="actions">
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text className="font-sans-bold text-lg text-ink">Khu vực {place}</Text>
        <View className="h-[280px] overflow-hidden rounded-2xl">
          <MapAreaPicker
            place={place}
            initialRegion={{ ...area, latitudeDelta: 0.04, longitudeDelta: 0.04 }}
            radiusKm={draft.radiusKm}
            onCenterChange={(latitude, longitude) =>
              setDraft((current) => ({ ...current, latitude, longitude }))
            }
          />
        </View>
        <RadiusSlider
          valueKm={draft.radiusKm}
          minKm={0.5}
          maxKm={5}
          stepKm={0.1}
          onChange={(radiusKm) => setDraft({ ...draft, radiusKm })}
        />
        <Button
          label="Áp dụng"
          onPress={() => {
            onApply(draft);
            onClose();
          }}
        />
        <Button label="Huỷ" variant="outline" onPress={onClose} />
      </ScrollView>
    </BottomSheet>
  );
}
const styles = StyleSheet.create({ content: { gap: 16, paddingTop: 16 } });
