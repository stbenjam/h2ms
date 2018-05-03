import {Config} from './config';

/**
 * Configuration for Blue Gloves app.
 */
export const CONFIG: Config = new Config(
    'Blue Gloves 4 All [LOCAL]',
    'http://localhost',
    4200,
    '/assets/images/banners/gloves-banner.png',
    '/assets/images/logos/h2ms-logo.png',
    'http://localhost',
    8080,
    [{id: 3, displayName: "Gloves removed?"}]); // todo: add gloves favicon and logo
