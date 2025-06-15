import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { JobsStackParamList } from '../navigation/JobStackNavigator';
import { useJobFormData } from '../hooks/useJobFormData';
import ActivitySection from '../components/form/ActivitySection';
import DescriptionSection from '../components/form/DescriptionSection';
import PartsSection from '../components/form/PartsSection';


type JobFormRouteProp = RouteProp<JobsStackParamList, 'JobForm'>;

const JobFormScreen = () => {
    const { jobId } = useRoute<JobFormRouteProp>().params;
    const { form, updateField } = useJobFormData(jobId);
    ;

    if (!form) return null; // or a loading state
    return (
        <View style={styles.container}>

            <DescriptionSection
                description={form.description}
                setDescription={(updated) => updateField('description', updated)}
            />

            <ActivitySection
                activity={form.activity ?? []}
                setActivity={(updated) => updateField('activity', updated)}
            />

            <PartsSection
                parts={form.parts ?? []}
                setParts={(updated) => updateField('parts', updated)}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        minHeight: 120,
        textAlignVertical: 'top',
    },
});

export default JobFormScreen;