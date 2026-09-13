import { StyleSheet, Text } from 'react-native';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import type { HomeFeedController } from './useHomeFeed';
type Props = Pick<HomeFeedController, 'sheet' | 'draft' | 'setDraft' | 'savingDraft' | 'saveDraft'>;
export function AccountSheetContent({ sheet, draft, setDraft, savingDraft, saveDraft }: Props) {
  return (
    <>
      {sheet === 'compose' ? (
        <>
          <TextInput
            accessibilityLabel="Nội dung bài viết"
            placeholder="Khu bạn có gì mới hôm nay?"
            value={draft}
            onChangeText={setDraft}
            multiline
            maxLength={300}
            textAlignVertical="top"
            style={styles.draftInput}
          />
          <Text className="font-sans text-sm text-muted">
            Bạn có thể lưu bản nháp. Tính năng đăng bài sẽ được kết nối sau.
          </Text>
          <Button
            label="Lưu bản nháp"
            disabled={savingDraft || !draft.trim()}
            onPress={() => void saveDraft()}
          />
        </>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  draftInput: { height: 140, paddingTop: 12 },
});
