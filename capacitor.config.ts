import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ionic-cheese',
  webDir: 'www',
  plugins: {
    Camera: {
      includeImages: true,
      includeVideos: false,
    },
    Filesystem: {
      accessControl: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    SplashScreen: {
      launchShowDuration: 3000, // temps en ms
      launchAutoHide: true,
      backgroundColor: '#FFFAF1',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#000000',
    },
  },
};
export default config;
