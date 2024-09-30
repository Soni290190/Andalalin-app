// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// Referensi ke Firestore
const db = firebase.firestore();

// Contoh Menyimpan Data Permohonan
function ajukanPermohonan() {
    db.collection('permohonan').add({
        nama: "John Doe",
        status: "Diajukan",
        tanggal: new Date()
    }).then(() => {
        alert('Permohonan berhasil disimpan di Firebase!');
    }).catch((error) => {
        console.error("Error menambahkan dokumen: ", error);
    });
}
