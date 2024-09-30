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

// Load Dashboard
function loadDashboard() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('login').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';

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
                });
            });
        } else {
            document.getElementById('login').style.display = 'block';
            document.getElementById('dashboard').style.display = 'none';
        }
    });
}

// Function to schedule exam
function jadwalkanUjian(permohonanId, tanggalUjian) {
    db.collection('permohonan').doc(permohonanId).update({
        tanggalUjian: tanggalUjian,
        status: 'Ujian Dijadwalkan'
    }).then(() => {
        alert('Ujian berhasil dijadwalkan!');
    }).catch((error) => {
        console.error('Error penjadwalan ujian:', error);
    });
}

// Function to assess exam result
function beriPenilaian(permohonanId, penilaian) {
    db.collection('permohonan').doc(permohonanId).update({
        penilaian: penilaian,
        status: penilaian === 'Lulus' ? 'Lulus Ujian' : 'Tidak Lulus Ujian'
    }).then(() => {
        alert('Penilaian berhasil diberikan!');
    }).catch((error) => {
        console.error('Error penilaian:', error);
    });
}

// Function to publish SK
function terbitkanSK(permohonanId) {
    db.collection('permohonan').doc(permohonanId).update({
        status: 'SK Diterbitkan',
        skUrl: 'https://example.com/sk.pdf' // URL for SK file
    }).then(() => {
        alert('SK berhasil diterbitkan!');
    }).catch((error) => {
        console.error('Error penerbitan SK:', error);
    });
                            }
        
