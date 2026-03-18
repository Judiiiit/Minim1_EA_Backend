import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User';
import Logging from '../library/Logging';

dotenv.config();

// Listas de nombres, apellidos para generar datos aleatorios
const FIRST_NAMES = [
    'Juan', 'Maria', 'Carlos', 'Ana', 'Luis', 'Sofia', 'Pedro', 'Isabel',
    'Miguel', 'Elena', 'Antonio', 'Rosa', 'Diego', 'Carmen', 'Francisco', 'Laura',
    'Fernando', 'Pilar', 'Ricardo', 'Valentina', 'Joaquin', 'Marta', 'Sergio', 'Patricia',
    'Gabriel', 'Silvia', 'Rafael', 'Catalina', 'Alejandro', 'Vanessa', 'Eduardo', 'Mariana'
];

const LAST_NAMES = [
    'Garcia', 'Gonzalez', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Sanchez', 'Perez',
    'Torres', 'Ramirez', 'Flores', 'Castillo', 'Dominguez', 'Vargas', 'Reyes', 'Diaz',
    'Santos', 'Moreno', 'Silva', 'Rivera', 'Fernandez', 'Romero', 'Gutierrez', 'Ortega',
    'Iglesias', 'Navarro', 'Gimenez', 'Velasco', 'Rubio', 'Blanco', 'Medina', 'Herrera'
];

/**
 * Genera un string aleatorio de longitud especificada
 */
function generateRandomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Genera un nombre de usuario único
 */
function generateUsername(): string {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)].toLowerCase();
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)].toLowerCase();
    const randomSuffix = Math.floor(Math.random() * 10000);
    return `${firstName}.${lastName}${randomSuffix}`;
}

/**
 * Genera un email aleatorio
 */
function generateEmail(): string {
    const randomEmail = generateRandomString(12);
    return `${randomEmail}@yopmail.com`;
}

/**
 * Genera una contraseña aleatoria
 */
function generatePassword(): string {
    return generateRandomString(16);
}

/**
 * Genera un usuario aleatorio
 */
function generateUser() {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

    return {
        name: firstName,
        surname: lastName,
        username: generateUsername(),
        email: generateEmail(),
        password: generatePassword()
    };
}

/**
 * Principal - Crea 200 usuarios
 */
async function seedUsers() {
    try {
        // Conectar a MongoDB
        const MONGO_URL = process.env.MONGO_URI || '';
        if (!MONGO_URL) {
            throw new Error('MONGO_URI no está configurado en .env');
        }

        await mongoose.connect(MONGO_URL, { retryWrites: true, w: 'majority' });
        Logging.info('Conexión a MongoDB establecida');

        // Limpiar usuarios existentes (opcional - comentar si no quieres borrar)
        // await User.deleteMany({});
        // Logging.info('Usuarios anteriores eliminados');

        const users = [];

        // Generar 175 usuarios con enabled = true
        for (let i = 0; i < 175; i++) {
            const userData = generateUser();
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            users.push({
                name: userData.name,
                surname: userData.surname,
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
                enabled: true
            });
        }

        // Generar 25 usuarios con enabled = false
        for (let i = 0; i < 25; i++) {
            const userData = generateUser();
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            users.push({
                name: userData.name,
                surname: userData.surname,
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
                enabled: false
            });
        }

        // Insertar usuarios
        const result = await User.insertMany(users);
        Logging.info(`✅ ${result.length} usuarios creados correctamente`);
        Logging.info(`   - 175 usuarios con enabled = true`);
        Logging.info(`   - 25 usuarios con enabled = false`);
        Logging.info(`   - Dominio de emails: @yopmail.com`);

        process.exit(0);
    } catch (error) {
        Logging.error(`Error al crear usuarios: ${error}`);
        process.exit(1);
    }
}

// Ejecutar
seedUsers();
