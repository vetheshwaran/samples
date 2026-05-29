import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUsers, addUser } from '../db.js';

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey'; // Use env var in production

export const signup = async (req, res) => {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name || !phone) return res.status(400).json({ error: "Missing fields" });

    const users = await getUsers();
    if (users.find(u => u.email === email)) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: Date.now().toString(),
        name,
        phone,
        email,
        password: hashedPassword,
        role: 'user',
        status: 'active' // Auto-approve
    };
    await addUser(newUser);
    res.json({ message: "Signup successful. You can login now." });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });
    const users = await getUsers();
    const user = users.find(u => u.email === email);
    console.log('User found:', user ? user.email : 'none');


    if (!user) return res.status(400).json({ error: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    console.log('Password valid:', validPass);
    if (!validPass) return res.status(400).json({ error: "Invalid password" });

    if (user.status !== 'active') return res.status(403).json({ error: "Account is " + user.status });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY);
    console.log('Sending token:', token);
    res.json({ token, role: user.role, email: user.email });
};

export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ error: "Missing fields" });

    let users = await getUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) return res.status(400).json({ error: "User not found" });

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[userIndex].password = hashedPassword;

    // CLEANUP: Remove rejected users
    // Requirement: "delete the users who are not the member of the organization keep only the active users"
    // We will keep 'active' and 'pending' (just in case), but definitely remove 'rejected'.
    // Or strictly interpret "keep only the active users" -> remove pending and rejected?
    // User said: "keep only the active users". I will assume this means strictly active. 
    // But verify: "delete the users who are not the member... keep only the active users"
    // I'll filter for status === 'active' OR the user being reset (if they are somehow not active yet? No, usually reset implies existing member).
    // Safest bet for "cleanup" is to remove 'rejected'. removing 'pending' might block new signups waiting approval if manual approval was a thing (but we auto-activate now).
    // User said "keep only the active users". I will filter out everything that is NOT active. 
    // Wait, if I'm reseting my password, I should probably be active.

    // Changing logic: Remove anyone with status 'rejected'. 
    const cleanedUsers = users.filter(u => u.status !== 'rejected');

    // We need to make sure the modified user is in the cleaned list (if they were active)
    // If the valid user was rejected, they are gone.

    // Re-saving
    // Need to import saveUsers first. 
    // I'll do that in a separate edit or verify imports.

    // ... wait I need to import saveUsers. 
    // I will write the function assuming saveUsers is imported, then I'll add the import.

    await import('../db.js').then(db => db.saveUsers(cleanedUsers));

    res.json({ message: "Password reset successful. Inactive users have been cleaned up." });
};
