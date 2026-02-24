const axios = require('axios');

async function test() {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Test User',
            email: 'test' + Date.now() + '@example.com',
            password: 'password123'
        });
        console.log('SUCCESS:', res.data);
    } catch (err) {
        console.log('FAIL:', err.response ? err.response.data : err.message);
    }
}

test();
