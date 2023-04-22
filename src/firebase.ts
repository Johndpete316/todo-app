// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, query, doc, getDocs, getDoc, collection, where, addDoc, updateDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, verifyBeforeUpdateEmail} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebaseConfig from "../firebase_config";

// import models
import { Todo } from './models/Todos'

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// todo document management
const createTodo = (todo: Todo, UserID: string ) => {
    try {
        addDoc(collection(db, `${UserID}-todos`), todo)
    } catch (error) {
        console.error(error)
    }
    

}

const updateTodo = async (todoid: string, completed: boolean, UserID: string) => {

    console.log(todoid)

    try {
        const q = query(collection(db, `${UserID}-todos`), where('id', '==', todoid))
        const docs = await getDocs(q);
        console.log(docs)

        const todoRef = doc(db, `${UserID}-todos`, docs.docs[0].id)

        await updateDoc(todoRef, {
            completed: completed
        })

    } catch (error) {
        console.error(error)
    }
}



// impliment google authentication

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);

        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: new Date(),
            });
        }
    } catch (error) {
        console.error(error);
    }
}

const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
    }
}

export {
    db,
    auth,
    logout,
    signInWithGoogle,
    createTodo,
    updateTodo
}

