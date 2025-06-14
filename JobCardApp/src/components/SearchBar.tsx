// src/components/SearchBar.tsx
import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Button } from 'react-native';

interface SearchBarProps extends TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
    handleSearch: () => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    placeholder = 'Search...',
    handleSearch,
    ...rest
}) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                returnKeyType="search"
                autoCorrect={false}
                {...rest}
            />
            <Button
                title='Search'
                onPress={handleSearch}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 8,
        marginHorizontal: 16,
        // on iOS you might add shadow, on Android elevation
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    input: {
        height: 40,
        fontSize: 16,
    },
});

export default SearchBar;
