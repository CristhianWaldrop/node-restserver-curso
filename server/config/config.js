// =====================
//       PUERTO
//======================

process.env.PORT = process.env.PORT || 3000;

// =====================
//   URL BASE DE DATOS
//======================

let urlDB = 'mongodb+srv://user:zfIncPpj2STUAwgn@cluster0.0i6hv.mongodb.net/cafeudemy?retryWrites=true&w=majority';
process.env.URLDB = urlDB;

// =====================
//   CADUCIDAD TOKEN
//======================

process.env.CADUCIDAD_TOKEN = "30d";


// =====================
//    SEED (SEMILLA)
//======================

process.env.SEED = process.env.SEED || 'token-desarrollo';


// =====================
//    GOOGLE CLIEN ID
//======================

process.env.CLIENT_ID = process.env.CLIENT_ID || '181393922924-2k30kgnh4uh5b610oh5v360n6ds7e9i8.apps.googleusercontent.com'