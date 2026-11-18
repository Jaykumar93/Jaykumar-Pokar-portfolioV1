import type { Job } from './types';

export const jobs: Job[] = [
  {
    "role": "Software Engineer",
    "company": "Coditas",
    "location": "Pune, India",
    "from": "August 2024",
    "to": "Present",
    "current": true,
    "metrics": [
      {
        "value": "40%",
        "label": "efficiency gain"
      },
      {
        "value": "25%",
        "label": "faster requests"
      },
      {
        "value": "200+",
        "label": "issues resolved"
      },
      {
        "value": "20%",
        "label": "faster delivery"
      }
    ],
    "groups": [
      {
        "name": "Performance",
        "items": [
          "Scaled ASP.NET REST APIs serving reporting and calling workflows for a high-traffic production system used by thousands of users.",
          "Cut API request processing time by 25% by refactoring the backend filter pipeline into a modular, testable architecture.",
          "Cut latency on the call-transfer path by removing a redundant DB round-trip and an O(n) scan, and reduced DB contention on recording playback by removing an unnecessary transaction wrapper."
        ]
      },
      {
        "name": "Features",
        "items": [
          "Boosted large-scale operations efficiency by 40% by shipping Bulk Assignment Upload, Bulk Data Update, and automated reporting features, building both the .NET backend services and the Angular UI components.",
          "Designed and shipped Beacon, a 7-widget sales-performance dashboard for reps and managers: new SQL Server schema and stored procedures, .NET services, and an Angular/Kendo UI.",
          "Built and maintained CRM integrations with Salesforce and HubSpot, syncing lead and call-activity data through their APIs.",
          "Built Redis-locked batch checkout for a shared Lead Pool and a consolidated cross-list follow-up queue with CRM re-attribution, both shipped as part of Beacon."
        ]
      },
      {
        "name": "Delivery",
        "items": [
          "Resolved 200+ production and pre-production defects by pairing with QA and product teams, improving system stability and reducing recurring incidents.",
          "Delivered business-critical backend enhancements ahead of schedule, reducing delivery timelines by 20% and earning direct client appreciation.",
          "Ran two-week Agile sprints with GitLab version control and Jira-tracked backlogs, keeping release cadence predictable across the team.",
          "Documented APIs with Swagger/OpenAPI, tested them in Postman, and wrote unit tests with each feature.",
          "Shipped releases through Jenkins CI/CD pipelines, from build to deployment, alongside GitLab and Jira."
        ]
      }
    ]
  },
  {
    "role": "Associate Software Engineer Intern",
    "company": "Coditas",
    "location": "Pune, India",
    "from": "January 2024",
    "to": "August 2024",
    "current": false,
    "metrics": [
      {
        "value": "35%",
        "label": "DB load reduction"
      }
    ],
    "groups": [
      {
        "name": "Build",
        "items": [
          "Built a full-stack Diet Planner application end to end: JWT authentication, role-based authorization, and RESTful CRUD APIs backed by SQL Server.",
          "Designed a normalized relational schema for user profiles, meal preferences, and nutritional data, improving data consistency and query efficiency.",
          "Built a responsive UI with HTML, CSS, JavaScript, and Bootstrap, ensuring smooth usability across devices."
        ]
      },
      {
        "name": "Real-time and cache",
        "items": [
          "Implemented real-time notifications and group messaging using SignalR, increasing application interactivity and user engagement.",
          "Reduced database load by 35% and improved API response times by integrating Redis caching for frequently accessed data."
        ]
      }
    ]
  }
];
