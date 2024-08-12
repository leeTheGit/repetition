export function HttpResponse<T>(data: T | T[], mapper: (res: T) => any) {

    if ( Array.isArray(data)) {
        const results = [];
        for (let res of data) {
            results.push(mapper(res));
        }
        return results;
    }

    return mapper(data);
}

export const JSONResponse = HttpResponse
