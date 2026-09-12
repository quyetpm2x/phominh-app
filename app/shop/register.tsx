import { SafeAreaView } from 'react-native-safe-area-context';
import { ShopRegistrationForm } from '../../src/features/shop-registration/ShopRegistrationForm';

export default function ShopRegistrationScreen() {
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-[#F8F9FA]">
      <ShopRegistrationForm />
    </SafeAreaView>
  );
}
