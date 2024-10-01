import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { ref, set, get, onValue } from "firebase/database";
import { uploadBytes, ref as storageRef, getDownloadURL } from "firebase/storage";

// Login Function
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Login successful");
        })
        .catch((error) => {
            console.error("Error during login:", error);
        });
}

// Submit Form
function submitForm() {
    const nama = document.getElementById('nama').value;
    const lokasi = document.getElementById('lokasi').value;
    const dokumen = document.getElementById('dokumen').files[0];

    const userId = auth.currentUser.uid;
    const docRef = storageRef(storage, 'dokumen/' + dokumen.name);
    
    uploadBytes(docRef, dokumen).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
            set(ref(database, 'permohonan/' + userId), {
                namaPemohon: nama,
                lokasi: lokasi,
                dokumenUrl: url,
                status: "Menunggu Verifikasi"
            });
            alert("Pengajuan berhasil!");
        });
    });
}

// Fetch Status Pengajuan
function fetchStatus() {
    const userId = auth.currentUser.uid;
    const statusRef = ref(database, 'permohonan/' + userId);

    onValue(statusRef, (snapshot) => {
        const data = snapshot.val();
        document.getElementById('status-info').innerText = data.status;
    });
}

// Listen to auth changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchStatus();
    }
});
