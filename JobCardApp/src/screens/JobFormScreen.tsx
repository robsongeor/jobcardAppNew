import { RouteProp, useRoute } from '@react-navigation/native';
import { JobsStackParamList } from '../navigation/JobStackNavigator';
import { useJobFormData } from '../hooks/useJobFormData';
import ActivitySection from '../components/form/ActivitySection';
import DescriptionSection from '../components/form/DescriptionSection';
import PartsSection from '../components/form/PartsSection';
import JobInfoBlock from '../components/JobInfoBlock';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SignSection from '../components/form/SignSection';
import SubmitSection from '../components/form/SubmitSection';


type JobFormRouteProp = RouteProp<JobsStackParamList, 'JobForm'>;

const JobFormScreen = () => {
    const Tab = createMaterialTopTabNavigator();

    const { jobId, job } = useRoute<JobFormRouteProp>().params;
    const { form, updateField } = useJobFormData(jobId);


    if (!form) return null; // or a loading state
    return (
        <Tab.Navigator>
            <Tab.Screen name="Info">
                {() => (
                    <>
                        <JobInfoBlock job={job} />
                        <DescriptionSection
                            description={form.description}
                            setDescription={(updated) => updateField('description', updated)}
                        />
                    </>
                )}
            </Tab.Screen>

            <Tab.Screen name="Activity">
                {() => (
                    <ActivitySection
                        activity={form.activity ?? []}
                        setActivity={(updated) => updateField('activity', updated)}
                    />
                )}
            </Tab.Screen>

            <Tab.Screen name="Parts">
                {() => (
                    <PartsSection
                        parts={form.parts ?? []}
                        setParts={(updated) => updateField('parts', updated)}
                    />
                )}
            </Tab.Screen>

            <Tab.Screen name="Sign">
                {() => <SignSection signed={form.signed} setSignatures={(updated) => updateField('signed', updated)} />}
            </Tab.Screen>

            <Tab.Screen name="Submit">
                {() => <SubmitSection data={form} jobId={job.id} job={job} />}
            </Tab.Screen>

        </Tab.Navigator>
    );
};

export default JobFormScreen;