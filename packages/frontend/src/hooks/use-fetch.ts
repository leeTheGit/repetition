import { useState, useEffect } from "react";

type Params = Partial<{
    skip: boolean;
    force: boolean;
}>;


export const useFetch = <T>(url: string, params:Params = {}) => {
    const [data, setData] = useState<T|null>(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    
    const fetchData = async (url: string) => {
        setLoading(true);
        let result = null;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            result = await response.json();
            setData(result);
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
        return result;
    };

    useEffect(() => {
        if (!params.skip) {
            if (!data || params.force) {
                fetchData(url);
            }
        }
    }, [url, params.skip, params.force]);

    return { data, loading, error, fetchData};
};


// const users = useFetch("https://jsonplaceholder.typicode.com/users");
