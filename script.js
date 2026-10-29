// FITUR 1: Ganti tema dengan classList.toggle (slide 21).
const tombolTema = document.querySelector('#tombol-tema');

tombolTema.addEventListener('click', function () {
  const temaGelap = document.body.classList.toggle('dark');
  // Selaraskan warna kontrol Bootstrap dengan tema halaman.
  document.body.setAttribute('data-bs-theme', temaGelap ? 'dark' : 'light');
  tombolTema.textContent = temaGelap ? 'Tema terang ◑' : 'Tema gelap ◐';
  tombolTema.setAttribute('aria-pressed', String(temaGelap));
  tombolTema.setAttribute('aria-label', temaGelap ? 'Aktifkan tema terang' : 'Aktifkan tema gelap');
});

// FITUR 2: Mengubah konten dengan textContent dan kondisi if.
const tombolDemo = document.querySelector('#tombol-demo');
const teksDemo = document.querySelector('#teks-demo');
let demoAktif = false;

function ubahTeks() {
  demoAktif = !demoAktif;
  if (demoAktif) {
    teksDemo.textContent = 'Keren! Kamu baru saja mengubah DOM.';
    tombolDemo.textContent = 'Coba sekali lagi ↺';
  } else {
    teksDemo.textContent = 'Ide bagus dimulai dari satu klik.';
    tombolDemo.textContent = 'Coba klik saya ↗';
  }
}

// Berikan fungsi sebagai callback tanpa tanda kurung (lihat slide 28).
tombolDemo.addEventListener('click', ubahTeks);

// FITUR 3: FAQ dengan querySelectorAll dan forEach (slide 22).
const pertanyaan = document.querySelectorAll('.pertanyaan');

pertanyaan.forEach(function (tombol) {
  tombol.addEventListener('click', function () {
    const jawaban = document.getElementById(tombol.getAttribute('aria-controls'));
    const sudahTerbuka = tombol.getAttribute('aria-expanded') === 'true';
    jawaban.hidden = sudahTerbuka;
    tombol.setAttribute('aria-expanded', String(!sudahTerbuka));
    tombol.querySelector('.faq-icon').textContent = sudahTerbuka ? '+' : '−';
  });
});

// FITUR 4: Menu mobile. Memilih link menutup menu kembali.
const tombolMenu = document.querySelector('#tombol-menu');
const navigasi = document.querySelector('#navigasi');

function tutupMenu() {
  navigasi.classList.remove('terbuka');
  tombolMenu.setAttribute('aria-expanded', 'false');
  tombolMenu.textContent = 'Menu ☰';
}

tombolMenu.addEventListener('click', function () {
  const terbuka = navigasi.classList.toggle('terbuka');
  tombolMenu.setAttribute('aria-expanded', String(terbuka));
  tombolMenu.textContent = terbuka ? 'Tutup ×' : 'Menu ☰';
});

navigasi.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', tutupMenu);
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && tombolMenu.getAttribute('aria-expanded') === 'true') {
    tutupMenu();
    tombolMenu.focus();
  }
});

// FITUR 5: Validasi form Bootstrap menggunakan JavaScript dasar.
const formDaftar = document.querySelector('#form-daftar');
const inputNama = document.querySelector('#nama');
const inputEmail = document.querySelector('#email');
const inputAlamat = document.querySelector('#alamat');
const inputProgramStudi = document.querySelector('#program-studi');
const pilihanJenisKelamin = document.querySelectorAll('input[name="jenisKelamin"]');
const persetujuan = document.querySelector('#persetujuan');
const pesanForm = document.querySelector('#pesan-form');

function tampilkanError(input, pesan) {
  // aria-describedby menghubungkan kontrol dengan tempat pesan error.
  const elemenError = document.getElementById(input.getAttribute('aria-describedby'));
  elemenError.textContent = pesan;
  input.setAttribute('aria-invalid', String(pesan !== ''));
  input.classList.toggle('is-invalid', pesan !== '');
}

formDaftar.addEventListener('submit', function (event) {
  // Simulasi: cegah pengiriman data dan reload halaman.
  event.preventDefault();
  const nama = inputNama.value.trim();
  const email = inputEmail.value.trim();
  const alamat = inputAlamat.value.trim();
  const jenisKelamin = formDaftar.querySelector('input[name="jenisKelamin"]:checked');
  inputEmail.value = email;

  tampilkanError(inputNama, '');
  tampilkanError(inputEmail, '');
  tampilkanError(inputAlamat, '');
  tampilkanError(inputProgramStudi, '');
  tampilkanError(persetujuan, '');
  pilihanJenisKelamin.forEach(function (pilihan) {
    tampilkanError(pilihan, '');
  });
  pesanForm.classList.remove('sukses', 'gagal');
  pesanForm.textContent = '';
  let inputPertamaSalah = null;

  if (nama.length < 2) {
    tampilkanError(inputNama, 'Isi nama lengkap minimal 2 karakter.');
    inputPertamaSalah = inputNama;
  }
  if (email === '' || !inputEmail.validity.valid) {
    tampilkanError(inputEmail, 'Masukkan alamat email yang valid.');
    if (inputPertamaSalah === null) inputPertamaSalah = inputEmail;
  }
  if (alamat === '') {
    tampilkanError(inputAlamat, 'Alamat wajib diisi.');
    if (inputPertamaSalah === null) inputPertamaSalah = inputAlamat;
  }
  if (jenisKelamin === null) {
    pilihanJenisKelamin.forEach(function (pilihan) {
      tampilkanError(pilihan, 'Pilih salah satu jenis kelamin.');
    });
    if (inputPertamaSalah === null) inputPertamaSalah = pilihanJenisKelamin[0];
  }
  if (inputProgramStudi.value === '') {
    tampilkanError(inputProgramStudi, 'Pilih program studi kamu.');
    if (inputPertamaSalah === null) inputPertamaSalah = inputProgramStudi;
  }
  if (!persetujuan.checked) {
    tampilkanError(persetujuan, 'Centang persetujuan simulasi terlebih dahulu.');
    if (inputPertamaSalah === null) inputPertamaSalah = persetujuan;
  }
  if (inputPertamaSalah !== null) {
    pesanForm.classList.add('gagal');
    pesanForm.textContent = 'Periksa kolom yang ditandai, lalu coba lagi.';
    inputPertamaSalah.focus();
    return;
  }

  pesanForm.classList.add('sukses');
  pesanForm.textContent = 'Berhasil, ' + nama + '! Simulasi pendaftaran peserta dari program studi ' + inputProgramStudi.value + ' selesai. Data tidak dikirim atau disimpan.';
  pesanForm.focus();
});

// Bersihkan status lama saat data diubah. Radio dibersihkan sebagai satu grup.
function bersihkanStatus(event) {
  pesanForm.textContent = '';
  pesanForm.classList.remove('sukses', 'gagal');
  if (event.target.name === 'jenisKelamin') {
    pilihanJenisKelamin.forEach(function (pilihan) {
      tampilkanError(pilihan, '');
    });
  } else if (event.target.matches('input, select, textarea')) {
    tampilkanError(event.target, '');
  }
}
formDaftar.addEventListener('input', bersihkanStatus);
formDaftar.addEventListener('change', bersihkanStatus);
