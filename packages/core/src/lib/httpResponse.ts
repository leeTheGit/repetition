import { isError } from "@repetition/core/types";

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



export function Respond(response:unknown, method: string = 'GET') {
    try {
        let statusCode = 200
        if (method === 'POST') {
            statusCode = 201
        }

        // route handler
        let headers = {}
        if (
            response &&
            typeof response === 'object' &&
            'data' in response
        ) {
            if ('headers' in response) {
                headers = response.headers as Record<string, string>
                delete response.headers
            }

            return Response.json(
                {
                    status: 'success',
                    ...response,
                },
                {
                    status: statusCode,
                    ...headers,
                }
            )
        } else {
            if (isError(response)) {
                let code = 500
                if (response.status) {
                    code = response.status
                }

                return new Response(`\"${response.error}\"`, {
                    status: code,
                })
            }

            return Response.json(
                {
                    status: 'success',
                    data: response,
                },
                { status: statusCode }
            )
        }
    } catch (err) {
        console.log(err)
    }
}