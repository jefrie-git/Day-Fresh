import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBD417f9drg_U_BCCJpS6aZIaN7S9o_LJw",
    authDomain: "pruevas-53538.firebaseapp.com",
    projectId: "pruevas-53538",
    storageBucket: "pruevas-53538.appspot.com",
    messagingSenderId: "973518171189",
    appId: "1:973518171189:web:8e053f49f71824b6cd557c",
    measurementId: "G-TJDCSNRNPD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

document.getElementById("Ingresar").addEventListener("click", async () => {
    var email = document.getElementById("gmail").value;
    var password = document.getElementById("password").value;

    if (email === '' || password === '') {
        alert("Todos los campos son obligatorios");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        alert("Inicio de sesión exitoso");

        // LÍNEA PARA MODIFICAR: Redirigir a la página deseada
        window.location.href = "nuevo.html";
    } catch (error) {
        console.log("Error al iniciar sesión: ", error);
        alert("Correo electrónico o contraseña incorrectos.");
    }

    document.getElementById("gmail").value = "";
    document.getElementById("password").value = "";
});
