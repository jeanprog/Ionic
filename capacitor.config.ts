import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.laserchip.laserprevenda',
  appName: 'Laser Pré-Venda',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 30000,
      launchAutoHide: false,
      showSpinner: true,
    },
  },
  server: {
    cleartext: true,
  },
};

export default config;
