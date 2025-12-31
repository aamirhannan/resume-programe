// test/api-test.js

const API_URL = 'http://localhost:3000/api/generate';

const testCase = {
    role: 'frontend',
    jobDescription: `
        We are seeking a Senior React Developer who matches the following criteria:
        - Expert in React.js and Redux for state management.
        - Experience with Next.js for server-side rendering.
        - Proficient in TypeScript and modern JavaScript.
        - Knowledge of Tailwind CSS and Responsive Design.
        - Familiarity with Jest for testing.
        - Ability to lead a team and demonstrate strong communication skills.
    `
};

async function runTest() {
    console.log('--- Starting API Test ---');
    console.log(`Target URL: ${API_URL}`);
    console.log(`Role: ${testCase.role}`);
    console.log('Sending Request...');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testCase)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        console.log('\n--- Test Result: SUCCESS ---');
        console.log(`ATS Score: ${result.meta.atsScore}/100`);
        console.log(`Matched Signals: ${result.meta.matchedCount}/${result.meta.totalSignals}`);

        console.log('\n--- Evidence Map (Partial) ---');
        console.log(JSON.stringify(result.meta.missingSignals, null, 2));

        console.log('\n--- Reordered Skills (Frontend Category) ---');
        // Checking if data structure exists before accessing
        if (result.data && result.data.technicalSkills && result.data.technicalSkills.frontend) {
            console.log(result.data.technicalSkills.frontend);
            // console.log('... (truncated)');
        } else {
            console.log('No technical skills found in response.');
        }

    } catch (error) {
        console.error('\n--- Test Result: FAILED ---');
        console.error(error.message);
    }
}

runTest();
