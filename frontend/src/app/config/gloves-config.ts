import {Config} from './config';

/**
 * Configuration for Blue Gloves app.
 */
export const CONFIG: Config = new Config(
    'Blue Gloves 4 All',
    'https://bluegloves.h2ms.org',
    443,
    '/assets/images/banners/gloves-banner.png',
    '/assets/images/logos/h2ms-logo.png',
    'https://bluegloves.h2ms.org',
    443,
    [{id: '20', displayName: 'Gloves removed?'}]); // todo: add gloves favicon and logo
