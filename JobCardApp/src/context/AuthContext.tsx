// src/context/AuthContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { storage } from '../storage/storage';
import { getUserData } from '../firebase';
import { EventBus } from '../utils/EventBus';

type User = FirebaseAuthTypes.User | null;

interface AuthContextProps {
    user: User;
    initializing: boolean;
    signUp: (email: string, password: string) => Promise<FirebaseAuthTypes.UserCredential>;
    signIn: (email: string, password: string) => Promise<FirebaseAuthTypes.UserCredential>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const [initializing, setInitializing] = useState(true);

    // Wrap Firebase methods in your context
    const signUp = (email: string, password: string) =>
        auth().createUserWithEmailAndPassword(email, password);

    const signIn = (email: string, password: string) =>
        auth().signInWithEmailAndPassword(email, password);

    const signOut = () => auth().signOut();

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async u => {
            setUser(u);

            if (u) {
                //User collection retrieval
                const firestoreUser = await getUserData(u.uid);

                const mergedUser = {
                    ...u.toJSON(),          // includes uid, email, etc.
                    ...firestoreUser,       // includes name, role, etc.
                };
                storage.set('user', JSON.stringify(mergedUser));
                EventBus.emit("userStored");

            } else {
                storage.delete('user');
            }

            if (initializing) {
                setInitializing(false);
            }
        });
        return () => unsubscribe();
    }, [initializing]);

    // *** Make sure to return the provider! ***
    return (
        <AuthContext.Provider
            value={{ user, initializing, signUp, signIn, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for consuming the context
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
};
