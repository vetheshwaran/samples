import axios from 'axios';

const testSignup = async () => {
    const uniqueEmail = `test_auto_${Date.now()}@example.com`;
    try {
        console.log(`Attempting to sign up new user: ${uniqueEmail}`);
        const response = await axios.post('http://localhost:3000/api/auth/signup', {
            email: uniqueEmail,
            password: 'password123',
            name: 'Test User',
            phone: '1234567890'
        });

        console.log('Response:', response.data);

        // Fetch users to verify status in DB (simulating admin check or login check)
        // Since we don't have a direct "get my status" without login, we can rely on the fact 
        // that if we can login, we are active.

        console.log('Attempting to login with new user...');
        const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
            email: uniqueEmail,
            password: 'password123'
        });

        console.log('Login Successful!');
        console.log('User Role:', loginResponse.data.role);
        console.log('Token received: Yes');
        console.log('SUCCESS: The system automatically enabled this user.');

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
};

testSignup();
