const mongoose = require('mongoose');

//Conexion
mongoose.connect("mongodb://localhost:27017/laboratorio")
  .then(() => console.log("Conectado exitosamente con Mongoose"))
  .catch(err => console.error("Error de conexión:", err));

//Esquema
const componenteSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true 
  },
  stock: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true // Genera createdAt y updatedAt
});

//Creacion modelo
const Componente = mongoose.model('Componente', componenteSchema);

//Inserta datos de prueba
async function crearComponente() {
  try {
    const nuevoComponente = new Componente({
      nombre: "Microcontrolador ESP32",
      stock: 50
    });

    const guardado = await nuevoComponente.save();
    console.log("Documento guardado:", guardado);
    
    // Cerrar conexión al finalizar
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error al guardar:", error);
  }
}

crearComponente();