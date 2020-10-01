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