import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase'
export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {

    // const [idToken , setIdToken] = useState('');
    // const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [email, setEmail] = useState('');
    const [uid, setUid] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const value = {
        user,
        photoURL,
        email,
        uid,
        auth,
        accessToken
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setEmail(user.email);
                setPhotoURL(user.photoURL);
                setUid(user.uid);
                // setIsLoading(false);
                setAccessToken(user.accessToken);
            }
        })
        
        unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    )
}

