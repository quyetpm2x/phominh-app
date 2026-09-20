import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { BottomSheet } from '../../../components/ui/BottomSheet';
import { Button } from '../../../components/ui/Button';
import { CustomIcon } from '../../../components/ui/CustomIcon';
import { IconTextInput } from '../../../components/ui/IconTextInput';
import { LegalCard } from '../../legal/LegalCard';

const banks = [
  'Vietcombank (VCB)',
  'Techcombank (TCB)',
  'MB Bank (Quân Đội)',
  'VietinBank (ICB)',
  'BIDV',
  'ACB (Á Châu)',
  'TPBank (Tiên Phong)',
  'VPBank (Việt Nam Thịnh Vượng)',
];

export function BankLinkForm() {
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');
  const [isDefault, setDefault] = useState(true);
  const [picker, setPicker] = useState(false);
  const [error, setError] = useState('');
  const submit = () => {
    if (!bank || !/^\d{6,19}$/.test(account)) {
      setError(!bank ? 'Vui lòng chọn ngân hàng thụ hưởng.' : 'Vui lòng nhập số tài khoản gồm 6–19 chữ số.');
      return;
    }
    setError('');
    Alert.alert(
      'Chưa thể liên kết ngân hàng',
      'Dịch vụ xác minh tài khoản chưa được kết nối. Thông tin chưa được gửi hoặc lưu.',
    );
  };
  return (
    <>
      <LegalCard style={s.form}>
        <View style={s.field}>
          <Text className="font-sans-bold" style={s.label}>
            Ngân hàng thụ hưởng <Text style={s.required}>*</Text>
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={bank || 'Chọn ngân hàng nhận tiền'}
            onPress={() => setPicker(true)}
            style={s.input}
          >
            <CustomIcon name="bankSelect" size={18} />
            <Text numberOfLines={1} className="font-sans" style={s.selected}>
              {bank}
            </Text>
            <CustomIcon name="bankChevron" size={14} />
          </Pressable>
        </View>
        <View style={s.field}>
          <View style={s.row}>
            <Text className="font-sans-bold" style={s.label}>
              Số tài khoản ngân hàng <Text style={s.required}>*</Text>
            </Text>
            <Text className="font-sans" style={s.hint}>
              Chỉ nhận số thẻ / STK
            </Text>
          </View>
          <IconTextInput
            icon="card-outline"
            iconNode={<CustomIcon name="bankNumber" size={16.125} />}
            accessibilityLabel="Số tài khoản ngân hàng"
            placeholder="Nhập số tài khoản"
            placeholderTextColor="#1A1A1A"
            value={account}
            onChangeText={(value) => setAccount(value.replace(/\D/g, ''))}
            keyboardType="number-pad"
            maxLength={19}
            style={s.accountInput}
          />
        </View>
        <View style={s.field}>
          <View style={s.row}>
            <Text className="font-sans-bold" style={s.label}>
              Tên chủ tài khoản
            </Text>
            <View style={s.match}>
              <CustomIcon name="bankMatch" size={10} />
              <Text className="font-sans-bold" style={s.matchText}>
                Khớp hồ sơ
              </Text>
            </View>
          </View>
          <View
            accessibilityLabel="Tên chủ tài khoản sẽ được xác minh khi liên kết"
            style={[s.input, s.locked]}
          >
            <CustomIcon name="bankUser" size={12} />
            <View style={s.spacer} />
            <CustomIcon name="bankLock" size={16} />
          </View>
          <Text className="font-sans-medium" style={s.lookup}>
            Hệ thống tự động tra cứu tên qua cổng Napas khi bấm xác nhận.
          </Text>
        </View>
        <View style={s.defaultRow}>
          <View style={s.defaultLabel}>
            <CustomIcon name="bankStar" size={16} />
            <Text className="font-sans-bold" style={s.label}>
              Đặt làm tài khoản mặc định
            </Text>
          </View>
          <Switch
            value={isDefault}
            onValueChange={setDefault}
            trackColor={{ false: '#F1F3F5', true: '#FF416C' }}
            thumbColor="#FFF"
            ios_backgroundColor="#F1F3F5"
            accessibilityLabel="Đặt làm tài khoản mặc định"
          />
        </View>
        {error ? (
          <Text accessibilityRole="alert" className="font-sans" style={s.error}>
            {error}
          </Text>
        ) : null}
        <Button
          accessibilityRole="button"
          label="Xác nhận liên kết ngân hàng"
          onPress={submit}
          style={s.submit}
          className="flex-row gap-2"
          labelStyle={s.submitText}
          leadingIcon={
            <>
              <LinearGradient pointerEvents="none" colors={['#FF416C', '#FF4B2B']} style={s.submitGradient} />
              <CustomIcon name="bankConfirm" size={13.125} />
            </>
          }
        />
      </LegalCard>
      <BottomSheet visible={picker} onClose={() => setPicker(false)} variant="actions">
        <Text className="font-sans-bold" style={s.pickerTitle}>
          Chọn ngân hàng nhận tiền
        </Text>
        <ScrollView>
          {banks.map((name) => (
            <Pressable
              key={name}
              accessibilityRole="radio"
              accessibilityState={{ checked: bank === name }}
              style={s.option}
              onPress={() => {
                setBank(name);
                setPicker(false);
                setError('');
              }}
            >
              <Text className="font-sans-medium" style={s.label}>
                {name}
              </Text>
              {bank === name ? <CustomIcon name="bankMatch" size={16} /> : null}
            </Pressable>
          ))}
        </ScrollView>
      </BottomSheet>
    </>
  );
}
const s = StyleSheet.create({
  form: { padding: 20, gap: 16, borderRadius: 30.667 },
  field: { gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 },
  label: { fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
  required: { color: '#FF416C' },
  input: {
    height: 46,
    borderRadius: 12.778,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#F1F3F580',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selected: { flex: 1, fontSize: 12, color: '#1A1A1A' },
  hint: { fontSize: 10, lineHeight: 13.333, color: '#4A4A4A' },
  accountInput: {
    height: 46,
    borderRadius: 12.778,
    borderColor: '#E9ECEF',
    backgroundColor: '#F1F3F580',
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 12,
    lineHeight: 16,
  },
  match: { flexDirection: 'row', gap: 2, alignItems: 'center' },
  matchText: { color: '#00D492', fontSize: 10, lineHeight: 15 },
  locked: { backgroundColor: '#F1F3F54D', borderColor: '#E9ECEFCC' },
  spacer: { flex: 1 },
  lookup: { fontSize: 10, lineHeight: 15, color: '#4A4A4A', paddingHorizontal: 3 },
  defaultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderColor: '#E9ECEF99',
  },
  defaultLabel: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  toggle: { width: 44, height: 24, borderRadius: 12 },
  submit: { height: 52, borderRadius: 14.444, paddingHorizontal: 8, overflow: 'hidden' },
  submitGradient: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, borderRadius: 14.444 },
  submitText: { fontFamily: 'BeVietnamPro_900Black', fontSize: 14, lineHeight: 20 },
  error: { fontSize: 11, color: '#E7000B' },
  pickerTitle: { fontSize: 16, color: '#1A1A1A', marginBottom: 12 },
  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#E9ECEF',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
