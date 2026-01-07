import db from '../config/db.js';
import Roadmap from '../models/roadmapModel.js';

async function verifyRoadmap() {
    try {
        console.log('--- Starting Verification ---');

        // 1. Setup: Ensure we have a mentor and a mentee
        const [mentors] = await db.query("SELECT id FROM users WHERE role = 'mentor' LIMIT 1");
        const [mentees] = await db.query("SELECT id FROM users WHERE role = 'mentee' LIMIT 1");

        if (!mentors.length || !mentees.length) {
            console.error('Need at least one mentor and one mentee.');
            process.exit(1);
        }

        const mentorId = mentors[0].id;
        const menteeId = mentees[0].id;
        console.log(`Using Mentor ID: ${mentorId}, Mentee ID: ${menteeId}`);

        // 2. Create a test roadmap with a link
        const roadmapId = await Roadmap.create(mentorId, 'Verification Roadmap', 'Testing duplicates and links');
        await Roadmap.addStep(roadmapId, 'Step 1', 'Desc 1', 1, 'https://example.com/resource');
        console.log(`Created Roadmap ID: ${roadmapId}`);

        // 3. Verify Details Fetching (Links)
        const details = await Roadmap.getRoadmapDetails(roadmapId);
        console.log('Roadmap Details:', JSON.stringify(details, null, 2));

        if (details.steps[0].resource_link === 'https://example.com/resource') {
            console.log('PASS: Resource link fetched correctly.');
        } else {
            console.error('FAIL: Resource link missing or incorrect.');
        }

        // 4. Verify Duplicate Enrollment
        // Enrollment 1
        let isEnrolled = await Roadmap.isUserEnrolled(menteeId, roadmapId);
        console.log(`Enrollment Status (Before): ${isEnrolled}`);

        if (!isEnrolled) {
            await Roadmap.assignToUser(menteeId, roadmapId);
            console.log('Enrolled user for the first time.');
        }

        // Check again
        isEnrolled = await Roadmap.isUserEnrolled(menteeId, roadmapId);
        console.log(`Enrollment Status (After 1st): ${isEnrolled}`);
        if (!isEnrolled) console.error('FAIL: User should be enrolled.');

        // Attempt enrollment again (Simulating controller logic check)
        const isDuplicate = await Roadmap.isUserEnrolled(menteeId, roadmapId);
        if (isDuplicate) {
            console.log('PASS: Duplicate enrollment detected correctly.');
        } else {
            console.error('FAIL: Duplicate enrollment NOT detected.');
        }

        // Cleanup
        await Roadmap.delete(roadmapId);
        console.log('Cleanup completed.');

    } catch (err) {
        console.error('Verification Failed:', err);
    } finally {
        process.exit();
    }
}

verifyRoadmap();
