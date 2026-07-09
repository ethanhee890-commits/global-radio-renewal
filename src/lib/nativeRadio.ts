import { Capacitor, registerPlugin, type PluginListenerHandle } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import type { RadioStation, StoredStation } from '../types/station';
import { toStoredStation } from './globalRadioStorage';
import { getSafeNetworkUrl } from './urlSafety';

const ALARM_NOTIFICATION_ID = 7104;

type NativeRadioStatus = {
  status: string;
  title?: string;
};

type NativeAlarmResult = {
  enabled?: boolean;
  scheduled?: boolean;
  exactAllowed?: boolean;
  hour?: number;
  minute?: number;
  title?: string;
};

type NativeRadioPlugin = {
  play(options: { url: string; title: string; subtitle: string }): Promise<NativeRadioStatus>;
  pause(): Promise<NativeRadioStatus>;
  stop(): Promise<NativeRadioStatus>;
  getStatus(): Promise<NativeRadioStatus>;
  scheduleAlarm(options: { hour: number; minute: number; url: string; title: string; subtitle: string }): Promise<NativeAlarmResult>;
  cancelAlarm(): Promise<NativeAlarmResult>;
  getAlarm(): Promise<NativeAlarmResult>;
  openExactAlarmSettings(): Promise<void>;
};

export type RadioAlarmScheduleResult = {
  scheduled: boolean;
  exactAllowed: boolean;
  nativeAutoPlay: boolean;
  platform: string;
};

export const NativeRadio = registerPlugin<NativeRadioPlugin>('NativeRadio');

export function getNativePlatform(): string {
  return Capacitor.getPlatform();
}

export function canUseNativeRadioPlayback(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

export function canUseNativeNotifications(): boolean {
  return Capacitor.isNativePlatform();
}

export async function playNativeRadio(station: RadioStation): Promise<void> {
  const streamUrl = getSafeNetworkUrl(station.url_resolved) || getSafeNetworkUrl(station.url);
  if (!streamUrl) {
    throw new Error('Invalid stream URL');
  }

  await NativeRadio.play({
    url: streamUrl,
    title: station.name,
    subtitle: [station.country, station.language].filter(Boolean).join(' / ') || 'Radio stream'
  });
}

export async function pauseNativeRadio(): Promise<void> {
  if (canUseNativeRadioPlayback()) {
    await NativeRadio.pause();
  }
}

export async function stopNativeRadio(): Promise<void> {
  if (canUseNativeRadioPlayback()) {
    await NativeRadio.stop();
  }
}

export async function getNativeRadioStatus(): Promise<NativeRadioStatus> {
  if (!canUseNativeRadioPlayback()) {
    return { status: 'idle' };
  }

  return NativeRadio.getStatus();
}

export async function ensureNotificationPermission(): Promise<boolean> {
  if (!canUseNativeNotifications()) {
    return false;
  }

  const current = await LocalNotifications.checkPermissions();
  if (current.display === 'granted') {
    return true;
  }

  const requested = await LocalNotifications.requestPermissions();
  return requested.display === 'granted';
}

export async function scheduleRadioAlarm(station: RadioStation, hour: number, minute: number): Promise<RadioAlarmScheduleResult> {
  const streamUrl = getSafeNetworkUrl(station.url_resolved) || getSafeNetworkUrl(station.url);
  if (!streamUrl) {
    throw new Error('Invalid stream URL');
  }

  const platform = getNativePlatform();
  const hasNotificationPermission = await ensureNotificationPermission();
  if (!hasNotificationPermission) {
    return {
      scheduled: false,
      exactAllowed: false,
      nativeAutoPlay: false,
      platform
    };
  }

  await LocalNotifications.cancel({ notifications: [{ id: ALARM_NOTIFICATION_ID }] });
  await LocalNotifications.schedule({
    notifications: [
      {
        id: ALARM_NOTIFICATION_ID,
        title: '지구라디오 알람',
        body: `${station.name} 재생 시간입니다.`,
        schedule: {
          on: { hour, minute, second: 0 },
          every: 'day',
          allowWhileIdle: true
        },
        sound: 'default',
        extra: {
          station: toStoredStation(station)
        }
      }
    ]
  });

  if (canUseNativeRadioPlayback()) {
    const result = await NativeRadio.scheduleAlarm({
      hour,
      minute,
      url: streamUrl,
      title: station.name,
      subtitle: [station.country, station.language].filter(Boolean).join(' / ') || 'Alarm playback'
    });

    return {
      scheduled: Boolean(result.scheduled),
      exactAllowed: Boolean(result.exactAllowed),
      nativeAutoPlay: Boolean(result.scheduled),
      platform
    };
  }

  return {
    scheduled: true,
    exactAllowed: true,
    nativeAutoPlay: false,
    platform
  };
}

export async function cancelRadioAlarm(): Promise<void> {
  if (canUseNativeNotifications()) {
    await LocalNotifications.cancel({ notifications: [{ id: ALARM_NOTIFICATION_ID }] });
  }

  if (canUseNativeRadioPlayback()) {
    await NativeRadio.cancelAlarm();
  }
}

export async function openNativeAlarmSettings(): Promise<void> {
  if (canUseNativeRadioPlayback()) {
    await NativeRadio.openExactAlarmSettings();
  } else if (canUseNativeNotifications() && getNativePlatform() === 'android') {
    await LocalNotifications.changeExactNotificationSetting();
  }
}

export function storedStationFromNotificationExtra(value: unknown): StoredStation | null {
  if (!value || typeof value !== 'object' || !('station' in value)) {
    return null;
  }

  return (value as { station?: StoredStation }).station ?? null;
}

export async function listenForRadioAlarmActions(callback: (station: StoredStation | null) => void): Promise<PluginListenerHandle | null> {
  if (!canUseNativeNotifications()) {
    return null;
  }

  return LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
    callback(storedStationFromNotificationExtra(action.notification.extra));
  });
}
