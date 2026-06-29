const { MongoClient } = require('mongodb');

//URI
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

async function run() {
  try {
    //Conexion
    await client.connect();
    console.log("Conectado exitosamente con Driver Nativo");

    const database = client.db('laboratorio');
    const collection = database.collection('sensores_robotica');

    //Array
    const sensores = [
      { tipo: "Sensor de Humedad", modelo: "DHT11", precision: "±5%" },
      { tipo: "Servo Motor", modelo: "MG996R", torque: "10kg/cm" },
      { tipo: "LED RGB", modelo: "WS2812B", voltaje: "5V" }
    ];

    //Insert
    const result = await collection.insertMany(sensores);
    console.log(`Se insertaron ${result.insertedCount} documentos.`);
    console.log("IDs:", result.insertedIds);

  } catch (error) {
    console.error("Error en driver nativo:", error);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);