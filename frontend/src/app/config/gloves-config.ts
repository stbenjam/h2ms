import {Config} from './config';

/**
 * Configuration for Blue Gloves app.
 */
export const CONFIG: Config = new Config(
    'Blue Gloves 4 All',
    'https://bluegloves.h2ms.org',
    80,
    '/assets/images/banners/gloves-banner.png',
    '/assets/images/logos/h2ms-logo.png',
    'https://bluegloves.h2ms.org',
    443,
    [{id: null, displayName: null}]); // todo: add gloves favicon and logo
