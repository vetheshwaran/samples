import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.resolve('users.json');

// Initialize DB if it doesn't exist
const initDB = async () => {
    try {
        await fs.access(DB_PATH);
    } catch {
        // Create with a default admin user
        // password: 'admin' (hashed)
        const initialData = [
            {
                id: 'admin_1',
                email: 'vethesh3@gmail.com',
                password: '$2a$10$x.j.j.j.j.j.j.j.j.j.je', // Placeholder hash, will fix in index.js logic implies real hashing
                role: 'admin',
                status: 'active'
            }
        ];
        // Actually, let's just make it empty and seed in index.js or handle hashing there to be safe.
        // For now, empty array or just structure. 
        await fs.writeFile(DB_PATH, JSON.stringify([], null, 2));
    }
};

export const getUsers = async () => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

export const saveUsers = async (users) => {
    await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
};

export const addUser = async (user) => {
    const users = await getUsers();
    users.push(user);
    await saveUsers(users);
    return user;
};

export const updateUserStatus = async (userId, status) => {
    const users = await getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
        user.status = status;
        await saveUsers(users);
        return user;
    }
    return null;
};
