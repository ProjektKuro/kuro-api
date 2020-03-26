export function parseIncludes(includes: string) {
    // Wipe these before we go again
    let requestedIncludes = [];

    if (isString(includes)) {
        requestedIncludes = includes.split(',');
    }

    return requestedIncludes;
}

// Returns if a value is a string
function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

export function parsePagination(query){

}
