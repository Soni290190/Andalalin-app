// Firebase Authentication
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('Login berhasil!');
            loadDashboard();
        })
        .catch((error) => {
            console.error('Error login:', error);
        });
}

function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('Registrasi berhasil!');
        })
        .catch((error) => {
            console.error('Error registrasi:', error);
        });
}

// Load Dashboard Pemohon
function loadDashboard() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('login').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            document.getElementById('adminDashboard').style.display = 'none';

            db.collection('permohonan').where('userId', '==', user.uid).onSnapshot((snapshot) => {
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    document.getElementById('statusPermohonan').innerText = data.status;
                    document.getElementById('tanggalUjian').innerText = data.tanggalUjian || 'Belum dijadwalkan';
                    if (data.skUrl) {
                        document.getElementById('skLink').innerHTML = `<a href="${data.skUrl}" download>Download SK</a>`;
                    } else {
                        document.getElementById('skLink').innerText = 'Belum diterbitkan';
                    }
                    showNotifikasi(data.notifikasi);
                });
            });
        } else {
            document.getElementById('login').style.display = 'block';
            document.getElementById('dashboard').style.display = 'none';
        }
    });
}

// Show Pengajuan Form
function showPengajuanForm() {
    document.getElementById('pengajuanForm').style.display = 'block';
}

// Ajukan Permohonan
function ajukanPermohonan() {
    const namaPemohon = document.getElementById('namaPemohon').value;
    const alamatPemohon = document.getElementById('alamatPemohon').value;
    const nomorDokumen = document.getElementById('nomorDokumen').value;
    const dokumen = document.getElementById('dokumen').files[0];

    const userId = firebase.auth().currentUser.uid;

    const storageRef = storage.ref();
    const dokumenRef = storageRef.child(`dokumen/${dokumen.name}`);
    dokumenRef.put(dokumen).then(() => {
        dokumenRef.getDownloadURL().then((url) => {
            db.collection('permohonan').add({
                namaPemohon: namaPemohon,
                alamatPemohon: alamatPemohon,
                nomorDokumen: nomorDokumen,
                userId: userId,
                status: 'Menunggu Verifikasi',
                dokumenUrl: url,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                notifikasi: 'Permohonan anda telah diajukan dan menunggu verifikasi.'
            }).then(() => {
                alert('Permohonan berhasil diajukan!');
                document.getElementById('pengajuanForm').reset();
                document.getElementById('pengajuanForm').style.display = 'none';
                loadDashboard();
            });
        });
    }).catch((error) => {
        console.error('Error mengupload dokumen:', error);
    });
}

// Batal Pengajuan
function cancelPengajuan() {
    document.getElementById('pengajuanForm').style.display = 'none';
}

// Load Dashboard Admin
function loadAdminDashboard() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';

    db.collection('permohonan').onSnapshot((snapshot) => {
        const permohonanList = document.getElementById('permohonan
                                                       
