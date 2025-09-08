import { RouteProp, useRoute } from '@react-navigation/native';
import { JobsStackParamList } from '../navigation/JobStackNavigator';
import { useJobFormData } from '../hooks/useJobFormData';
import ActivitySection from '../components/form/ActivitySection';
import DescriptionSection from '../components/form/DescriptionSection';
import PartsSection from '../components/form/PartsSection';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SignSection from '../components/form/SignSection';
import FormTabBar from '../components/FormTabBar';
import { StyleSheet, View } from 'react-native';
import COLORS from '../constants/colors';
import InfoSection from '../components/form/InfoSection';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


type JobFormRouteProp = RouteProp<JobsStackParamList, 'JobForm'>;

type JobFormScreenProps = NativeStackScreenProps<JobsStackParamList, 'JobForm'>;

const JobFormScreen = ({ navigation }: JobFormScreenProps) => {
    const Tab = createMaterialTopTabNavigator();

    const { jobId, job } = useRoute<JobFormRouteProp>().params;
    const { form, updateField } = useJobFormData(jobId);

    if (!form) return null; // or a loading state
    return (
        <View style={styles.container}>
            <Tab.Navigator tabBar={props => <FormTabBar {...props} />}>
                <Tab.Screen name="Info">
                    {() => (
                        <InfoSection
                            setHandleSubmitForHeader={(fn) => {
                                navigation.setParams({ handleSubmitFromHeader: fn })
                            }}
                            data={form}
                            jobId={job.id}
                            job={job}
                        />

                    )}
                </Tab.Screen>

                <Tab.Screen name="Report">
                    {() => (
                        <DescriptionSection
                            job={job}
                            description={form.description}
                            setDescription={(updated) => updateField('description', updated)}
                        />

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

            </Tab.Navigator>
        </View>
    );
};

export default JobFormScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        flex: 1,
    }
})