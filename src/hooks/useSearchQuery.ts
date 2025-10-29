import { useState, useEffect } from "react";
import { getData, saveData, StorageKeys } from "../shared/storage";

export const useSearchQuery = () => {
    const [query, setQuery] = useState("");
    useEffect(() => {
        (async () => {
            const saved = await getData<string>(StorageKeys.Client.SearchQuery);
            if (saved) setQuery(saved);
        })();
    }, []);

    const updateQuery = (value: string) => {
        setQuery(value);
        saveData(StorageKeys.Client.SearchQuery, value);
    };

    return [query, updateQuery] as const;
};
