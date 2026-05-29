import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { getUsers, addUser } from './db.js';

import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve path to client/dist
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Seeding Admin
const seedAdmin = async () => {
    const users = await getUsers();
    if (!users.find(u => u.role === 'admin')) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await addUser({
            id: 'admin_1',
            email: 'vethesh3@gmail.com',
            password: hashedPassword,
            role: 'admin',
            status: 'active'
        });
        console.log("Admin seeded: vethesh3@gmail.com / admin123");
    }
};
seedAdmin();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all route to serve index.html for non-API requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
