import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { JobsStackParamList } from '../navigation/JobStackNavigator';
import { useJobFormData } from '../hooks/useJobFormData';
import ActivitySection from '../components/form/ActivitySection';
import DescriptionSection from '../components/form/DescriptionSection';
import PartsSection from '../components/form/PartsSection';
import JobInfoBlock from '../components/JobInfoBlock';


type JobFormRouteProp = RouteProp<JobsStackParamList, 'JobForm'>;

const JobFormScreen = () => {
    const { jobId, job } = useRoute<JobFormRouteProp>().params;
    const { form, updateField } = useJobFormData(jobId);
    ;

    if (!form) return null; // or a loading state
    return (
        <ScrollView>
            <JobInfoBlock
                job={job}
            />

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

        </ScrollView>
    );
};

const styles = StyleSheet.create({

});

export default JobFormScreen;