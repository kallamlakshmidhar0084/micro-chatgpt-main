import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// const firebaseConfig = {
// 	apiKey: "AIzaSyD5eoBDd-bvNxwNmPnJ3RdRED5tDEJ368k",
// 	authDomain: "gd-gcp-internship-ind.firebaseapp.com",
// 	projectId: "gd-gcp-internship-ind",
// 	storageBucket: "gd-gcp-internship-ind.appspot.com",
// 	messagingSenderId: "889808122203",
// 	appId: "1:889808122203:web:3ac1ca4f183a47479baa7e",
// };

const firebaseConfig = {
	apiKey: "AIzaSyBV_LtPlQOKP0C5JYnGQW3VYKOVCeEvuvc",
	authDomain: "leo-project-main.firebaseapp.com",
	projectId: "leo-project-main",
	storageBucket: "leo-project-main.appspot.com",
	messagingSenderId: "1016301702143",
	appId: "1:1016301702143:web:e39034fdfb21b88401b5ca",
	measurementId: "G-GBKM976D1D"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

//detect auth state
export const fb = getAuth(firebaseApp);
