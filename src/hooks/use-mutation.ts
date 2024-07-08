import { useState, useEffect } from "react";

type method = "POST" | "PATCH" | "DELETE";

type Params = Partial<{
    method: method;
    body: any;
}>;

export const useMutation = <T>(url: string, params:Params = {}) => {
    const [data, setData] = useState<T|null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const trigger = async () => {
        setLoading(true);
        try {
            const response = await fetch(url, {
                method: params.method,
                body: JSON.stringify(params.body)
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const result = await response.json();
            setData(result);
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        trigger();
    }, [url]);

    return { data, loading, error, trigger};
};


// const users = useFetch("https://jsonplaceholder.typicode.com/users");
