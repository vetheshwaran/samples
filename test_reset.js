import axios from 'axios';
import { signup } from './controllers/authController.js';
// We need to interact with DB directly to setup the test state (like making a user rejected)
// Since this script runs in node, we can import db.
import { getUsers, addUser, updateUserStatus } from './db.js';

const runTest = async () => {
    const timestamp = Date.now();
    const activeEmail = `active_${timestamp}@test.com`;
    const rejectedEmail = `rejected_${timestamp}@test.com`;

    console.log("--- Starting Reset Password & Cleanup Test ---");

    try {
        // 1. Create Active User
        console.log(`1. Creating Active User: ${activeEmail}`);
        await axios.post('http://localhost:3000/api/auth/signup', {
            email: activeEmail,
            password: 'oldpassword',
            name: 'Active User',
            phone: '123'
        });

        // 2. Create User to be Rejected
        console.log(`2. Creating User to be Rejected: ${rejectedEmail}`);
        // We signup first
        await axios.post('http://localhost:3000/api/auth/signup', {
            email: rejectedEmail,
            password: 'password',
            name: 'Rejected User',
            phone: '456'
        });

        // Manual Reject
        const users = await getUsers();
        const rejectedUser = users.find(u => u.email === rejectedEmail);
        if (rejectedUser) {
            await updateUserStatus(rejectedUser.id, 'rejected');
            console.log("   User manually set to 'rejected'");
        }

        // 3. Perform Reset Password on Active User
        console.log(`3. Resetting password for: ${activeEmail}`);
        const resetResponse = await axios.post('http://localhost:3000/api/auth/reset-password', {
            email: activeEmail,
            newPassword: 'newpassword123'
        });
        console.log("   Reset Response:", resetResponse.data);

        // 4. Verification
        console.log("4. Verifying results...");

        // Login with OLD password (should fail)
        try {
            await axios.post('http://localhost:3000/api/auth/login', {
                email: activeEmail,
                password: 'oldpassword'
            });
            console.error("   [FAIL] Old password still works!");
        } catch (e) {
            console.log("   [PASS] Old password rejected.");
        }

        // Login with NEW password (should pass)
        try {
            await axios.post('http://localhost:3000/api/auth/login', {
                email: activeEmail,
                password: 'newpassword123'
            });
            console.log("   [PASS] New password accepted.");
        } catch (e) {
            console.error("   [FAIL] New password failed:", e.message);
        }

        // Check Cleanup
        const finalUsers = await getUsers();
        const isRejectedStillThere = finalUsers.find(u => u.email === rejectedEmail);

        if (!isRejectedStillThere) {
            console.log("   [PASS] Rejected user was removed from DB.");
        } else {
            console.error("   [FAIL] Rejected user still exists in DB!");
        }

    } catch (err) {
        console.error("TEST FAILED with Error:", err.message);
        if (err.response) console.error("Response data:", err.response.data);
    }
};

runTest();
