import axios from 'axios';

const API_URL = 'http://localhost:5002/api/process-application';

const sampleJobDescription = `
We are looking for a Backend Engineer with 2 years of experience to join our fast-paced startup team. 
The ideal candidate should have strong experience with Node.js, Express, and PostgreSQL.
Experience with Redis, Docker, and building RESTful APIs is essential.
You will stand out if you have experience with cloud services like AWS or GCP.
Responsibilities:
- Design and implement scalable backend services.
- Optimize database queries and application performance.
- Collaborate with frontend engineers to integrate APIs.
- Participate in code reviews and architectural discussions.
`;

const testApplication = async () => {
    try {
        console.log('🚀 Starting Application Flow Test...');
        console.log('Target URL:', API_URL);

        // Replace with your actual email to see the result, or use a testing inbox
        const targetEmail = 'aamirhannansde@gmail.com';

        const requestBody = {
            role: 'software engineer',
            jobDescription: sampleJobDescription,
            email: targetEmail
        };

        console.log('Sending request with payload:', {
            role: requestBody.role,
            email: requestBody.email,
            jdPreview: requestBody.jobDescription.substring(0, 50) + '...'
        });

        const startTime = Date.now();
        const response = await axios.post(API_URL, requestBody);
        const duration = (Date.now() - startTime) / 1000;

        console.log(`\n✅ Success! (took ${duration.toFixed(2)}s)`);
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('\n❌ Request Failed!');
        console.error('Full Error:', error);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('No response received. Request was made.');
            console.error('Error Code:', error.code);
        } else {
            console.error('Error Message:', error.message);
        }
        console.error('Stack:', error.stack);
    }
};

testApplication();
