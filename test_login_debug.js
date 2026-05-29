import axios from 'axios';

const testLogin = async () => {
    try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
            email: '',
            password: ''
        });
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Error status:', error.response.status);
            console.log('Error data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
};

testLogin();
