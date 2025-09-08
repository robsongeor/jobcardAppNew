import { RouteProp, useRoute } from "@react-navigation/native";
import { JobsStackParamList } from "../navigation/JobStackNavigator";
import { useJobFormData } from "../hooks/useJobFormData";
import ActivitySection from "../components/form/ActivitySection";
import DescriptionSection from "../components/form/DescriptionSection";
import PartsSection from "../components/form/PartsSection";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SignSection from "../components/form/SignSection";
import FormTabBar from "../components/FormTabBar";
import { StyleSheet, View, Modal } from "react-native";
import COLORS from "../constants/colors";
import InfoSection from "../components/form/InfoSection";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import SubmitModal from "../components/form/Modals/SubmitModal"; // ⬅️ import modal
import { useEffect, useState } from "react";
import { useSubmitJobForm } from "../hooks/useSubmitJobForm";


type JobFormRouteProp = RouteProp<JobsStackParamList, "JobForm">;
type JobFormScreenProps = NativeStackScreenProps<JobsStackParamList, "JobForm">;

const JobFormScreen = ({ navigation }: JobFormScreenProps) => {
    const Tab = createMaterialTopTabNavigator();

    const { jobId, job } = useRoute<JobFormRouteProp>().params;
    const { form, updateField } = useJobFormData(jobId);

    if (!form) return null; // early return until form is loaded

    // 🔥 use the new submit hook
    const { handleSubmit, loading, showSuccess, showError, errorMsg, closeModal } =
        useSubmitJobForm(job, jobId, form);

    // 🔥 local state to toggle modal
    const [showModal, setShowModal] = useState(false);

    // connect header button to our handleSubmit
    useEffect(() => {
        navigation.setParams({
            handleSubmitFromHeader: () => {
                setShowModal(true);
                handleSubmit();
            },
        });
    }, [form]);

    if (!form) return null; // or a loading state

    return (
        <View style={styles.container}>
            {/* 🔥 modal now lives at screen level, not inside InfoSection */}
            <Modal visible={showModal} transparent animationType="fade">
                <SubmitModal
                    showSuccess={showSuccess}
                    showError={showError}
                    loading={loading}
                    closeModal={() => {
                        setShowModal(false);
                        closeModal();
                    }}
                    errorMsg={errorMsg}
                />
            </Modal>

            <Tab.Navigator tabBar={(props) => <FormTabBar {...props} />}>
                <Tab.Screen name="Info">
                    {() => (
                        <InfoSection
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
                            setDescription={(updated) => updateField("description", updated)}
                        />
                    )}
                </Tab.Screen>

                <Tab.Screen name="Activity">
                    {() => (
                        <ActivitySection
                            activity={form.activity ?? []}
                            setActivity={(updated) => updateField("activity", updated)}
                        />
                    )}
                </Tab.Screen>

                <Tab.Screen name="Parts">
                    {() => (
                        <PartsSection
                            parts={form.parts ?? []}
                            setParts={(updated) => updateField("parts", updated)}
                        />
                    )}
                </Tab.Screen>

                <Tab.Screen name="Sign">
                    {() => (
                        <SignSection
                            signed={form.signed}
                            setSignatures={(updated) => updateField("signed", updated)}
                        />
                    )}
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
    },
});
