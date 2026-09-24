import { CameraView } from 'expo-camera';
import { checkCameraAvailability } from './cameraAvailability';

jest.mock('expo-camera', () => ({ CameraView: { isAvailableAsync: jest.fn() } }));
const probe = CameraView.isAvailableAsync as jest.Mock;
beforeEach(() => probe.mockReset());

test.each(['ios', 'android'] as const)(
  'does not invoke the unsupported availability API on %s',
  async (platform) => {
    probe.mockImplementation(() => {
      throw new Error('isAvailableAsync is unavailable');
    });
    await expect(checkCameraAvailability(platform)).resolves.toBe(true);
    expect(probe).not.toHaveBeenCalled();
  },
);
test.each([true, false])('uses the actual browser camera availability: %s', async (available) => {
  probe.mockResolvedValue(available);
  await expect(checkCameraAvailability('web')).resolves.toBe(available);
  expect(probe).toHaveBeenCalledTimes(1);
});
test('preserves web initialization errors for the caller to handle', async () => {
  probe.mockRejectedValue(new Error('Cannot enumerate devices'));
  await expect(checkCameraAvailability('web')).rejects.toThrow('Cannot enumerate devices');
});
