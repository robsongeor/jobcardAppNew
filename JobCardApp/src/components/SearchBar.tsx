// src/components/SearchBar.tsx
import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Button, TouchableOpacity, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';


interface SearchBarProps extends TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
    handleSearch: () => void;
    placeholder?: string;
    autoSearch?: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    placeholder = 'Search...',
    handleSearch,
    autoSearch = false,
    ...rest
}) => {

    const handleTextChange = (text: string) => {
        onChangeText(text);
        if (autoSearch) {
            handleSearch();
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={handleTextChange}
                placeholder={placeholder}
                returnKeyType="search"
                autoCorrect={false}
                {...rest}
            />
            {!autoSearch && <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.8}>
                <Feather name="search" size={20} color="#fff" />
            </TouchableOpacity>}



        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        flexDirection: "row"

    },
    input: {
        height: 40,
        fontSize: 16,
        flex: 9,
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#007AFF",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 2, // For Android shadow
    },
});

export default SearchBar;
