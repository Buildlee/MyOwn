import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'io.buildlee.myown',
    appName: 'MyOwn',
    webDir: 'out',
    server: {
        androidScheme: 'https'
    }
};

export default config;
