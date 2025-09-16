import mongoose from "mongoose";
import Product from "./models/product.model.js";
import dotenv from "dotenv";

dotenv.config();

const products = [
    {
        title: "Licra Pierna Larga",
        description: "Licra deportiva larga para entrenamiento de patinaje.",
        code: "LPL01",
        price: 130000,
        status: true,
        stock: 6,
        category: "Uniformes",
        thumbnails: ["/src/assets/LicraPL.jpeg"],
    },
    {
        title: "Licra Pierna Corta",
        description: "Licra corta ideal para competiciones y clima cálido.",
        code: "LPC01",
        price: 120000,
        status: true,
        stock: 7,
        category: "Uniformes",
        thumbnails: ["/src/assets/LicraPC.jpeg"],
    },
    {
        title: "Casco de Patinaje",
        description: "Casco ligero y resistente para uso recreativo y profesional.",
        code: "CP01",
        price: 239000,
        status: true,
        stock: 29,
        category: "Protecciones",
        thumbnails: ["/src/assets/Casco.jpeg"],
    },
    {
        title: "Rodilleras",
        description: "Rodilleras acolchadas para entrenamiento seguro.",
        code: "R01",
        price: 66000,
        status: true,
        stock: 18,
        category: "Protecciones",
        thumbnails: ["/src/assets/Rodilleras.jpeg"],
    },
    {
        title: "Kit de Protección",
        description: "Kit para protección total de brazos y piernas.",
        code: "KP01",
        price: 75000,
        status: true,
        stock: 29,
        category: "Protecciones",
        thumbnails: ["/src/assets/Kit.jpeg"],
    },
    {
        title: "Morral Deportivo",
        description: "Morral resistente para llevar implementos de patinaje.",
        code: "MD01",
        price: 176000,
        status: true,
        stock: 9,
        category: "Accesorios",
        thumbnails: ["/src/assets/Morral.jpeg"],
    },
    {
        title: "Cordones de Alta Resistencia",
        description: "Cordones especiales para botas de patinaje profesional.",
        code: "CAR01",
        price: 33000,
        status: true,
        stock: 60,
        category: "Accesorios",
        thumbnails: ["/src/assets/Cordones.jpeg"],
    },
    {
        title: "Llaves Profesionales",
        description: "Herramientas para ajustes de ejes y ruedas.",
        code: "LP01",
        price: 21000,
        status: true,
        stock: 15,
        category: "Accesorios",
        thumbnails: ["/src/assets/Llaves.jpeg"],
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Conectado a MongoDB");

        // Limpia productos previos
        await Product.deleteMany({});
        console.log("🗑️ Productos anteriores eliminados");

        // Inserta nuevos
        await Product.insertMany(products);
        console.log("🌱 Productos insertados correctamente");

        mongoose.connection.close();
        console.log("🔌 Conexión cerrada");
    } catch (error) {
        console.error("❌ Error al insertar productos:", error);
    }
};

seedDB();