import { useEffect, useState } from 'react';

export default function useDebounce(value, delay) {
    const [debounceValue, setDebounceValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value);
        }, delay);
        return () => {
            clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    return debounceValue;
}
