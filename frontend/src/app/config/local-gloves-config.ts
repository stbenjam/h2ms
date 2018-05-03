import {Config} from './config';

/**
 * Configuration for Blue Gloves app.
 */
export const CONFIG: Config = new Config(
    'Blue Gloves 4 All',
    'www.gloveygloversonsgloveemporium.org',
    80,
    '/assets/images/banners/gloves-banner.png',
    '/assets/images/logos/h2ms-logo.png',
    'http://test.h2ms.org',
    81,
    [{id: null, displayName: null}]); // todo: add gloves favicon and logo
