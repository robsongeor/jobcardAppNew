import { collection, getDocs, getFirestore } from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
} from "react-native";


export default function SettingsScreen() {

    // useEffect(() => {
    //     const runCheck = async () => {
    //         const db = getFirestore();
    //         const snapshot = await getDocs(collection(db, "customers"));

    //         snapshot.docs.forEach((doc) => {
    //             if (Object.keys(doc.data()).length === 0) {
    //                 console.log("🛑 Empty doc found:", doc.id);
    //             }
    //         });
    //     };

    //     runCheck();
    // }, []);

    return (
        <View >

        </View>
    );
}

