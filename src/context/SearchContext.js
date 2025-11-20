import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import useDebounce from '~/hooks/useDebounce';
export const SearchContext = React.createContext();

const SearchProvider = ({ children }) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const debounced = useDebounce(searchValue, 500);
    useEffect(() => {
        if (!debounced.trim()) {
            setSearchResult([]);
            return;
        }

        const fetchStories = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/story/stories?search=${debounced}`);
                setSearchResult(response.data.stories);
            } catch (error) {
                console.error('Error fetching stories', error);
            }
        };

        fetchStories();
    }, [debounced]);

    return (
        <SearchContext.Provider
            value={{
                searchValue,
                setSearchValue,
                searchResult,
                setSearchResult,
                showResult,
                setShowResult,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
export default SearchProvider;
