import db from './db.js';


const initDB=async()=>{
    try{
        await db.query(`CREATE DATABASE IF NOT EXISTS mentorchain`);
        await db.query(`USE mentorchain`);

        await db.query(`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('mentor', 'mentee') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log('Database initialized successfully');
    }catch(error){
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

export default initDB;