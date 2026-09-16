import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { IconTextInput } from '../src/components/ui/IconTextInput';
import { MapAreaPicker } from '../src/components/ui/MapAreaPicker';
import { AreaRadiusCard } from '../src/features/edit-area/AreaRadiusCard';
import { AreaSuggestions } from '../src/features/edit-area/AreaSuggestions';
import { useEditArea } from '../src/features/edit-area/useEditArea';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
export default function EditAreaScreen() {
  const params = useLocalSearchParams<{ place?: string }>();
  const place = params.place === 'work' ? 'work' : 'home';
  const label = place === 'home' ? 'Nhà' : 'Chỗ làm';
  const color = place === 'home' ? '#FF416C' : '#FF4B2B';
  const state = useEditArea(place);
  const disabled = state.busy || state.locating || !state.initial || state.error;
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader
        title={`Chỉnh sửa vị trí ${label}`}
        subtitle={place === 'home' ? 'Bán kính quét tin quanh nơi ở' : 'Bán kính quét tin quanh nơi làm việc'}
        compact
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Lưu vị trí ${label}`}
            disabled={disabled}
            accessibilityState={{ disabled }}
            onPress={() => void state.save()}
          >
            <LinearGradient
              colors={['#FF416C', '#FF4B2B']}
              style={[styles.save, disabled && styles.disabled]}
            >
              <Text className="font-sans-bold" style={styles.saveText}>
                {state.busy ? '…' : 'Lưu'}
              </Text>
            </LinearGradient>
          </Pressable>
        }
      />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <View>
          <IconTextInput
            icon="search"
            iconNode={<CustomIcon name="editAreaSearch" size={16} />}
            accessibilityLabel={`Tìm địa chỉ ${label}`}
            value={state.query}
            onChangeText={state.setQuery}
            editable={!state.busy}
            returnKeyType="search"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              void state.search();
            }}
            style={styles.search}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Xoá nội dung tìm kiếm"
            hitSlop={8}
            onPress={() => state.setQuery('')}
            style={styles.clear}
          >
            <CustomIcon name="editAreaClear" size={16} />
          </Pressable>
        </View>
        {state.error ? (
          <Button label="Thử tải lại vị trí" variant="outline" onPress={() => void state.retry()} />
        ) : !state.initial ? (
          <ActivityIndicator color={color} />
        ) : (
          <>
            <View style={styles.map} pointerEvents={state.busy ? 'none' : 'auto'}>
              <MapAreaPicker
                key={place}
                place={label}
                variant="settings"
                pinColor={color}
                pinIcon={place === 'home' ? 'editAreaHome' : 'meWork'}
                initialRegion={{ ...state.initial, latitudeDelta: 0.035, longitudeDelta: 0.035 }}
                targetCenter={state.target}
                radiusKm={state.area.radiusKm}
                onCenterChange={state.centerChanged}
                onLocateStart={() => state.setLocating(true)}
                onLocateEnd={() => state.setLocating(false)}
              />
            </View>
            <View pointerEvents={disabled ? 'none' : 'auto'}>
              <AreaRadiusCard radius={state.area.radiusKm} color={color} onChange={state.radiusChanged} />
            </View>
            {state.busy ? <ActivityIndicator color={color} /> : null}
            <AreaSuggestions
              items={state.suggestions}
              selectedAddress={state.area.address}
              color={color}
              disabled={disabled}
              onSelect={(item) => void state.choose(item)}
            />
            <View style={styles.tip}>
              <CustomIcon name="editAreaInfo" size={16} />
              <Text className="font-sans" style={styles.tipText}>
                Thông tin bài viết sẽ ưu tiên phân phối đến cư dân trong phạm vi bán kính bạn đã chọn quanh
                khu vực {label}.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 16, paddingBottom: 40, gap: 16 },
  save: {
    minWidth: 50,
    height: 28,
    borderRadius: 7.778,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  saveText: { fontSize: 12, lineHeight: 16, color: '#FFF' },
  disabled: { opacity: 0.5 },
  search: { height: 42, paddingRight: 40, borderRadius: 11.667, backgroundColor: '#FFFFFF66' },
  clear: { position: 'absolute', right: 12, top: 13 },
  map: {
    height: 192,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 19.556,
    overflow: 'hidden',
    backgroundColor: '#F1F3F54D',
  },
  tip: {
    padding: 14,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 18.333,
    backgroundColor: '#F1F3F566',
  },
  tipText: { flex: 1, fontSize: 11, lineHeight: 17.875, color: '#4A4A4A' },
});
