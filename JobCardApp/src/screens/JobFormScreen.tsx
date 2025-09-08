import { RouteProp, useRoute } from "@react-navigation/native";
import { JobsStackParamList } from "../navigation/JobStackNavigator";
import { useJobFormData } from "../hooks/useJobFormData";
import ActivitySection from "../components/form/ActivitySection";
import DescriptionSection from "../components/form/DescriptionSection";
import PartsSection from "../components/form/PartsSection";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SignSection from "../components/form/SignSection";
import FormTabBar from "../components/FormTabBar";
import { StyleSheet, View, Modal, Text } from "react-native";
import COLORS from "../constants/colors";
import InfoSection from "../components/form/InfoSection";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import SubmitModal from "../components/form/Modals/SubmitModal";
import { useEffect, useState } from "react";
import { useSubmitJobForm } from "../hooks/useSubmitJobForm";
import AppHeader from "../components/AppHeader";
import HeaderButton from "../components/form/Buttons/HeaderButton";

type JobFormRouteProp = RouteProp<JobsStackParamList, "JobForm">;
type JobFormScreenProps = NativeStackScreenProps<JobsStackParamList, "JobForm">;

const JobFormScreen = ({ navigation }: JobFormScreenProps) => {
    const Tab = createMaterialTopTabNavigator();

    const { jobId, job } = useRoute<JobFormRouteProp>().params;

    const { form, updateField } = useJobFormData(jobId);

    const {
        handleSubmit,
        loading,
        showSuccess,
        showError,
        errorMsg,
        closeModal,
    } = useSubmitJobForm(job, jobId, form);

    const [showModal, setShowModal] = useState(false);

    // ✅ Configure header directly
    useEffect(() => {
        navigation.setOptions({
            header: () => (
                <AppHeader
                    title={job.fleet.toUpperCase()}
                    onBack={() => navigation.goBack()}
                    right={
                        <View style={{ flexDirection: "row" }}>
                            <HeaderButton
                                icon="camera"
                                onPress={() => console.log("clicked photos")}
                                disabled={false}
                            />
                            <HeaderButton
                                icon="send"
                                onPress={() => {
                                    setShowModal(true);
                                    handleSubmit();
                                }}
                                disabled={false}
                            />
                        </View>
                    }
                />
            ),
        });
    }, [navigation, job, handleSubmit]);

    return (
        <View style={styles.container}>
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
                    {() =>
                        form ? (
                            <InfoSection data={form} jobId={job.id} job={job} />
                        ) : (
                            <Text style={{ color: "white" }}>Loading form...</Text>
                        )
                    }
                </Tab.Screen>
                <Tab.Screen name="Report">
                    {() =>
                        form ? (
                            <DescriptionSection
                                job={job}
                                description={form.description}
                                setDescription={(updated) => updateField("description", updated)}
                            />
                        ) : (
                            <Text style={{ color: "white" }}>Loading form...</Text>
                        )
                    }
                </Tab.Screen>
                <Tab.Screen name="Activity">
                    {() =>
                        form ? (
                            <ActivitySection
                                activity={form.activity ?? []}
                                setActivity={(updated) => updateField("activity", updated)}
                            />
                        ) : (
                            <Text style={{ color: "white" }}>Loading form...</Text>
                        )
                    }
                </Tab.Screen>
                <Tab.Screen name="Parts">
                    {() =>
                        form ? (
                            <PartsSection
                                parts={form.parts ?? []}
                                setParts={(updated) => updateField("parts", updated)}
                            />
                        ) : (
                            <Text style={{ color: "white" }}>Loading form...</Text>
                        )
                    }
                </Tab.Screen>
                <Tab.Screen name="Sign">
                    {() =>
                        form ? (
                            <SignSection
                                signed={form.signed}
                                setSignatures={(updated) => updateField("signed", updated)}
                            />
                        ) : (
                            <Text style={{ color: "white" }}>Loading form...</Text>
                        )
                    }
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
