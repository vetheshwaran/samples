import { getUsers, updateUserStatus } from '../db.js';

export const getAllUsers = async (req, res) => {
    const users = await getUsers();
    res.json(users.map(({ password, ...u }) => u));
};

export const verifyUser = async (req, res) => {
    const { userId, status } = req.body; // status: 'active' | 'rejected'
    if (!['active', 'rejected', 'pending'].includes(status)) return res.status(400).json({ error: "Invalid status" });

    const updated = await updateUserStatus(userId, status);
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json({ message: `User ${status}`, user: updated });
};
