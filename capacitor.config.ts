import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ionic-cheese',
  webDir: 'www',
  plugins: {
    Camera: {
      includeImages: true,
      includeVideos: false
    },
    Geolocation: {
      requirePermissions: true
    },
    Filesystem: {
      accessControl: true
    },     
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
