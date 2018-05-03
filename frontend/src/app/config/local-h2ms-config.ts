import {Config} from './config';

/**
 * Configuration for Hand Hygiene app.
 */
export const CONFIG: Config = new Config(
    'H2MS [Local]',
    'http://localhost',
    4200,
    '/assets/images/banners/h2ms-banner.png',
    '/assets/images/logos/h2ms-logo.png',
    'http://localhost',
    8080,
    [{id: '3', displayName: 'Washed?'}]);
