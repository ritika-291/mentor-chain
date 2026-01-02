
import pool from '../config/db.js';

const seed = async () => {
    try {
        // Find a mentor or create one
        let [users] = await pool.query('SELECT id FROM users WHERE role = "mentor" LIMIT 1');
        let mentorId;

        if (users.length === 0) {
            console.log('No mentor found. Creating one...');
            // Simple creation (password hashing omitted for seed/demo speed if auth allows, else manual login required)
            // Actually, better to just pick ANY user and make them mentor for this demo if needed, or fail.
            // Let's assume there is at least one user, or created one. 
            // If completely empty, we need a robust seed. 
            // Let's reuse existing user if mentor, else fail gracefully.
            console.error('Please register a mentor first!');
            process.exit(1);
        } else {
            mentorId = users[0].id;
        }

        console.log(`Seeding roadmap for Mentor ID: ${mentorId}`);

        // Create Roadmap
        const [res] = await pool.execute(
            'INSERT INTO roadmaps (mentor_id, title, description) VALUES (?, ?, ?)',
            [mentorId, 'Full Stack Web Development', 'A comprehensive guide to becoming a Full Stack Developer using the MERN stack.']
        );
        const roadmapId = res.insertId;

        // Create Steps
        const steps = [
            { title: 'HTML & CSS Basics', desc: 'Learn the building blocks of the web.', link: 'https://developer.mozilla.org/en-US/' },
            { title: 'JavaScript Fundamentals', desc: 'Variables, loops, functions, and ES6+ syntax.', link: 'https://javascript.info/' },
            { title: 'React.js', desc: 'Component-based UI development.', link: 'https://react.dev/' },
            { title: 'Node.js & Express', desc: 'Backend runtime and framework.', link: 'https://nodejs.org/' },
            { title: 'Database (SQL/NoSQL)', desc: 'Storing data with MySQL or MongoDB.', link: '' }
        ];

        for (let i = 0; i < steps.length; i++) {
            await pool.execute(
                'INSERT INTO roadmap_steps (roadmap_id, title, description, order_index, resource_link) VALUES (?, ?, ?, ?, ?)',
                [roadmapId, steps[i].title, steps[i].desc, i + 1, steps[i].link]
            );
        }

        console.log('Roadmap seeded successfully!');
        process.exit(0);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seed();
