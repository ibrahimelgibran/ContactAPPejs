const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  loadContact,
  findContact,
  addContact,
  deleteContact,
} = require("./utils/contacts");
const app = express();
const port = 3000;
const { body, validationResult } = require("express-validator");

// menggunakan ejs
app.set("view engine", "ejs");

// Third-party middlename
app.use(expressLayouts);

// Built-in middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// ini bisa dibilang rounting
app.get("/", (req, res) => {
  // meembuatan data pakai array
  const mahasiswa = [
    {
      nama: "Gibran",
      email: "elgibran@gmail.com",
    },
    {
      nama: "Ibrahim",
      email: "ibrahim@gmail.com",
    },
    {
      nama: "el",
      email: "el@gmail.com",
    },
  ];
  res.render("index", {
    title: "Halaman home",
    mahasiswa,
    layout: "layouts/main-layout",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "Halaman About",
  });
});

app.get("/contact", (req, res) => {
  // mendapatkan data contact dari file json
  const contacts = loadContact();
  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Halaman Contact",
    contacts,
  });
});

// halaman form tambah data contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Form Tambah Data Contact",
    layout: "layouts/main-layout",
  });
});

// proses data contact
app.post("/contact", (req, res) => {
  addContact(req.body);
  res.redirect("/contact");
});

app.get("/contact/delete/:nama", (req, res) => {
  const contactName = req.params.nama;
  const contactIndex = contacts.findIndex(
    (contact) => contact.nama === contactName
  );

  if (contactIndex !== -1) {
    // Hapus kontak dari array contacts
    contacts.splice(contactIndex, 1);

    // Setelah penghapusan, arahkan pengguna kembali ke halaman "daftar kontak"
    res.redirect("/contact");
  } else {
    // Jika kontak tidak ditemukan, mungkin berikan pesan kesalahan
    res.status(404);
    res.send("<h1>404 - Kontak tidak ditemukan</h1>");
  }
});

// contact pakai params, halaman detail contact
app.get("/contact/:nama", (req, res) => {
  // mendapatkan data contact dadri file json
  const contact = findContact(req.params.nama);
  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Halaman Detail Contact",
    contact,
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>Data berhasil dihapus</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
