import {initializeApp} from "firebase/app";
import {
    getAuth,
    GithubAuthProvider,
    onAuthStateChanged,
    signInAnonymously,
    signInWithPopup,
    signOut
} from "firebase/auth";
import {addDoc, collection, getDocs, getFirestore, limit, orderBy, query, onSnapshot} from "firebase/firestore";
import Filter from "bad-words";

import {computed, onUnmounted, ref} from "vue";


const firebase = initializeApp({
    apiKey: "AIzaSyApmNbf6I2JtjvXcgMeOntuwzY1eB2Gp74",
    authDomain: "vuebase-724e6.firebaseapp.com",
    projectId: "vuebase-724e6",
    storageBucket: "vuebase-724e6.appspot.com",
    messagingSenderId: "97512455113",
    appId: "1:97512455113:web:25bac76fc4d404a8650618",
});

const db = getFirestore(firebase);
const auth = getAuth(firebase);

export function useAuth() {
    const user = ref(null);
    const unsubscribe = onAuthStateChanged(auth, (_user) => {
        user.value = _user
    });
    onUnmounted(unsubscribe);

    const isLogin = computed(() => user.value !== null);

    const login = async () => {
        const githubProvider = new GithubAuthProvider();
        await signInWithPopup(auth, githubProvider).then((result) => {
            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            const credential = GithubAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            // The signed-in user info.
            user.value = result.user;
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GithubAuthProvider.credentialFromError(error);
        });
    }

    const loginAnonymously = async () => {
        await signInAnonymously(auth).then(() => {
            // Signed in..
            user.value = auth.currentUser;
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
        });
    }

    const current = getAuth();
    const logOut = async () => {
        await signOut(current).then(() => {
            // Sign-out successful.
            user.value = null;
        }).catch((error) => {
            console.log(error);
        });
    }

    return {user, isLogin, login, logOut, loginAnonymously};
}

const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(100));
const messageCollection = await getDocs(q);

export function useChat() {
    const messages = ref([]);
    const filter = new Filter();
    const {isLogin, user} = useAuth();

    const sendMessage = async (text) => {
        if (!isLogin.value) {
            return;
        }
        const {uid, photoURL, displayName} = user.value;

        await addDoc(collection(db, "messages"), {
            text: filter.clean(text),
            createdAt: new Date(),
            uid,
            photoURL,
            displayName
        });
    };


    messageCollection.forEach((doc) => {
        messages.value.push({...doc.data(), id: doc.id});
    });

    onSnapshot(q, (querySnapshot) => {
        messages.value = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
    });

    return {messages, sendMessage, messageCollection};
}