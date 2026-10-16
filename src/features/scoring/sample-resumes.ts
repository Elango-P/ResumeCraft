export interface SampleResumeItem {
  id: string;
  name: string;
  role: string;
  expectedScore: string;
  scoreTag: "high" | "medium" | "low";
  text: string;
  targetJobTitle?: string;
  targetJobDescription?: string;
}

export const SAMPLE_RESUMES: SampleResumeItem[] = [
  {
    id: "senior-fullstack",
    name: "Senior Full-Stack Engineer (Interview-Ready)",
    role: "Senior Full-Stack Engineer",
    expectedScore: "92 / 100",
    scoreTag: "high",
    targetJobTitle: "Senior Full-Stack Engineer",
    targetJobDescription: `We are looking for a Senior Full-Stack Engineer to architect high-scale web platforms.
Requirements:
- 5+ years building distributed web applications with React, Next.js, and TypeScript.
- Strong backend experience with Node.js, Express, and PostgreSQL.
- Cloud deployment and infrastructure experience with AWS, Docker, Kubernetes, and CI/CD pipelines.
- Experience with Redis caching, microservices, and GraphQL/REST APIs.
- Track record of mentoring junior engineers and leading system architecture reviews.`,
    text: `Alex Morgan
Senior Full-Stack Engineer
alex.morgan@techcorp.dev | +1 (555) 234-5678 | San Francisco, CA
linkedin.com/in/alexmorgan-dev | github.com/alexmorgan-code

PROFESSIONAL SUMMARY
Senior Full-Stack Engineer with 6+ years of experience architecting distributed cloud applications and high-throughput web platforms. Track record of scaling systems to 2.5M+ daily active users while reducing p99 latency by 45%. Expert in TypeScript, Next.js, Node.js, PostgreSQL, and AWS cloud infrastructure.

WORK EXPERIENCE
Lead Software Engineer | Apex Cloud Systems | San Francisco, CA
2022 - Present
• Architected a multi-tenant enterprise analytics dashboard in Next.js 15, TypeScript, and Tailwind CSS, increasing user engagement by 38% across 120,000 corporate clients.
• Scaled backend ingestion microservices handling 45,000 requests/sec using Node.js, Express, and Redis, reducing p99 API response times from 420ms to 95ms.
• Spearheaded automated CI/CD migration to GitHub Actions and Docker, reducing deployment cycle times by 65% and saving 14 engineering hours per week.
• Mentored 8 junior and mid-level engineers through bi-weekly architectural workshops and code reviews, resulting in a 30% reduction in production regressions.

Full-Stack Developer | Nova Digital Solutions | San Jose, CA
2019 - 2022
• Engineered real-time collaborative workspace features using WebSockets, React, and PostgreSQL, increasing monthly recurring revenue (MRR) by $240,000.
• Optimized complex SQL database queries and introduced indexing strategies in PostgreSQL, eliminating bottlenecks and cutting database query times by 52%.
• Built automated unit and integration test suites using Vitest and Playwright, elevating test coverage from 44% to 91% across 14 core repositories.
• Partnered with product and UX teams to implement WCAG 2.1 AA accessibility standards, achieving 100% compliance across all customer-facing views.

TECHNICAL SKILLS
• Languages & Frontend: TypeScript, JavaScript, React, Next.js, HTML5, CSS3, Tailwind CSS, Redux, Zustand, GraphQL, RESTful APIs
• Backend & Databases: Node.js, Express, Python, PostgreSQL, Redis, MongoDB, Prisma, SQL
• Cloud & DevOps: AWS (EC2, S3, RDS, Lambda), Docker, Kubernetes, CI/CD, GitHub Actions, Linux, Nginx
• Testing & Tools: Vitest, Jest, Playwright, Git, Jira, Postman, Figma, Agile/Scrum

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2015 - 2019
Dean's Honors List · Magna Cum Laude`,
  },
  {
    id: "mid-developer",
    name: "Mid-Level Developer (Needs Polish)",
    role: "Frontend Developer",
    expectedScore: "72 / 100",
    scoreTag: "medium",
    targetJobTitle: "Frontend Developer",
    targetJobDescription: `Looking for a Frontend Developer with React, TypeScript, and modern CSS expertise. Experience with Next.js, REST APIs, and responsive design required.`,
    text: `Jordan Lee
Frontend Web Developer
jordan.lee@example.com | 555-876-5432
github.com/jordanlee

PROFESSIONAL SUMMARY
Passionate frontend web developer with experience building clean web interfaces using modern frameworks. Detail-oriented team player dedicated to writing maintainable code and solving complex user interface challenges.

WORK EXPERIENCE
Software Developer | Horizon Tech Labs
2022 - Present
• Worked on the main web application using React and JavaScript.
• Responsible for creating reusable UI components and updating styles with Tailwind CSS.
• Helped with API integration and worked with the backend team on data fetching.
• Fixed bugs reported in Jira and participated in daily standup meetings.
• Collaborated with designers to build mobile responsive layouts.

Junior Developer | Pixel Craft Studio
2020 - 2022
• Assisted senior engineers with frontend feature development in HTML, CSS, and React.
• Handled website updates and content adjustments for client websites.
• Did cross-browser testing on Chrome, Safari, and Firefox.
• Participated in sprint planning and weekly retrospectives.

SKILLS
React, JavaScript, HTML5, CSS3, Tailwind CSS, Git, GitHub, REST APIs, Jira

EDUCATION
Associate Degree in Web Development
State Technical College | 2018 - 2020`,
  },
  {
    id: "draft-resume",
    name: "Draft Resume (Critical Issues)",
    role: "Junior Web Developer",
    expectedScore: "44 / 100",
    scoreTag: "low",
    text: `Taylor Smith
Junior Developer

SUMMARY
I am a hard-working team player and self-starter looking for an entry level web developer role. I learn quickly and want to contribute to a dynamic company where I can think outside the box.

EXPERIENCE
Developer Intern
• I worked on bug fixes.
• Did some coding in JavaScript.
• My responsibilities included meetings and testing.

SKILLS
Coding, Communication, Computer skills, Problem solving`,
  },
];
