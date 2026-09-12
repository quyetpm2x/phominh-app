import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActionSheetMenu } from '../../components/ui/ActionSheetMenu';
import { GradientSubmitButton } from '../../components/ui/GradientSubmitButton';
import { TextInput } from '../../components/ui/TextInput';
import { colors } from '../../constants/design-tokens';
import { ShopPhotoPicker } from './ShopPhotoPicker';
import { ShopRegistrationBenefits, ShopRegistrationIntro } from './ShopRegistrationBenefits';
import { useShopRegistration } from './useShopRegistration';

const categories = ['Ăn uống', 'Cà phê / Đồ uống', 'Tạp hoá', 'Làm đẹp', 'Dịch vụ', 'Khác'];
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="flex-1 gap-1.5">
      <Text className="font-sans-bold text-xs text-ink">
        {label} <Text className="text-danger">*</Text>
      </Text>
      {children}
    </View>
  );
}

export function ShopRegistrationForm() {
  const form = useShopRegistration();
  const [selecting, setSelecting] = useState(false);
  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View className="flex-row items-center gap-2 border-b border-[#E9ECEF] px-4 py-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
          className="h-9 w-9 items-center justify-center rounded-full border border-[#E9ECEF] bg-white"
        >
          <Ionicons name="arrow-back" size={22} color={colors.ink.DEFAULT} />
        </Pressable>
        <View className="flex-1 gap-1">
          <Text accessibilityRole="header" className="font-sans-black text-base text-ink">
            Đăng ký Chủ quán
          </Text>
          <Text className="font-sans text-[10px] text-muted">Tiếp cận 5,000+ cư dân trong bán kính 2km</Text>
        </View>
        <Text className="rounded-full border border-primary/15 bg-primary/10 px-2 py-1.5 font-sans-black text-[11px] text-primary">
          Bước 1/2
        </Text>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <ShopRegistrationIntro />
        <Text className="font-sans-black text-sm text-ink">
          <Ionicons name="information-circle-outline" size={15} color={colors.primary.DEFAULT} /> THÔNG TIN CƠ
          SỞ KINH DOANH
        </Text>
        <Field label="Tên quán / Cửa hàng">
          <TextInput
            accessibilityLabel="Tên quán / Cửa hàng"
            value={form.name}
            onChangeText={form.setName}
            maxLength={120}
            placeholder="VD: Tiệm Cà Phê Góc Phố, Bún Bò Huế Cô Tư..."
            className="h-11 border-[#E9ECEF] font-sans text-[13px]"
          />
        </Field>
        <View className="flex-row gap-3">
          <Field label="Ngành hàng">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Chọn ngành hàng"
              accessibilityState={{ expanded: selecting }}
              onPress={() => setSelecting(true)}
              className="h-11 flex-row items-center justify-between rounded-xl border border-[#E9ECEF] bg-white px-3"
            >
              <Text className="flex-1 font-sans text-xs text-ink">{form.category}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.muted.DEFAULT} />
            </Pressable>
          </Field>
          <Field label="Số điện thoại hotline">
            <TextInput
              accessibilityLabel="Số điện thoại hotline"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={form.setPhone}
              maxLength={20}
              className="h-11 border-[#E9ECEF] font-sans text-[13px]"
            />
          </Field>
        </View>
        <View className="gap-2">
          <Field label="Địa chỉ chi tiết">
            <View className="relative justify-center">
              <TextInput
                accessibilityLabel="Địa chỉ chi tiết"
                value={form.address}
                onChangeText={form.setAddress}
                maxLength={300}
                className="h-11 border-[#E9ECEF] pr-24 font-sans text-[13px]"
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Định vị địa chỉ quán"
                disabled={form.locating}
                onPress={() => void form.locate()}
                className="absolute right-2 rounded-lg bg-primary/10 px-2 py-1.5"
              >
                <Text className="font-sans-bold text-[11px] text-primary">
                  {form.locating ? 'Đang tìm...' : '◎ Định vị'}
                </Text>
              </Pressable>
            </View>
          </Field>
          <Text className="font-sans text-[11px] leading-4 text-muted">
            Địa chỉ này dùng để định vị hiển thị tin quán tới cư dân quanh.
          </Text>
        </View>
        <ShopPhotoPicker
          photos={form.photos}
          busy={form.picking}
          onAdd={() => void form.pickPhotos()}
          onRemove={(index) => form.setPhotos((photos) => photos.filter((_, i) => i !== index))}
        />
        <ShopRegistrationBenefits />
        <Text className="px-3 text-center font-sans text-[11px] leading-[18px] text-muted">
          Bằng cách đăng ký, bạn đồng ý với{' '}
          <Text className="font-sans-bold text-primary" onPress={() => router.push('/(auth)/terms-of-use')}>
            Điều khoản Chủ quán & Tiêu chuẩn cộng đồng
          </Text>
          .
        </Text>
        {form.error ? (
          <Text accessibilityRole="alert" className="font-sans text-xs text-danger">
            {form.error}
          </Text>
        ) : null}
        <GradientSubmitButton
          label="Gửi đăng ký & Kích hoạt quán"
          disabled={form.locating || form.picking}
          loading={false}
          vertical
          onPress={form.submit}
        />
      </ScrollView>
      <ActionSheetMenu
        title="Chọn ngành hàng"
        visible={selecting}
        onClose={() => setSelecting(false)}
        items={categories.map((label) => ({ label, onPress: () => form.setCategory(label) }))}
      />
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({ content: { padding: 16, gap: 22, paddingBottom: 36 } });
