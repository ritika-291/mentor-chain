import db from '../config/db.js';
import Roadmap from '../models/roadmapModel.js';

async function verifyUnenrollment() {
    try {
        console.log('--- Starting Unenrollment Verification ---');

        const [mentors] = await db.query("SELECT id FROM users WHERE role = 'mentor' LIMIT 1");
        const [mentees] = await db.query("SELECT id FROM users WHERE role = 'mentee' LIMIT 1");
        const mentorId = mentors[0].id;
        const menteeId = mentees[0].id;

        // Create Roadmap
        const roadmapId = await Roadmap.create(mentorId, 'Unenrollment Test', 'Testing unenrollment');
        await Roadmap.addStep(roadmapId, 'Step 1', 'Desc 1', 1, 'http://example.com');
        console.log(`Created Roadmap ID: ${roadmapId}`);

        // Enroll
        await Roadmap.assignToUser(menteeId, roadmapId);
        let isEnrolled = await Roadmap.isUserEnrolled(menteeId, roadmapId);
        if (!isEnrolled) throw new Error('Enrollment failed');
        console.log('User enrolled successfully.');

        // Verify Details shows isEnrolled=true
        let details = await Roadmap.getRoadmapDetails(roadmapId, menteeId);
        console.log('Enrolled Status in Details:', details.isEnrolled);
        if (!details.isEnrolled) console.error('FAIL: isEnrolled should be true');

        // Unenroll
        await Roadmap.removeUserEnrollment(menteeId, roadmapId);
        console.log('User unenrolled.');

        // Verify Unenrollment
        isEnrolled = await Roadmap.isUserEnrolled(menteeId, roadmapId);
        console.log(`Enrollment Status (After Unenroll): ${isEnrolled}`);

        if (!isEnrolled) {
            console.log('PASS: Unenrollment successful.');
        } else {
            console.error('FAIL: User still enrolled.');
        }

        // Verify Details shows isEnrolled=false
        details = await Roadmap.getRoadmapDetails(roadmapId, menteeId);
        console.log('Enrolled Status in Details:', details.isEnrolled);
        if (details.isEnrolled) console.error('FAIL: isEnrolled should be false');

        // Cleanup
        await Roadmap.delete(roadmapId);
        console.log('Cleanup completed.');

    } catch (err) {
        console.error('Verification Failed:', err);
    } finally {
        process.exit();
    }
}

verifyUnenrollment();
