
export class ConfigQuestion {
    id: string;
    displayName: string;
}

/**
 * Config file to switch between different types of applications. Ex. Hand Hygiene, Blue Gloves, or Blue Masks.
 */
export class Config {
    servicesReturnFakeData = false;

    appName: string;
    frontendHostname: string;
    frontendPort: number;
    bannerUrl: string;
    logoUrl: string;
    backendHostname: string;
    backendPort: number;
    configQuestion: ConfigQuestion;

    constructor(appName: string,
                frontendHostname: string,
                frontendPort: number,
                bannerUrl: string,
                logoUrl: string,
                backendHostname: string,
                backendPort: number,
                configQuestion: ConfigQuestion) {
        this.appName = appName;
        this.frontendHostname = frontendHostname;
        this.frontendPort = frontendPort;
        this.bannerUrl = bannerUrl;
        this.logoUrl = logoUrl;
        this.backendHostname = backendHostname;
        this.backendPort = backendPort;
        this.configQuestion = configQuestion;
    }

    public setConfig(config: Config) {
        this.appName = config.appName;
        this.frontendHostname = config.frontendHostname;
        this.frontendPort = config.frontendPort;
        this.bannerUrl = config.bannerUrl;
        this.logoUrl = config.logoUrl;
        this.backendHostname = config.backendHostname;
        this.backendPort = config.backendPort;
        this.configQuestion = config.configQuestion;
    }

    public getFrontendUrl() {
        return this.frontendHostname + ':' + this.frontendPort;
    }

    public getBackendUrl() {
        return this.backendHostname + ':' + this.backendPort + '/api';
    }
}
