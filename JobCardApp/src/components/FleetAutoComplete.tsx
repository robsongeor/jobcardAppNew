import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Machine } from '../types/types';
import SmallTextInput from './form/FormInputs/SmallTextInput';

type FleetAutoCompleteProps = {
    fleetList: Machine[],
    onSelect: (value: Machine) => void;
};

export default function FleetAutoComplete({ fleetList, onSelect }: FleetAutoCompleteProps) {
    const [query, setQuery] = useState<string>('');
    const [filtered, setFiltered] = useState<Machine[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const handleChange = (text: string) => {
        setQuery(text);
        if (text.length > 1) {
            const matches = fleetList.filter(item =>
                item.fleet.toLowerCase().includes(text.toLowerCase())
            );
            setFiltered(matches);
            setShowDropdown(matches.length > 0);
        } else {
            setFiltered([]);
            setShowDropdown(false);
        }
    };

    const handleSelect = (item: Machine) => {
        setQuery(item.fleet);
        setShowDropdown(false);
        onSelect(item);
    };

    return (
        <View style={styles.container}>
            <SmallTextInput
                label='Fleet Number'
                value={query}
                onChangeText={handleChange}
                placeholder="e.g FN2503"
                style={{ marginBottom: 0 }}
            />

            {showDropdown && (
                <FlatList
                    style={styles.dropdown}
                    keyboardShouldPersistTaps="handled"
                    data={filtered}
                    keyExtractor={(item) => item.fleet}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSelect(item)} style={styles.dropdownItem}>
                            <Text>{item.fleet} – {item.make} {item.model}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 1,
    },
    input: {

    },
    dropdown: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#eee',
        borderTopWidth: 0,

        maxHeight: 260,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        zIndex: 2,
    },
    dropdownItem: {
        padding: 12,
    },
});
