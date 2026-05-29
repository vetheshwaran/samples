import bcrypt from 'bcryptjs';
import { getUsers, saveUsers } from './db.js';

const resetAdmin = async () => {
    const users = await getUsers();
    const adminIndex = users.findIndex(u => u.email === 'vethesh3@gmail.com');

    if (adminIndex !== -1) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        users[adminIndex].password = hashedPassword;
        await saveUsers(users);
        console.log('Admin password reset to admin123');
    } else {
        console.log('Admin user not found');
    }
};

resetAdmin();
