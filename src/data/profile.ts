export const profile = {
  name: "Jaykumar Pokar",
  title: "Full Stack Developer | .NET, Angular/React, AI-Integrated Applications",
  location: "Pune, India",
  email: "jaykumarpokar9@gmail.com",
  github: "https://github.com/Jaykumar93",
  linkedin: "https://www.linkedin.com/in/jaykumarpokar/",
  resumeUrl: "/resume.pdf",
};

export const navLinks = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "engineering", label: "Engineering" },
  { id: "experience", label: "Experience" },
  { id: "toolkit", label: "Toolkit" },
  { id: "contact", label: "Contact" },
] as const;

/** project index values refer to the order in projects.ts: 0 Cursus, 1 Connect & Sell, 2 Diet Planner */
export const metrics = [
  { value: 40, suffix: "%", label: "efficiency gain from bulk upload, bulk update and automated reporting", project: 1 },
  { value: 25, suffix: "%", label: "faster API requests after the filter pipeline refactor", project: 1 },
  { value: 200, suffix: "+", label: "production and pre-production defects resolved", project: 1 },
  { value: 35, suffix: "%", label: "lower database load from Redis caching in the Diet Planner", project: 2 },
];
