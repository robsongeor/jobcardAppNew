import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface SearchBarProps extends TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
    handleSearch: () => void;
    placeholder?: string;
    autoSearch?: boolean;
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
            <View style={styles.icon}>
                <Icon name="search" size={20} color="#444" />
            </View>

            <TextInput
                style={styles.input}
                value={value}
                onChangeText={handleTextChange}
                placeholder={placeholder}
                returnKeyType="search"
                autoCorrect={false}
                onSubmitEditing={handleSearch}
                {...rest}
            />

            {value.length > 0 && (
                <TouchableOpacity style={styles.icon} onPress={() => onChangeText("")}>
                    <Icon name="x" size={20} color="#444" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 48,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        height: '100%',
        fontSize: 16,
        flex: 1,
        backgroundColor: 'transparent', // or remove if not needed
        paddingHorizontal: 8, // for better spacing
    },
    icon: {
        width: 40,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SearchBar;
