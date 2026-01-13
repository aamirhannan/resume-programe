import axios from 'axios';

const API_URL = 'http://localhost:5002/api/process-application';

const sampleJobDescription = `
Object-oriented analysis and design using common design patterns.
Very strong in Web designing technologies like HTML5, XHTML, CSS3, JavaScript, typescript, jQuery, AJAX and JSON
Components, Directives, Services, View References (Parent/Child/Injection), Routing, Lifecycle processing
Interceptors, HTTP Handlers, Reactive Forms (No template forms)
Understanding concepts of S.O.L.I.D. Principles, IOC/DI, and S.O.C.

`;

const testApplication = async () => {
    try {
        console.log('🚀 Starting Application Flow Test...');
        console.log('Target URL:', API_URL);

        // Replace with your actual email to see the result, or use a testing inbox
        const targetEmail = 'aamirhannan08@gmail.com';

        const requestBody = {
            role: 'fullstack',
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
