import { createEmptyResume, createId } from "./resume.utils";
import type { Resume } from "./resume.types";

export function createDemoResume(): Resume {
  const resume = createEmptyResume({
    id: "demo-fullstack",
    templateId: "classic-ats",
  });

  resume.settings.resumeName = "Full-Stack Developer";
  resume.settings.accentColor = "#4f46e5";
  resume.personal = {
    fullName: "Aarav Mehta",
    jobTitle: "Full-Stack Developer",
    email: "aarav.mehta@email.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    linkedin: "https://linkedin.com/in/aaravmehta",
    github: "https://github.com/aaravmehta",
    portfolio: "https://aaravmehta.dev",
    showPhoto: false,
    photoUrl: "",
  };
  resume.summary =
    "Full-stack developer with 5+ years of experience building production web and mobile products with React.js, Next.js, Node.js, and PostgreSQL. Comfortable owning features from API design through UI delivery, including third-party integrations, AWS deployments, and React Native clients.";
  resume.experience = [
    {
      id: createId(),
      jobTitle: "Senior Full-Stack Developer",
      company: "Northstar Labs",
      employmentType: "full-time",
      location: "Bengaluru, India",
      startDate: "2023-03",
      endDate: "",
      current: true,
      description: [
        "Led development of a Next.js and Node.js platform serving 80,000 monthly active users across web and React Native.",
        "Improved dashboard load time by 35% by optimizing REST API payloads and adding PostgreSQL indexes.",
        "Integrated Firebase Cloud Messaging to deliver transactional and marketing notifications with 99.4% delivery success.",
        "Built reusable React component libraries and mentored 3 engineers on TypeScript, testing, and code review practices.",
      ],
    },
    {
      id: createId(),
      jobTitle: "Full-Stack Engineer",
      company: "Harborly",
      employmentType: "full-time",
      location: "Remote",
      startDate: "2020-06",
      endDate: "2023-02",
      current: false,
      description: [
        "Shipped customer-facing React.js and Node.js features for a B2B operations product used by 40+ enterprise accounts.",
        "Designed REST APIs and PostgreSQL schemas for billing, notifications, and third-party integrations.",
        "Reduced support tickets by 22% by adding structured error handling and clearer API validation messages.",
        "Deployed services on AWS with CI/CD pipelines, CloudWatch monitoring, and staged rollouts.",
      ],
    },
  ];
  resume.education = [
    {
      id: createId(),
      degree: "B.Tech, Computer Science",
      institution: "NIT Karnataka",
      location: "Surathkal, India",
      startDate: "2016-08",
      endDate: "2020-05",
      grade: "8.6 CGPA",
      description: "Coursework in data structures, databases, and distributed systems.",
    },
  ];
  resume.skills = [
    {
      id: "frontend",
      label: "Frontend",
      skills: ["React.js", "Next.js", "TypeScript", "React Native", "Tailwind CSS"],
    },
    {
      id: "backend",
      label: "Backend",
      skills: ["Node.js", "Express", "REST APIs", "Third-party integrations"],
    },
    {
      id: "database",
      label: "Database",
      skills: ["PostgreSQL", "Prisma", "Redis"],
    },
    {
      id: "cloud",
      label: "Cloud / DevOps",
      skills: ["AWS", "Firebase Cloud Messaging", "Docker", "CI/CD"],
    },
    {
      id: "tools",
      label: "Tools",
      skills: ["Git", "GitHub", "Postman", "Jira"],
    },
    {
      id: "soft",
      label: "Soft skills",
      skills: ["Mentoring", "Ownership", "Cross-functional collaboration"],
    },
  ];
  resume.projects = [
    {
      id: createId(),
      name: "PulseBoard",
      role: "Full-Stack Developer",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
      projectUrl: "https://pulseboard.example.com",
      githubUrl: "https://github.com/aaravmehta/pulseboard",
      description: [
        "Built a real-time operations dashboard with role-based access and exportable reports.",
        "Implemented REST APIs, queued background jobs, and AWS-hosted file uploads.",
      ],
    },
    {
      id: createId(),
      name: "NotifyHub",
      role: "Mobile & API Engineer",
      technologies: ["React Native", "Node.js", "Firebase Cloud Messaging"],
      projectUrl: "https://notifyhub.example.com",
      githubUrl: "https://github.com/aaravmehta/notifyhub",
      description: [
        "Created a React Native client and Node.js service for segmented push campaigns.",
        "Added delivery receipts, retry logic, and template-based notification content.",
      ],
    },
  ];
  resume.certifications = [
    {
      id: createId(),
      name: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services",
      date: "2024-04",
      url: "https://aws.amazon.com/certification/",
    },
  ];
  resume.languages = [
    { id: createId(), name: "English", proficiency: "professional" },
    { id: createId(), name: "Hindi", proficiency: "native" },
  ];
  resume.awards = [
    {
      id: createId(),
      title: "Engineering Excellence Award",
      issuer: "Northstar Labs",
      date: "2024-12",
      description: "Recognized for improving reliability and mentoring across two product squads.",
    },
  ];
  resume.customSections = [
    {
      id: createId(),
      title: "Open Source",
      entries: [
        {
          id: createId(),
          heading: "Contributor, form-kit",
          subheading: "TypeScript · React",
          date: "2025",
          description: [
            "Contributed accessible form primitives and documentation used by internal design systems.",
          ],
        },
      ],
    },
  ];

  return resume;
}
