import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

// Configuración de Firebase (credenciales proporcionadas)
const firebaseConfig = {
    apiKey: "AIzaSyBD417f9drg_U_BCCJpS6aZIaN7S9o_LJw",
    authDomain: "pruevas-53538.firebaseapp.com",
    projectId: "pruevas-53538",
    storageBucket: "pruevas-53538.appspot.com",
    messagingSenderId: "973518171189",
    appId: "1:973518171189:web:8e053f49f71824b6cd557c",
    measurementId: "G-TJDCSNRNPD"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Asegúrate de pasar `app` aquí

// Función para registrar un nuevo usuario
document.getElementById("Enviar").addEventListener("click", async () => {
    var nombre = document.getElementById("inputNombre").value;
    var correo = document.getElementById("inputCorreo").value;
    var contraseña = document.getElementById("inputContraseña").value;

    // Validaciones
    if (nombre === '' || correo === '' || contraseña === '') {
        alert("Todos los campos son obligatorios");
        return;
    }

    if (contraseña.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    try {
        // Crear usuario en Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, correo, contraseña);
        const user = userCredential.user;

        // Aquí puedes almacenar el nombre en la base de datos si es necesario.

        alert(`Bienvenido ${nombre}`);

        // Limpiar los campos del formulario
        document.getElementById("inputNombre").value = "";
        document.getElementById("inputCorreo").value = "";
        document.getElementById("inputContraseña").value = "";
    } catch (error) {
        console.error("Error al registrar el usuario: ", error);
        alert("Hubo un error al registrar el usuario: " + error.message);
    }
});

// JavaScript para alternar la visibilidad de la contraseña
const togglePassword = document.querySelector('#togglePassword');
const passwordField = document.querySelector('#inputContraseña');

togglePassword.addEventListener('click', function () {
    // Cambia el atributo 'type' entre 'password' y 'text'
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    
    // Cambia el ícono según el estado
    this.textContent = type === 'password' ? '🔒' : '🔓';
});
