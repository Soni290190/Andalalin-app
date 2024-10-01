import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { ref, set } from "firebase/database";

// Register Function
function register() {
    const nama = document.getElementById('register-nama').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const instansi = document.getElementById('register-instansi').value;
    const telp = document.getElementById('register-telp').value;

    // Validasi password
    if (password !== confirmPassword) {
        alert("Password dan konfirmasi password tidak sesuai!");
        return;
    }

    // Membuat user baru di Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Mendapatkan user ID dari user yang baru dibuat
            const user = userCredential.user;
            
            // Menyimpan data user tambahan di Realtime Database
            set(ref(database, 'users/' + user.uid), {
                nama: nama,
                email: email,
                instansi: instansi,
                telp: telp
            });
            
            alert("Registrasi berhasil!");
        })
        .catch((error) => {
            console.error("Error during registration:", error);
        });
}

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

// Submit Form Function
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
