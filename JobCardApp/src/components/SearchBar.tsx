// src/components/SearchBar.tsx
import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Button, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';



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
            <View style={styles.searchIcon}>
                <Icon name="search" size={20} color="#444" />
            </View>

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
                <Text style={styles.searchText}>Search</Text>

            </TouchableOpacity>}



        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 48,
        backgroundColor: '#fff',

        flexDirection: "row",
        alignItems: "center",

    },
    input: {
        height: "100%",
        fontSize: 16,
        flex: 9,

    },
    searchIcon: {
        width: 40,
        height: "100%",


        alignItems: "center",
        justifyContent: "center",

    },
    searchButton: {
        height: "100%",

        backgroundColor: "#007AFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 2, // For Android shadow
        flex: 1.4,

    },
    searchText: {

        color: "#fff"
    }
});

export default SearchBar;
