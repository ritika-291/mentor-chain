const mentorDetailsData = [
    {
      "id": 1,
      "name": "Jane Mentor",
      "title": "Senior Full-Stack Engineer",
      "expertise": ["React", "TypeScript", "Node.js", "AWS"],
      "rating": 4.9,
      "availability_status": "High",
      "mentee_count": 12
    },
    {
      "id": 2,
      "name": "Mark Wilson",
      "title": "Lead Data Scientist",
      "expertise": ["Python", "Machine Learning", "NLP", "SQL"],
      "rating": 4.5,
      "availability_status": "Medium",
      "mentee_count": 8
    },
    {
      "id": 3,
      "name": "Alice Johnson",
      "title": "UX/UI Designer",
      "expertise": ["Figma", "Design Systems", "User Research"],
      "rating": 5.0,
      "availability_status": "Low",
      "mentee_count": 5
    },
    {
      "id": 4,
      "name": "Bob Smith",
      "title": "DevOps Architect",
      "expertise": ["Kubernetes", "Docker", "Terraform", "Azure"],
      "rating": 4.7,
      "availability_status": "High",
      "mentee_count": 15
    },
    {
      "id": 5,
      "name": "Clara Lee",
      "title": "Mobile Developer",
      "expertise": ["Flutter", "Dart", "iOS", "Android"],
      "rating": 4.8,
      "availability_status": "Medium",
      "mentee_count": 9
    },
    {
      "id": 6,
      "name": "David Chen",
      "title": "Technical Writer",
      "expertise": ["Documentation", "API Docs", "Content Strategy"],
      "rating": 4.6,
      "availability_status": "High",
      "mentee_count": 6
    },
    {
      "id": 7,
      "name": "Eva Rodriguez",
      "title": "Cyber Security Analyst",
      "expertise": ["Pen Testing", "Cloud Security", "Compliance"],
      "rating": 4.9,
      "availability_status": "Medium",
      "mentee_count": 10
    },
    {
      "id": 8,
      "name": "Frank Miller",
      "title": "Game Developer",
      "expertise": ["Unity", "C#", "Game Design"],
      "rating": 4.4,
      "availability_status": "Low",
      "mentee_count": 3
    },
    {
      "id": 9,
      "name": "Grace Kim",
      "title": "Product Manager",
      "expertise": ["Roadmapping", "Agile", "Market Analysis"],
      "rating": 5.0,
      "availability_status": "Medium",
      "mentee_count": 18
    },
    {
      "id": 10,
      "name": "Henry Wong",
      "title": "Database Administrator",
      "expertise": ["PostgreSQL", "MongoDB", "Performance Tuning"],
      "rating": 4.7,
      "availability_status": "High",
      "mentee_count": 7
    },
    {
      "id": 11,
      "name": "Ivy Green",
      "title": "Soft Skills Coach",
      "expertise": ["Interviewing", "Networking", "Negotiation"],
      "rating": 4.9,
      "availability_status": "High",
      "mentee_count": 20
    },
    {
      "id": 12,
      "name": "Jack Harris",
      "title": "Blockchain Developer",
      "expertise": ["Solidity", "Ethereum", "Smart Contracts"],
      "rating": 4.8,
      "availability_status": "Medium",
      "mentee_count": 11
    },
    {
      "id": 13,
      "name": "Kelly White",
      "title": "Marketing Strategist",
      "expertise": ["SEO", "Content Marketing", "PPC"],
      "rating": 4.6,
      "availability_status": "Low",
      "mentee_count": 4
    },
    {
      "id": 14,
      "name": "Leo Martin",
      "title": "Cloud Solutions Architect",
      "expertise": ["GCP", "Serverless", "Security"],
      "rating": 4.7,
      "availability_status": "Medium",
      "mentee_count": 13
    },
    {
      "id": 15,
      "name": "Mia Taylor",
      "title": "Front-end Specialist",
      "expertise": ["Vue.js", "Tailwind CSS", "A11y"],
      "rating": 4.9,
      "availability_status": "High",
      "mentee_count": 16
    },
    {
      "id": 16,
      "name": "Noah Clark",
      "title": "C++ Developer",
      "expertise": ["C++", "System Programming", "Low Latency"],
      "rating": 4.3,
      "availability_status": "Low",
      "mentee_count": 2
    },
    {
      "id": 17,
      "name": "Olivia Hall",
      "title": "Technical Sales Engineer",
      "expertise": ["Product Demos", "Sales Strategy", "Client Relations"],
      "rating": 4.8,
      "availability_status": "Medium",
      "mentee_count": 7
    },
    {
      "id": 18,
      "name": "Peter Adams",
      "title": "AI Researcher",
      "expertise": ["Deep Learning", "PyTorch", "Computer Vision"],
      "rating": 5.0,
      "availability_status": "High",
      "mentee_count": 19
    },
    {
      "id": 19,
      "name": "Quinn Baker",
      "title": "Full-Stack (Ruby)",
      "expertise": ["Ruby on Rails", "PostgreSQL", "React"],
      "rating": 4.7,
      "availability_status": "Medium",
      "mentee_count": 10
    },
    {
      "id": 20,
      "name": "Riley Scott",
      "title": "System Analyst",
      "expertise": ["Business Process Mapping", "Requirements Gathering"],
      "rating": 4.5,
      "availability_status": "High",
      "mentee_count": 8
    },
    {
      "id": 21,
      "name": "Sam Carter",
      "title": "Go/Golang Developer",
      "expertise": ["Go", "Microservices", "API Design"],
      "rating": 4.6,
      "availability_status": "Medium",
      "mentee_count": 14
    },
    {
      "id": 22,
      "name": "Tess Davis",
      "title": "Creative Director",
      "expertise": ["Branding", "Visual Identity", "Adobe Creative Suite"],
      "rating": 4.9,
      "availability_status": "Low",
      "mentee_count": 3
    },
    {
      "id": 23,
      "name": "Umar Khan",
      "title": "Quality Assurance Engineer",
      "expertise": ["Automation Testing", "Selenium", "Cypress"],
      "rating": 4.8,
      "availability_status": "High",
      "mentee_count": 9
    },
    {
      "id": 24,
      "name": "Vera Lopez",
      "title": "Startup Founder/CEO",
      "expertise": ["Fundraising", "Venture Capital", "Strategy"],
      "rating": 5.0,
      "availability_status": "Medium",
      "mentee_count": 25
    },
    {
      "id": 25,
      "name": "Will James",
      "title": "Embedded Systems Engineer",
      "expertise": ["C", "RTOS", "Hardware Integration"],
      "rating": 4.3,
      "availability_status": "High",
      "mentee_count": 5
    },
    {
      "id": 26,
      "name": "Xena Young",
      "title": "DevOps Specialist",
      "expertise": ["CI/CD", "Jenkins", "Ansible"],
      "rating": 4.7,
      "availability_status": "Medium",
      "mentee_count": 11
    },
    {
      "id": 27,
      "name": "Yara Zaki",
      "title": "Android (Kotlin) Developer",
      "expertise": ["Kotlin", "Jetpack Compose", "Mobile UI"],
      "rating": 4.9,
      "availability_status": "Low",
      "mentee_count": 6
    },
    {
      "id": 28,
      "name": "Zane West",
      "title": "Cloud Networking Engineer",
      "expertise": ["Networking", "VPC", "Load Balancing"],
      "rating": 4.8,
      "availability_status": "High",
      "mentee_count": 14
    },
    {
      "id": 29,
      "name": "Anna Brown",
      "title": "Technical Program Manager",
      "expertise": ["Project Management", "Scrum", "Risk Assessment"],
      "rating": 4.6,
      "availability_status": "Medium",
      "mentee_count": 7
    },
    {
      "id": 30,
      "name": "Ben Green",
      "title": "iOS (Swift) Developer",
      "expertise": ["Swift", "SwiftUI", "Apple Ecosystem"],
      "rating": 4.9,
      "availability_status": "High",
      "mentee_count": 13
    },
    {
      "id": 31,
      "name": "Cynthia Roe",
      "title": "FinTech Specialist",
      "expertise": ["Financial Modeling", "Blockchain", "Compliance"],
      "rating": 4.5,
      "availability_status": "Medium",
      "mentee_count": 9
    },
    {
      "id": 32,
      "name": "Dean Ford",
      "title": "Machine Learning Engineer",
      "expertise": ["TensorFlow", "Pandas", "Statistical Modeling"],
      "rating": 4.8,
      "availability_status": "Low",
      "mentee_count": 4
    },
    {
      "id": 33,
      "name": "Elena King",
      "title": "Customer Success Manager",
      "expertise": ["Client Retention", "Onboarding", "CRM"],
      "rating": 5.0,
      "availability_status": "High",
      "mentee_count": 17
    },
    {
      "id": 34,
      "name": "Felix Hunt",
      "title": "Front-end Architect",
      "expertise": ["WebAssembly", "Performance Optimization", "Webpack"],
      "rating": 4.7,
      "availability_status": "Medium",
      "mentee_count": 10
    },
    {
      "id": 35,
      "name": "Gita Patel",
      "title": "Big Data Engineer",
      "expertise": ["Spark", "Hadoop", "Scala"],
      "rating": 4.4,
      "availability_status": "High",
      "mentee_count": 6
    },
    {
      "id": 36,
      "name": "Hector Cruz",
      "title": "E-commerce Specialist",
      "expertise": ["Shopify", "Conversion Rate Optimization", "Digital Marketing"],
      "rating": 4.6,
      "availability_status": "Medium",
      "mentee_count": 12
    },
    {
      "id": 37,
      "name": "Irene Lopez",
      "title": "Full-Stack (PHP)",
      "expertise": ["Laravel", "PHP", "MySQL", "Vue.js"],
      "rating": 4.9,
      "availability_status": "Low",
      "mentee_count": 5
    },
    {
      "id": 38,
      "name": "Jason Ryu",
      "title": "Technical Recruiter",
      "expertise": ["Interview Prep", "Resume Review", "Career Transitions"],
      "rating": 5.0,
      "availability_status": "High",
      "mentee_count": 22
    },
    {
      "id": 39,
      "name": "Kara Sims",
      "title": "QA/Accessibility Expert",
      "expertise": ["WCAG", "Screen Readers", "Manual Testing"],
      "rating": 4.8,
      "availability_status": "Medium",
      "mentee_count": 8
    },
    {
      "id": 40,
      "name": "Louis Bell",
      "title": "Desktop App Developer",
      "expertise": ["Electron", "WPF", "C#"],
      "rating": 4.3,
      "availability_status": "High",
      "mentee_count": 4
    },
    {
      "id": 41,
      "name": "Maria Soto",
      "title": "Content Designer",
      "expertise": ["Microcopy", "Information Architecture", "UX Writing"],
      "rating": 4.9,
      "availability_status": "Medium",
      "mentee_count": 15
    },
    {
      "id": 42,
      "name": "Nate Ross",
      "title": "Salesforce Developer",
      "expertise": ["Apex", "Lightning Web Components", "CRM Admin"],
      "rating": 4.7,
      "availability_status": "Low",
      "mentee_count": 6
    },
    {
      "id": 43,
      "name": "Owen Perry",
      "title": "Computer Graphics Engineer",
      "expertise": ["WebGL", "OpenGL", "C++"],
      "rating": 4.5,
      "availability_status": "High",
      "mentee_count": 10
    },
    {
      "id": 44,
      "name": "Priya Shah",
      "title": "React Native Developer",
      "expertise": ["React Native", "Expo", "Mobile State Management"],
      "rating": 4.8,
      "availability_status": "Medium",
      "mentee_count": 13
    },
    {
      "id": 45,
      "name": "Quentin Cole",
      "title": "Cloud Security Engineer",
      "expertise": ["Security Audits", "IAM", "Compliance"],
      "rating": 4.9,
      "availability_status": "High",
      "mentee_count": 18
    },
    {
      "id": 46,
      "name": "Ruth Fox",
      "title": "Technical SEO Manager",
      "expertise": ["SEO Audit", "Site Structure", "Ahrefs"],
      "rating": 4.6,
      "availability_status": "Low",
      "mentee_count": 7
    },
    {
      "id": 47,
      "name": "Steve Gates",
      "title": "Quantum Computing Researcher",
      "expertise": ["Qiskit", "Quantum Algorithms", "Physics"],
      "rating": 4.2,
      "availability_status": "Medium",
      "mentee_count": 3
    },
    {
      "id": 48,
      "name": "Tina Hill",
      "title": "Growth Hacker",
      "expertise": ["A/B Testing", "Analytics", "Funnel Optimization"],
      "rating": 5.0,
      "availability_status": "High",
      "mentee_count": 21
    },
    {
      "id": 49,
      "name": "Victor Chen",
      "title": "Embedded Linux Developer",
      "expertise": ["Linux", "Yocto", "Kernel Development"],
      "rating": 4.7,
      "availability_status": "Low",
      "mentee_count": 5
    },
    {
      "id": 50,
      "name": "Wendy Scott",
      "title": "Career Coach (Non-Tech)",
      "expertise": ["Interview Strategy", "Leadership", "Goal Setting"],
      "rating": 4.9,
      "availability_status": "Medium",
      "mentee_count": 14
    }
  ]
export default mentorDetailsData;