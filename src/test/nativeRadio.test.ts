import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RadioStation } from '../types/station';

const nativeMocks = vi.hoisted(() => ({
  platform: 'android',
  isNativePlatform: true,
  nativeRadio: {
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    getStatus: vi.fn(),
    scheduleAlarm: vi.fn(),
    cancelAlarm: vi.fn(),
    getAlarm: vi.fn(),
    openExactAlarmSettings: vi.fn()
  },
  localNotifications: {
    checkPermissions: vi.fn(),
    requestPermissions: vi.fn(),
    cancel: vi.fn(),
    schedule: vi.fn(),
    changeExactNotificationSetting: vi.fn(),
    addListener: vi.fn()
  }
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    getPlatform: vi.fn(() => nativeMocks.platform),
    isNativePlatform: vi.fn(() => nativeMocks.isNativePlatform)
  },
  registerPlugin: vi.fn(() => nativeMocks.nativeRadio)
}));

vi.mock('@capacitor/local-notifications', () => ({
  LocalNotifications: nativeMocks.localNotifications
}));

const station: RadioStation = {
  stationuuid: 'station-a',
  name: 'Alarm Test Radio',
  url: 'https://example.com/live.mp3',
  url_resolved: 'https://example.com/live.mp3',
  country: 'Japan',
  language: 'japanese',
  codec: 'MP3',
  bitrate: 128,
  hls: 0,
  lastcheckok: 1,
  ssl_error: 0
};

describe('native radio alarm scheduling', () => {
  beforeEach(() => {
    nativeMocks.platform = 'android';
    nativeMocks.isNativePlatform = true;
    Object.values(nativeMocks.nativeRadio).forEach((mock) => mock.mockReset());
    Object.values(nativeMocks.localNotifications).forEach((mock) => mock.mockReset());
    nativeMocks.localNotifications.checkPermissions.mockResolvedValue({ display: 'granted' });
    nativeMocks.localNotifications.cancel.mockResolvedValue(undefined);
    nativeMocks.localNotifications.schedule.mockResolvedValue(undefined);
    nativeMocks.nativeRadio.scheduleAlarm.mockResolvedValue({ scheduled: true, exactAllowed: true });
  });

  it('does not leave a local notification scheduled when Android exact alarm scheduling fails', async () => {
    const { scheduleRadioAlarm } = await import('../lib/nativeRadio');
    nativeMocks.nativeRadio.scheduleAlarm.mockResolvedValue({ scheduled: false, exactAllowed: false });

    const result = await scheduleRadioAlarm(station, 7, 30);

    expect(result).toEqual({
      scheduled: false,
      exactAllowed: false,
      nativeAutoPlay: false,
      platform: 'android'
    });
    expect(nativeMocks.localNotifications.cancel).toHaveBeenCalledTimes(1);
    expect(nativeMocks.nativeRadio.scheduleAlarm).toHaveBeenCalledTimes(1);
    expect(nativeMocks.localNotifications.schedule).not.toHaveBeenCalled();
  });

  it('schedules the companion notification only after Android native autoplay alarm succeeds', async () => {
    const { scheduleRadioAlarm } = await import('../lib/nativeRadio');

    const result = await scheduleRadioAlarm(station, 8, 15);

    expect(result.scheduled).toBe(true);
    expect(result.nativeAutoPlay).toBe(true);
    expect(nativeMocks.nativeRadio.scheduleAlarm).toHaveBeenCalledTimes(1);
    expect(nativeMocks.localNotifications.schedule).toHaveBeenCalledTimes(1);
  });

  it('keeps iOS on notification-only alarm scheduling', async () => {
    const { scheduleRadioAlarm } = await import('../lib/nativeRadio');
    nativeMocks.platform = 'ios';

    const result = await scheduleRadioAlarm(station, 9, 45);

    expect(result).toEqual({
      scheduled: true,
      exactAllowed: true,
      nativeAutoPlay: false,
      platform: 'ios'
    });
    expect(nativeMocks.nativeRadio.scheduleAlarm).not.toHaveBeenCalled();
    expect(nativeMocks.localNotifications.schedule).toHaveBeenCalledTimes(1);
  });
});
