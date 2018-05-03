export interface Link {
    href: string;
}

export interface Links {
    self?: Link;
    location?: Link;
    children?: Link;
    parent?: Link;
}

export function getLinks(swaggerObject): Links {
    if (!swaggerObject || !swaggerObject.hasOwnProperty('_links')) {
        console.log('Cannot get links from object: ');
        console.log(swaggerObject);
        return null;
    }

    return swaggerObject._links;
}

export function getId(swaggerObject): number {
    if (!swaggerObject || !swaggerObject.hasOwnProperty('id')) {
        console.log('Cannot get links from object: ');
        console.log(swaggerObject);
        return null;
    }

    return swaggerObject.id;
}


export function getPayload(ls) {
    return ls._embedded;
}

/**
 * https://stackoverflow.com/a/8175221
 */
export function sortArray(array, key) {
    return array.sort(function (a, b) {
        const x = a[key];
        const y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}