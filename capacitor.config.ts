import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dexcompany.globalradio',
  appName: '지구라디오',
  webDir: 'dist',
  backgroundColor: '#0D0F14',
  loggingBehavior: 'none',
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: false
  },
  ios: {
    allowsLinkPreview: false,
    webContentsDebuggingEnabled: false
  },
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_radio',
      iconColor: '#3182f6',
      sound: 'default',
      presentationOptions: ['badge', 'sound', 'banner', 'list']
    }
  },
  includePlugins: ['@capacitor/app', '@capacitor/local-notifications']
};

export default config;
