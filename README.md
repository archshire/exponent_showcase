*This project has been created as part of the 42 curriculum by anteo, dayeo, lnuk-hak, tlee.*

<!-- # General Requirements

## This is a list of general requirements that you must follow, otherwise the project will be rejected

- Project must be a web application, and requires a frontend, backend, and a database.
- Git must be used with clear and meaningful commit messages. Repository must show:
  - Commits from all team members.
  - Clear commit message describing the changes.
  - Proper work distribution across the team.
- Deployment must use a containerization solution (Docker, Podman, or etc.) and run with a single command.
- Website must be compatible with the latest stable version of __Google Chrome__.
- No warnings or errors should appears in the browser console.
- The project must include accessible __Privacy Policy__ and __Terms of Service__ pages with relevant content.
- Multi-user Support is mandatory, concurrent actions and updates are to be handles properly, ensure no data corruption or race condition.

# Technical Requirements

## This section, like the above, is mandatory

- A frontend that is clear, responsive, and accesible across all device.
- Use a CSS framework or styling solution of your choice (e.g. Tailwind CSS, Bootstrap, Material-UI, Styled Components, etc.).
- Store credentials (API keys, env variables, etc.) in a local .env file that is ignored by Git, and provide an .env.example file.
- The database must have a clear schema and well-defined relations.
- Your application must have a basic __user management system__. Users must be able to sign up and log in securely:
  - At minimum: email and password authentication with proper security (hashed password, salted, etc.).
  - Additional authentication methods (OAuth, 2FA, etc.) can be implemented via modules.
- All forms and user inputs must be properly validated in both the frontend and backend.
- For the backend, __HTTPS__ must be used everywhere. -->

# Description

- Name of the team/project

A responsive full-stack web application that aims to strengthen [primary target] and [secondary target]'s mental sum ability through gamified objectives.


## Project Structure

```
├── .github/
│   ├── ISSUE_TEMPLATE/              # GitHub issue templates
│   ├── PULL_REQUEST_TEMPLATE.md      # Pull request template
│   └── workflows/                   # GitHub Actions CI/CD workflows
├── client/              # Frontend application
├── server/              # Backend application
├── test/
│   └── integration/     # Integration tests (end-to-end tests)
├── docs/                # Project documentation
├── scripts/             # Build and utility scripts
├── deps/                # External dependencies
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules
├── CONTRIBUTING.md      # Contribution guidelines
├── LICENSE.md           # Project license
└── README.md            # This file
```

# Instructions

## Setup & Execution

### Quick Start

For a quick start guide, follow these steps:

```bash
git clone <repository-url>
cd ft_transcendence
npm install  # Install dependencies for both client and server
npm run dev  # Start development servers
```

### Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (LTS version) — Download from [nodejs.org](https://nodejs.org/)
- **npm** — Comes bundled with Node.js
- **Git** — Download from [git-scm.com](https://git-scm.com/)

### Detailed Setup Instructions

For comprehensive setup instructions, including:

- Detailed prerequisites and dependencies
- Environment configuration
- Database setup
- Troubleshooting

See the [Setup Guide](./docs/SETUP.md).

### Running the Application

**Development mode:**

```bash
# Terminal 1 - Frontend
cd client
npm run dev

# Terminal 2 - Backend
cd server
npm run dev
```

For production builds and deployment instructions, see the [Deployment Guide](./docs/DEPLOYMENT.md).

# Resources

Declaration of AI usage:

- Claude Haiku 4.5 assisted in the formatting and stylization of project documentations.

<!-- Listing classic references related to the topic, as well as description of how AI was used, specifying which tasks in the project it is used for. -->

# Team Information

| Role | Name | Responsibilities |
|------|------|------------------|
| Product Owner (PO) | dayeo | Define product vision, prioritize features, ensure project meets user needs |
| Project Manager / Scrum Master | anteo | Facilitate team coordination and remove obstacles |
| Technical Lead / Architect | lnul-hak | Oversee technical decisions and architecture |
| Developer | Everyone | Implement features and modules |

# Project Management

## Team Organization

**Task Distribution:** [Describe how work is divided]

**Meetings:** [Schedule and types of meetings]

**Workflow:** [Development workflow, branch strategy, etc.]

## Tools & Services

| Category | Tool | Purpose |
|----------|------|---------|
| Issue Tracking | GitHub Issues | Track bugs, features, tasks |
| Design | Figma | UI/UX design, user flow and whiteboarding |
| Documentation | Google Sheets / Notion | Planning and documentation |
| Collaboration | Miro | Prototyping and whiteboarding |

## Communication Channels

| Channel | Purpose | Team Members |
|---------|---------|--------------|
| Telegram | Quick updates and discussions | All |
| Notion | Documentation and notes | All |
| Slack | General communication | All |


# Technical Stack

## Overview

Our technology stack is designed for a responsive, scalable full-stack web application:

- **Frontend**: [Frontend framework - e.g., React, Vue, Angular]
- **Backend**: [Backend framework - e.g., Node.js + Express, Django, Spring Boot]
- **Database**: [Database - e.g., Supabase, MongoDB, MySQL]
- **Containerization**: Docker / Podman
- **DevOps**: GitHub Actions for CI/CD

For detailed information about technology choices, architecture decisions, and justifications, see the [Architecture Documentation](./docs/ARCHITECTURE.md).

## Testing

Our project uses a comprehensive testing strategy covering unit tests and integration tests to ensure code quality and reliability.

For detailed information on testing frameworks, running tests, test coverage goals, and best practices, see the [Testing Guide](./docs/TESTING.md).

# Database Schema

# Features List

# Modules

## (Each module to be elaborated and justified upon)

# Individual Contributions

# Limitations/Licenses/Credits

For detailed license information, please see [LICENSE.md](LICENSE.md).

This project is part of the 42 School curriculum.

