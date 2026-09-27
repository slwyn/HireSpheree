# HIRESPHERE: A WEB-BASED RECRUITMENT AND APPLICANT TRACKING SYSTEM WITH REAL-TIME VACANCY MANAGEMENT AND CLOUD DOCUMENT STORAGE

## Master Documentation (Chapters 1 to 5)

---

# CHAPTER 1: PROJECT OVERVIEW & BACKGROUND

## 1.1 Introduction & Executive Summary

Recruitment is a core operational function for any growing organization, community enterprise, or business. Finding qualified personnel requires advertising open positions, gathering candidate credentials, evaluating competencies, and communicating hiring outcomes. Despite widespread digital transformation, many local enterprises, community organizations, and small-to-medium offices continue to handle hiring through fragmented manual workflows. Physical paper resumes, walk-in drop-offs, and cluttered generic email inboxes often form the primary intake channels. These unstructured methods lead to misplaced applicant documents, slow response times, lack of communication with candidates, and administrative fatigue for hiring managers.

HireSphere is developed to address these operational challenges directly. As a web-based recruitment and applicant tracking platform, HireSphere centralizes and structures the recruitment process from initial job advertisement to candidate decision evaluation. The system operates as a responsive web application designed for both desktop computers and mobile devices, ensuring that job opportunities remain easily accessible to local job seekers, particularly in Taguig City and neighboring urban areas.

The core value proposition of HireSphere rests on four key capabilities:
1. **Public Vacancy Discovery:** Job seekers can browse verified, active job postings with clear role descriptions, employment types, salary brackets, and available slots without encountering paywalls or compulsory preliminary registration hurdles.
2. **Direct Application Ingestion with Cloud Document Storage:** Applicants submit their credentials and resume documents (in PDF, PNG, DOC, or DOCX format) directly through an integrated modal interface. Submitted documents are uploaded securely to a dedicated cloud storage bucket hosted on Supabase Storage, generating persistent document URLs linked to applicant database records.
3. **Real-Time Administrative Workflow:** Recruiters and administrators access an authenticated portal to create, update, deactivate, and delete job openings. System state changes sync in real-time across both administrative and public interfaces using database change replication.
4. **Candidate Lifecycle Management and Notification Feedback:** Administrators can evaluate incoming applications, review candidate resumes, and record decisions ("Accepted" or "Rejected"). Each decision triggers an automated transactional email notification via the EmailJS service, keeping candidates informed and preventing the common "application black hole." Soft-delete archiving protects against accidental record deletion, enabling recovery through a dedicated trash repository.

By pairing modern front-end technologies with a managed Backend-as-a-Service (BaaS) infrastructure, HireSphere delivers an accessible, production-ready recruitment workflow that lowers the barrier to entry for both job seekers and local employers.

---

## 1.2 Problem Statement & Current Process

### Current Process Analysis
In many local community institutions, non-governmental organizations, and small enterprises, the prevailing hiring process relies on manual, semi-digital channels:

1. **Job Posting and Dissemination:** Announcements are typically printed on physical bulletin boards, posted as social media image updates, or circulated by word of mouth. These channels lack real-time synchronization. When a position is filled or cancelled, public listings often remain active, causing applicants to waste time applying for closed positions.
2. **Application Receipt:** Job seekers submit printed copies of their curriculum vitae or send unformatted emails with file attachments to general organizational inboxes (e.g., `info@` or `contact@`). These inboxes are shared among multiple staff members, resulting in misplaced attachments, buried emails, and zero standardized tracking.
3. **Screening and Candidate Data Management:** Resumes are manually downloaded into arbitrary desktop folders or filed into physical paper folders. Recruiters must manually enter applicant names, phone numbers, and dates into standalone spreadsheets. This manual transfer is error-prone, lacks relational integrity, and makes status auditing across multiple reviewers nearly impossible.
4. **Decision Recording and Communication:** Candidate evaluations are rarely logged in a shared database. Rejected applicants are seldom notified because sending individual status updates is time-prohibitive. Consequently, applicants experience significant uncertainty, while accepted candidates often experience communication delays that harm organizational credibility.

### Comparative Inefficiency Analysis
Table 1.1 illustrates the contrast between the manual legacy hiring process and the centralized HireSphere platform.

**Table 1.1: Comparison Between Current Manual Process and Proposed HireSphere Platform**

| Process Stage | Legacy / Manual Process | Proposed HireSphere Platform |
| :--- | :--- | :--- |
| **Vacancy Advertising** | Static flyers, social media images, fragmented notice boards; listings are often outdated when filled. | Centralized web portal; real-time database-driven postings reflect immediate active/inactive vacancy status. |
| **Application Intake** | Walk-in paper submission or cluttered generic email inboxes with frequent attachment loss. | Dedicated web application form; direct upload of resumes to secure cloud object storage. |
| **Document Management** | Physical filing cabinets or disorganized local desktop folders vulnerable to hardware failure. | Cloud-based object storage with persistent URLs linked relationally to applicant profile records. |
| **Candidate Evaluation** | Ad-hoc notes on physical paper or unshared spreadsheets; no centralized decision trail. | Integrated administrator dashboard with one-click decision controls ("Accept" / "Reject") and audit logging. |
| **Status Communication** | Mostly non-existent communication; applicants receive no feedback or acknowledgement. | Automated transactional email notifications dispatched via EmailJS upon application submission and decision logging. |
| **Data Archiving & Recovery** | Hard deletion of files or physical shredding; lost documents cannot be recovered. | Structured soft-delete mechanism with an administrative Trash Bin for temporary archiving and restoration. |

---

## 1.3 Project Objectives

### General Objective
To design, develop, and deploy **HireSphere**, a web-based recruitment and applicant tracking system that provides real-time job vacancy management, centralized resume ingestion, administrative candidate evaluation, and automated email communication for local employers and job seekers.

### Specific Objectives
To fulfill the general objective, the research project pursues the following specific technical and functional goals:
1. **User Interface and Experience Design:** Develop a responsive, modern web interface using React 18, Tailwind CSS, and Material Tailwind that adapts smoothly across mobile, tablet, and desktop viewports.
2. **Administrative Access Control:** Implement an authenticated administrator management module featuring session storage, password validation, and an automatic 8-hour sliding inactivity timeout.
3. **Relational Database and Security Architecture:** Construct a PostgreSQL database schema hosted on Supabase BaaS, enforcing Row-Level Security (RLS) policies to govern public and administrative read/write privileges.
4. **Cloud Document Ingestion:** Integrate Supabase Storage to handle applicant resume uploads (PDF, PNG, DOC, DOCX up to 10MB), generating secure public URLs stored directly within applicant records.
5. **Transactional Email Integration:** Incorporate the EmailJS browser SDK to automate transactional email dispatches for application receipts, candidate status notifications (acceptance and rejection), and community feedback.
6. **Administrative Governance and Recovery:** Implement job vacancy CRUD tools, applicant tracking modules with status filtering, a soft-delete archival system with an administrative Trash Bin, and a public feedback review module.

---

## 1.4 Scope and Delimitations

To maintain rigorous project boundaries, Table 1.2 defines the explicit scope of HireSphere, differentiating supported functional features from deliberate design delimitations.

**Table 1.2: Boundary Table: In-Scope Features vs. Out-of-Scope Delimitations**

| System Domain | In-Scope (Implemented Capabilities) | Out-of-Scope (Deliberate Delimitations) |
| :--- | :--- | :--- |
| **Target Platform** | Web application accessible via all modern standard web browsers (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge). | Native mobile applications (iOS/Android binaries). Mobile accessibility is provided through responsive web design. |
| **User Roles** | Two operational roles: Public Job Seeker (unauthenticated job discovery and application) and System Administrator (authenticated hiring manager). | Multi-tiered recruiter hierarchies, department-specific sub-admins, or external third-party staffing agency portals. |
| **Job Vacancy Management** | Create, view, edit, toggle active status, and delete job postings with title, company, description, location, salary range, employment type, and slots. | Automated cross-posting to external job aggregators (e.g., LinkedIn API, Google Jobs API, Indeed API). |
| **Application Submission** | Applicant name, email address, and direct resume file upload (PDF, PNG, DOC, DOCX up to 10MB) stored in cloud storage. | Video resume recording, multi-stage psychometric testing, or interactive skills assessments within the portal. |
| **Applicant Evaluation** | Recruiter status marking ("Pending", "Accepted", "Rejected"), application detail review, direct resume document preview and downloading. | Automated AI resume scoring, semantic keyword parsing, or algorithmic candidate ranking. Decisions are human-driven. |
| **Notifications** | Automated transactional email notifications sent to applicants via EmailJS upon application submission and decision logging. | SMS text notifications or WhatsApp integration (requires paid telephony carrier gateways). |
| **Data Protection & Archival**| Soft-delete pattern utilizing timestamped `deleted_at` fields, dedicated administrative Trash Bin for restoration or permanent purge. | Multi-region database replication or real-time disaster recovery failover beyond Supabase managed backups. |
| **Community Feedback** | Public contact and feedback submission form; administrative feedback reports dashboard. | Public review forums, employer rating stars, or comment threads. |
| **Financial / HR Integration**| Static salary range displays (e.g., "Competitive", "PHP 25,000 - 35,000"). | Integrated payroll systems, tax computation, benefits administration, or bank payout integration. |

---

## 1.5 Significance of the Project

The implementation of HireSphere offers tangible operational and academic contributions across three primary stakeholder groups:

### 1. Recruiting Organizations and Business Owners
For community organizations, foundations, and small-to-medium business enterprises, HireSphere eliminates the overhead of managing manual paper applications and chaotic email inboxes. By centralizing job listings, incoming resumes, and candidate evaluations on a single web platform, administrative staff save hours previously spent sorting files and answering status inquiries. Cloud storage eliminates file loss, while real-time updates ensure that vacancies are closed immediately when filled, protecting the organization's reputation.

### 2. Job Seekers and Community Applicants
For job seekers—particularly recent graduates, out-of-school youth, and community residents in Taguig City—HireSphere provides an equitable, accessible gateway to local employment. Applicants can review verified job details and submit their credentials without paying subscription fees or navigating complicated account creation screens. Automated email notifications acknowledge their submissions and communicate hiring decisions, ending the frustration of unacknowledged job applications.

### 3. Academic Evaluators and Future Researchers
For the academic community and future software engineering researchers, HireSphere serves as an empirical case study in architecting lightweight, modern web information systems using Jamstack-inspired principles. It demonstrates how modern front-end frameworks (React) and Backend-as-a-Service architectures (Supabase, PostgreSQL) can deliver high-performance, secure software without the infrastructure overhead of managing traditional dedicated backend servers. Future researchers can use this documentation and codebase as a baseline for investigating automated resume parsing, candidate qualification scoring, and localized employment analytics.

---

## 1.6 Definition of Terms

To ensure clarity throughout this document, the following operational and technical terms are defined:

*   **API (Application Programming Interface):** A set of rules and protocols that allows different software applications to communicate with each other. In HireSphere, APIs enable communication between the React front end, Supabase database, and EmailJS notification services.
*   **BaaS (Backend-as-a-Service):** A cloud computing model where developers outsource backend infrastructure components (database, storage, authentication) to third-party providers. HireSphere utilizes Supabase as its primary BaaS.
*   **CDN (Content Delivery Network):** A geographically distributed network of proxy servers and data centers that caches static web assets (HTML, JavaScript, CSS) closer to end users to reduce latency.
*   **CRUD (Create, Read, Update, Delete):** The four basic persistent storage operations. In HireSphere, administrators perform CRUD operations on job vacancies, candidate applications, and user accounts.
*   **DFD (Data Flow Diagram):** A graphical representation of the flow of data through an information system, modeling process inputs, data stores, and outputs.
*   **ERD (Entity-Relationship Diagram):** A data modeling diagram illustrating the structure of a database, including entities, attributes, relationships, and cardinalities.
*   **HTTPS (Hypertext Transfer Protocol Secure):** An extension of HTTP that encrypts web network traffic using Transport Layer Security (TLS) to safeguard authentication tokens and applicant data.
*   **PWA (Progressive Web Application):** A type of application software built using web technologies that delivers app-like experiences, responsiveness, and performance on any web-enabled device.
*   **RBAC (Role-Based Access Control):** A computer security approach that restricts system access to authorized users based on predefined administrative or user roles.
*   **REST API (Representational State Transfer Application Programming Interface):** An architectural style for networked systems that uses standard HTTP request methods (GET, POST, PUT, DELETE) to query and modify resources.
*   **RLS (Row-Level Security):** A database security feature in PostgreSQL that restricts row visibility and modification permissions based on user identity and execution context.
*   **Responsive Web Design (RWD):** A web design approach that enables web interfaces to dynamically adjust layout, images, and navigation according to the user's screen size and device orientation.
*   **Soft Delete:** A data persistence technique where database records are marked as deleted (typically using a timestamped `deleted_at` column) rather than permanently removed from disk, preserving audit history and enabling recovery.
*   **UI/UX (User Interface / User Experience):** The visual layout, interactive controls, and overall ease of use that a user experiences when interacting with a digital software product.


---

# CHAPTER 2: LITERATURE REVIEW & TECHNICAL CONTEXT

## 2.1 Review of Related Systems & Competitive Matrix

### Theoretical and Empirical Foundation
The shift from traditional paper-based recruitment to web-based electronic recruitment (e-recruitment) represents one of the most critical structural transformations in modern human resource information systems. Early research by Chapman and Webster (2003) examined technology adoption across recruitment and screening workflows, noting that organizations adopting digital intake mechanisms observed dramatic reductions in processing time. However, Chapman and Webster also warned that digital systems often increase the volume of unorganized submissions if the intake pipeline lacks clear requirements and structured document intake mechanisms.

Applicant perception and platform usability play a decisive role in whether job seekers successfully complete applications. Thompson, Braddy, and Wuensch (2008) demonstrated empirically that organizational web appeal directly influences applicant attraction and application completion rates. Their findings indicated that intuitive navigation, clean visual layout, and minimal friction during file submission significantly improve candidate perceptions of organizational competence and fairness. Conversely, platforms requiring exhausting multi-page account creation forms and redundant resume parsing often alienate qualified candidates.

In their comprehensive evaluation of online recruitment methods, Parry and Tyson (2008) highlighted both the organizational benefits and common pitfalls of e-recruitment systems. While organizations consistently realized lower advertising expenditures and shorter hiring cycles, the authors identified communication failure as a primary source of candidate dissatisfaction. When applicants receive no confirmation of receipt or outcome notification, candidate resentment increases, diminishing future engagement. Parry and Tyson concluded that successful e-recruitment systems must incorporate automated, reliable feedback loops to maintain communication transparency.

The technical architecture of recruitment platforms has evolved substantially over the past two decades. Faliagka, Tsakalidis, and Tzimas (2012) described the progression from passive job listing boards to integrated systems that manage data persistence, candidate document ingestion, and administrative decision logging. They emphasized that modern recruitment systems must balance administrative screening efficiency with data security, ensuring that sensitive applicant credentials remain protected against unauthorized access. Furthermore, Holm (2012) argued that e-recruitment should be viewed as a collaborative workflow between candidate and recruiter rather than a passive data repository, requiring systems to support real-time state synchronization and rapid status review.

To explain user adoption of digital platforms, the Technology Acceptance Model (TAM), formulated by Davis (1989), remains the foundational benchmark. TAM posits that system acceptance is governed by two primary constructs: Perceived Usefulness (PU)—the degree to which a user believes the system enhances task performance—and Perceived Ease of Use (PEOU)—the degree to which using the system is free of cognitive effort. In the context of HireSphere, PEOU is optimized through a frictionless, zero-login public application modal where candidates attach documents directly. For administrators, PU is demonstrated through centralized vacancy control, instant resume access, and automated one-click decision notifications that remove repetitive email composition tasks.

### Competitive Matrix and Benchmarking
To identify the unique positioning of HireSphere within the recruitment software landscape, Table 2.1 presents a competitive benchmarking matrix comparing HireSphere against dominant commercial platforms (JobStreet, Indeed, LinkedIn) and conventional manual email-based recruitment.

**Table 2.1: Competitive Benchmarking Matrix of Recruitment Solutions**

| Evaluation Criteria | JobStreet | Indeed | LinkedIn | Manual / Email ATS | HireSphere (Proposed) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Target User Base** | Regional corporate job seekers; established commercial employers. | Global and national labor market; general corporate vacancies. | Corporate professionals, executives, and white-collar talent. | Walk-in applicants and casual email senders. | Local community job seekers, recent graduates, and local employers. |
| **Applicant Access Barrier** | High (Mandatory detailed profile creation, multi-step resume builder). | Moderate (Compulsory email account creation, profile setup). | High (Requires complete professional profile, network curation). | Low (Direct email attachment or physical paper drop-off). | Minimal (Immediate vacancy viewing; direct submission with name, email, and resume). |
| **Employer Cost Structure** | High commercial listing fees per post; enterprise packages. | Pay-per-click sponsored listings; subscription tiers. | High cost per job post; premium recruiter enterprise licenses. | Free (uses existing email accounts), but high labor cost. | Low / Free open-source deployment using cloud BaaS free tier. |
| **Document Storage & Retrieval** | Proprietary internal database; candidates locked into platform format. | Cloud resume parsing; limited raw document access for free tier. | Standardized LinkedIn profile format; PDF exports. | Disorganized local PC folders or paper filing cabinets. | Dedicated Supabase cloud object storage bucket with persistent secure URLs. |
| **Real-Time Synchronization** | Periodic polling; delayed notification feeds. | Batch indexing; search caching delays updates. | Polling-based web socket feeds; heavy resource load. | None (static manual checking of physical mail or inbox). | PostgreSQL database replication via Supabase Realtime channels. |
| **Applicant Feedback Loop** | Automated generic system notifications; often delayed. | Automated system emails; limited recruiter customization. | Automated rejection or invitation messages. | Highly inconsistent; majority of applicants receive no response. | Automated transactional email notifications via EmailJS upon receipt & decision. |
| **Administrative Complexity** | High; requires formal recruiter onboarding and training. | Moderate to High; complex dashboard with multiple analytics tabs. | High; sophisticated search algorithms and candidate filters. | Low initial setup; unmanageable long-term maintenance. | Streamlined, intuitive administrative dashboard focused on core triage tasks. |
| **Data Control & Recovery** | Third-party vendor locked; limited data export flexibility. | Platform controlled; subject to third-party vendor policies. | Platform controlled; candidate data held within network. | High vulnerability; accidental local file deletion is permanent. | Self-managed PostgreSQL instance with built-in soft-delete recovery trash bin. |

---

## 2.2 Technology Stack Justification

The technical architecture of HireSphere is chosen to deliver high performance, responsive design, data integrity, and low infrastructure maintenance costs. Table 2.2 provides an evaluated justification matrix comparing the chosen technologies against industry alternatives.

**Table 2.2: Technology Stack Justification Matrix**

| Architectural Layer | Selected Technology | Evaluated Alternatives | Technical Justification & Trade-off Analysis |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **React.js (v18.2)** | • Vanilla HTML5/JS<br>• Multi-page PHP (Laravel)<br>• Vue.js | **Justification:** React's Virtual DOM ensures rapid view updates without full-page reloads, providing a smooth Single Page Application (SPA) experience. Component modularity enables clean separation between the job listing view, application modal, and administrative panels. React Router DOM (v6.28) provides animated client-side navigation. React Hook Form (v7.53) guarantees efficient form validation with minimal component re-renders.<br>**Trade-off:** Initial JavaScript bundle size is larger than plain HTML, but optimized build chunking mitigates loading delays. |
| **Styling & Design System** | **Tailwind CSS (v3.4) & Material Tailwind** | • Bootstrap 5<br>• Semantic UI<br>• Custom Vanilla CSS | **Justification:** Tailwind CSS operates as a utility-first compiler that strips unused CSS during production builds, resulting in lightweight stylesheet bundles. Breakpoint prefixes (`sm:`, `md:`, `lg:`) enable fluid responsive design across mobile and desktop displays. Integrated backdrop-blur and glassmorphism utilities deliver a modern visual aesthetic without heavy UI framework bloat. |
| **Backend & Database Infrastructure** | **Supabase BaaS (PostgreSQL)** | • Custom Express.js/Node.js + MySQL<br>• Firebase Firestore<br>• SQLite / Django | **Justification:** Supabase provides an enterprise-grade PostgreSQL relational database combined with native Backend-as-a-Service capabilities. Relational integrity enforces foreign key constraints between jobs, applications, and feedback. PostgreSQL Row-Level Security (RLS) policies allow declarative access control enforced directly at the database layer. Supabase Realtime provides instant client synchronization via PostgreSQL replication publications, eliminating the need to maintain custom WebSocket servers.<br>**Trade-off:** Developer must understand PostgreSQL RLS syntax rather than application-level middleware rules. |
| **Cloud Document Storage** | **Supabase Cloud Storage** | • AWS S3 bucket<br>• Cloudinary<br>• Local file system storage | **Justification:** Supabase Storage integrates directly with the project's PostgreSQL database engine, allowing storage policies to mirror database RLS rules. Resumes uploaded by job seekers are securely stored in the dedicated `resume` bucket, generating direct HTTPS public URLs that attach cleanly to application database records without requiring complex third-party AWS IAM role configurations. |
| **Transactional Email Engine** | **EmailJS Browser SDK (v4.4)** | • Backend SMTP (Nodemailer)<br>• SendGrid API<br>• Mailgun | **Justification:** EmailJS allows secure client-side transactional email dispatch directly from the web client using predefined cloud email templates. This eliminates the operational requirement of hosting a dedicated backend server or exposing SMTP server credentials on the client. It reliably sends confirmation emails, application notifications, and decision alerts directly to candidates' Gmail inboxes. |
| **Client Session Security** | **Browser SessionStorage with Sliding Timeout** | • LocalStorage tokens<br>• JWT in HttpOnly Cookie<br>• Server-side PHP sessions | **Justification:** Storing administrative session metadata in `sessionStorage` guarantees that admin credentials and tokens are automatically purged when the browser tab or window closes. HireSphere reinforces this with a client-side sliding window timer (8 hours) that monitors mouse, keyboard, and scroll activity, automatically logging out inactive administrators to protect unattended administrative terminals. |


---

# CHAPTER 3: METHODOLOGY & SYSTEM ARCHITECTURE DESIGN

## 3.1 Software Development Life Cycle (SDLC) Methodology

To develop HireSphere with flexibility, rapid feedback, and high architectural fidelity, the research team adopted the **Agile Scrum framework** (Schwaber & Sutherland, 2020). Traditional linear methodologies, such as the classic Waterfall model, require rigid upfront specifications that make accommodating interface refinements or database adjustments difficult. Scrum's iterative structure allows the project team to inspect and adapt software components across continuous cycles called **Sprints**.

The development lifecycle of HireSphere was divided into four distinct two-to-three-week Sprints, covering a total project span of 10 weeks:

### Sprint 1: Discovery, Requirements Analysis, & UI Wireframing (Weeks 1–2)
*   **Objectives:** Identify core operational bottlenecks in community recruitment, define user stories, and design preliminary user interfaces.
*   **Activities:**
    *   Conducted stakeholder interviews with local hiring administrators and job applicants in Taguig City to document existing manual hiring pain points.
    *   Formulated the Product Backlog containing user stories categorized by user role (Job Seeker and System Administrator).
    *   Created responsive wireframes and low-fidelity prototypes for public job listing screens, application modals, and administrative dashboards.
    *   Designed the initial conceptual relational database schema for job vacancies, applications, and feedback.
*   **Deliverables:** Prioritized Product Backlog, architectural specification document, UI wireframes, and database entity models.

### Sprint 2: Database Implementation, BaaS Provisioning, & Cloud Storage (Weeks 3–4)
*   **Objectives:** Establish the persistent data layer, configure cloud services, and implement security policies.
*   **Activities:**
    *   Provisioned the Supabase project instance with managed PostgreSQL database clustering.
    *   Executed SQL migration scripts to construct relational tables (`jobs`, `applications`, `users`, `tokens`, and `feedback`).
    *   Implemented PostgreSQL Row-Level Security (RLS) policies defining public read/insert permissions and administrative access.
    *   Configured the Supabase Storage bucket (`resume`), establishing upload file constraints (PDF, PNG, DOC, DOCX up to 10MB) and public access policies.
    *   Engineered database indexes, notably `idx_applications_deleted_at`, to optimize queries filtering active vs. archived applications.
*   **Deliverables:** Live, tested PostgreSQL database schema, functioning cloud storage bucket, and active RLS security policies.

### Sprint 3: Frontend Component Engineering & Interface Modules (Weeks 5–7)
*   **Objectives:** Build the interactive web application using React 18, React Router, and Tailwind CSS.
*   **Activities:**
    *   Constructed the public presentation layer: responsive navigation bar, hero banner, job listing grid with vacancy cards, and company mission/vision views.
    *   Engineered the `JobApplicationModal` component utilizing React Hook Form for client-side validation and file attachment handling.
    *   Developed the administrative authentication view (`AdminLogin`) with validation rules, error handling, and session persistence.
    *   Built the primary administrative dashboard (`AdminInterface`), including modular sub-views: `AdminJobListings`, `UserApplications`, `ApplicationInfo`, `TrashBin`, and `FeedbackReports`.
    *   Implemented the soft-delete application architecture and recovery mechanisms.
*   **Deliverables:** Functional, fully responsive React Single Page Application (SPA) with integrated navigation and state management.

### Sprint 4: System Integration, Real-Time Subscriptions, Testing, & Production Deployment (Weeks 8–10)
*   **Objectives:** Integrate the front-end application with Supabase services and EmailJS, perform comprehensive quality testing, and deploy to production.
*   **Activities:**
    *   Integrated the Supabase JavaScript Client (`@supabase/supabase-js`) to connect React components with PostgreSQL tables and cloud storage.
    *   Configured Supabase Realtime channels across `jobs` and `applications` tables to push instant UI updates without manual browser refresh.
    *   Integrated the EmailJS browser SDK (`@emailjs/browser`) to trigger transactional emails upon application submission and administrative decision logging.
    *   Executed comprehensive testing: unit tests, cross-browser responsive testing, OWASP Top 10 security reviews, and User Acceptance Testing (UAT).
    *   Configured environment variables (`.env`) for deployment and performed final production build verification.
*   **Deliverables:** Production-ready HireSphere web application, verified UAT test logs, and final documentation.

---

## 3.2 Functional & Non-Functional Requirements

### 3.2.1 Functional Requirements (FR)
The functional requirements define the explicit business logic, user interactions, and operational features implemented within HireSphere:

*   **FR-01: Job Vacancy Administration:** The system shall allow authenticated administrators to create, read, update, and delete (CRUD) job vacancy postings. Each vacancy record includes: job title, company name, detailed role description, physical location, salary range, employment type (Full-time, Part-time, Contract, Internship), available slot count, and active status flag.
*   **FR-02: Public Vacancy Discovery:** The system shall allow unauthenticated public visitors to browse all active job listings, inspect job descriptions, and view current available slots.
*   **FR-03: Frictionless Application Ingestion:** The system shall enable job seekers to apply directly to any active job posting via an integrated modal interface by providing their full name, valid email address, and attaching a resume document.
*   **FR-04: Cloud Resume Storage Management:** The system shall validate uploaded resume files on the client side (verifying accepted MIME types: PDF, PNG, DOC, DOCX up to 10MB) and upload the file to Supabase Storage, generating a persistent public HTTPS URL attached to the candidate's database application record.
*   **FR-05: Candidate Evaluation Workflow:** The system shall provide administrators with a dedicated candidate evaluation view (`ApplicationInfo`) where recruiters can inspect candidate details, view/download the original resume file, and record a hiring decision ("Accepted" or "Rejected").
*   **FR-06: Automated Transactional Email Notifications:** The system shall dispatch automated transactional emails via EmailJS to the applicant upon successful application submission and upon recording an administrative decision (Acceptance or Rejection notification).
*   **FR-07: Soft-Delete Archival & Trash Bin Recovery:** The system shall implement a soft-delete mechanism for candidate applications. When an administrator removes an application, the system updates the `deleted_at` timestamp rather than purging the record from disk. The record moves to an administrative Trash Bin view where it can be selectively restored or permanently deleted.
*   **FR-08: Visitor Feedback Management:** The system shall allow visitors to submit feedback and suggestions via the Contact Us interface. Submissions are persisted in the `feedback` database table and presented in real-time within the administrator's Feedback Reports module.
*   **FR-09: Administrator Authentication & Session Security:** The system shall restrict administrative routes using protected route wrappers (`ProtectedAdminRoute`). Successful authentication establishes an 8-hour session in browser `sessionStorage`, backed by activity event listeners (mouse, keyboard, scroll) that automatically log out inactive users.

### 3.2.2 Non-Functional Requirements (NFR)
The non-functional requirements define the quality attributes, performance constraints, and security standards governing HireSphere:

*   **NFR-01: Performance Efficiency:** Public job listing screens and application modals shall achieve a First Contentful Paint (FCP) of less than 1.5 seconds and a Time to Interactive (TTI) of less than 2.0 seconds over standard broadband connections. Database read queries via the Supabase Client shall execute in under 250 milliseconds.
*   **NFR-02: Security & Access Control:**
    *   All client-server communications shall be strictly encrypted over HTTPS (TLS 1.3).
    *   Database-level Row-Level Security (RLS) policies shall govern PostgreSQL tables, preventing unauthorized public read access to administrative application lists or user credentials.
    *   Administrative credentials shall never be exposed in client-side code bundles; session tokens stored in `sessionStorage` shall automatically terminate upon browser window closure.
*   **NFR-03: System Reliability & Availability:** The system shall achieve a 99.9% uptime Service Level Agreement (SLA), supported by cloud-hosted serverless edge networks and managed PostgreSQL database clustering provided by Supabase.
*   **NFR-04: Usability & Ergonomics (ISO 9241-11):** The user interface shall conform to ISO 9241-11 usability standards (effectiveness, efficiency, satisfaction). The layout shall employ responsive fluid grids and intuitive form validation prompts that allow a first-time applicant to complete a job submission in under two minutes without requiring documentation assistance.
*   **NFR-05: Cross-Browser & Device Compatibility:** The application shall maintain visual and operational consistency across all modern rendering engines, including Chromium-based browsers (Chrome, Edge), Gecko (Firefox), and WebKit (Safari), spanning viewports from small mobile displays (375px) to large desktop monitors (1920px).

---

## 3.3 System Architecture & Design Diagrams

### 3.3.1 System Architecture Diagram
HireSphere is structured as a **Three-Tier Client-Server BaaS Architecture**, illustrated in Figure 3.1.

```
+=============================================================================+
|                           HIRESPHERE ARCHITECTURE                           |
+=============================================================================+

  [ CLIENT TIER / PRESENTATION LAYER ]
  +-------------------------------------------------------------------------+
  |  Web Browser (Mobile / Desktop)                                         |
  |  - React 18 Single Page Application (SPA)                               |
  |  - React Router DOM (Navigation & Protected Routes)                     |
  |  - Tailwind CSS / Material Tailwind UI Components                       |
  |  - React Hook Form (Input Validation)                                   |
  |  - Browser SessionStorage (Admin Session with Sliding Inactivity Timer) |
  +--------------------+-------------------------------+--------------------+
                       |                               |
       HTTPS REST /    |               Cloud Storage   |   Transactional
       WebSocket Event |               Uploads         |   Email Calls
                       v                               v                    v
  [ APPLICATION & SERVICE TIER ]
  +-------------------------------------+   +-----------------------------+
  |  Supabase BaaS API Engine           |   |  EmailJS Cloud Relay        |
  |  - PostgREST (RESTful Data Access)  |   |  - Transactional Email Svc  |
  |  - GoTrue Auth & Service Role Rules |   |  - HTML Email Templates     |
  |  - Realtime Engine (WebSocket Sync) |   |  - Gmail SMTP Integration   |
  +------------------+------------------+   +--------------+--------------+
                     |                                     |
                     v                                     v
  [ DATA & PERSISTENCE TIER ]                       [ EXTERNAL RECIPIENT ]
  +---------------------------------------+         +--------------------+
  |  Managed PostgreSQL Database Instance |         |  Applicant's Inbox |
  |  - Tables: jobs, applications,        |         |  (Gmail, Yahoo,    |
  |            users, tokens, feedback    |         |   Outlook)         |
  |  - Row-Level Security (RLS) Engine    |         +--------------------+
  |  - Storage: "resume" Object Bucket    |
  +---------------------------------------+
```
*Figure 3.1: HireSphere Three-Tier System Architecture Diagram*

*   **Presentation Tier (Client):** The user interface runs entirely within the client's browser as a compiled React 18 Single Page Application. It handles rendering, route navigation, form validation, and file selection. Client-side state and administrative session timers reside in browser memory and `sessionStorage`.
*   **Application & Service Tier:** Serviced through managed cloud endpoints. Supabase PostgREST translates database queries into secure HTTPS REST calls. The Supabase Realtime engine listens to PostgreSQL Write-Ahead Logs (WAL) and broadcasts database events over WebSockets. Concurrently, EmailJS acts as a serverless email gateway, dispatching structured transactional messages without requiring a dedicated SMTP server.
*   **Data & Persistence Tier:** An enterprise-grade PostgreSQL relational database maintains data persistence, enforces foreign key constraints, and executes Row-Level Security policies. Supabase Cloud Storage manages binary files (candidate resumes) with public URL generation.

---

### 3.3.2 Entity-Relationship Diagram (ERD)
The relational schema of HireSphere is modeled in Figure 3.2, depicting all entities, attributes, primary keys (PK), foreign keys (FK), and relational cardinalities.

```
+---------------------------------------+
|                 JOBS                  |
+---------------------------------------+
| PK  id: uuid                          |
|     title: text                       |
|     company: text                     |
|     description: text                 |
|     location: text                    |
|     salary_range: text                |
|     job_type: text                    |
|     posted_date: date                 |
|     slots_available: integer          |
|     is_active: boolean                |
|     created_at: timestamptz           |
+-------------------+-------------------+
                    | 1
                    |
                    | has zero or many (1:N)
                    |
                    v N
+---------------------------------------+         +----------------------------------+
|             APPLICATIONS              |         |              USERS               |
+---------------------------------------+         +----------------------------------+
| PK  id: uuid                          |         | PK  id: uuid                     |
| FK  job_id: uuid (references jobs)   |         |     first_name: text             |
| FK  user_id: uuid (references users)  |<--------+     middle_name: text            |
|     applicant_name: text              | N     1 |     surname: text                |
|     email: text                       |         |     email: text [UNIQUE]         |
|     tel: text                         |         |     contact_number: text         |
|     requirement_file_url: text        |         |     password_hash: text          |
|     unique_id: text                   |         |     verified: boolean            |
|     decision: text                    |         |     created_at: timestamptz      |
|     notes: text                       |         +-----------------+----------------+
|     deleted_at: timestamptz           |                           | 1
|     created_at: timestamptz           |                           |
+-------------------+-------------------+                           | has (1:N)
                    |                                               v N
                    | references                               +--------------------+
                    v                                          |       TOKENS       |
+---------------------------------------+                      +--------------------+
|            STORAGE.OBJECTS            |                      | PK  id: uuid       |
+---------------------------------------+                      |     token: text    |
| PK  id: uuid                          |                      |     email: text    |
|     bucket_id: 'resume'               |                      |     type: text     |
|     name: text                        |                      |     expires_at: ts |
|     created_at: timestamptz           |                      |     created_at: ts |
+---------------------------------------+                      +--------------------+

+---------------------------------------+
|               FEEDBACK                |
+---------------------------------------+
| PK  id: uuid                          |
|     message: text                     |
|     created_at: timestamptz           |
+---------------------------------------+
```
*Figure 3.2: HireSphere Entity-Relationship Diagram (ERD)*

#### Schema Specification Details:
1.  **`jobs` Table:** Stores vacancy advertisements. The `slots_available` integer tracks vacancy openings. The boolean flag `is_active` dictates public visibility.
2.  **`applications` Table:** Central operational repository for submissions. Foreign key `job_id` connects each application to its parent vacancy. The `requirement_file_url` stores the HTTPS URL pointing to the uploaded resume. The `decision` attribute records candidate status (`pending`, `accepted`, `rejected`). The nullable `deleted_at` timestamp supports soft-deletion.
3.  **`users` Table:** Maintains user profile records with encrypted credential hashes and personal contact details.
4.  **`tokens` Table:** Manages single-use authentication and password recovery tokens, enforced with an expiration timestamp (`expires_at`).
5.  **`feedback` Table:** Collects community and candidate feedback submitted through the public Contact view.
6.  **`storage.objects` (`resume` Bucket):** Supabase internal storage table holding candidate resume files.

---

### 3.3.3 Use Case Diagram
The Use Case Diagram in Figure 3.3 models the interactions between primary system actors (Job Seeker, System Administrator) and the external EmailJS gateway.

```
                     HIRESPHERE SYSTEM BOUNDARY
+--------------------------------------------------------------------+
|                                                                    |
|     (Browse Active Job Vacancies) <---------------+                |
|                           ^                       |                |
|                           | (includes)            |                |
|                           v                       |                |
|     (View Vacancy Details & Slots)                |                |
|                           ^                       |                |
|                           | (extends)             |                |
|                           v                       |                |
|     (Submit Application & Resume)                 |                |
|                           |                       |                |
|                           | (triggers)            |                |
|                           v                       |                |
|               <<System Process>>                  |                |
|           [Dispatch Email Alert] -----------------+-------------> (( EmailJS Gateway ))
|                           ^                                        |
|                           | (triggers)                             |
|                           |                                        |
|     (Log Candidate Decision: Accept/Reject) <---+                  |
|                           ^                     |                  |
|                           | (requires)          |                  |
|                           v                     |                  |
|     (Inspect Candidate Details & Resume)        |                  |
|                           ^                     |                  |
|                           | (requires)          |                  |
|                           v                     |                  |
|     (Manage Job Listings: CRUD Vacancies)       |                  |
|                           ^                     |                  |
|                           | (requires)          |                  |
|                           v                     |                  |
|     (Soft-Delete & Restore from Trash Bin)      |                  |
|                           ^                     |                  |
|                           | (requires)          |                  |
|                           v                     |                  |
|     (Review Community Feedback Reports)         |                  |
|                           ^                     |                  |
|                           | (includes)          |                  |
|                           v                     |                  |
|     (Authenticate via Admin Login Portal) <-----+                  |
|                                                 |                  |
+-------------------------------------------------+------------------+
          ^                                       ^
          |                                       |
    (( Job Seeker ))                    (( System Administrator ))
```
*Figure 3.3: HireSphere Use Case Diagram*

#### Use Case Actor Descriptions:
*   **Job Seeker:** Unauthenticated actor who browses published vacancies, inspects requirements, fills out the submission modal, uploads their resume, and submits contact feedback.
*   **System Administrator:** Authenticated actor who logs in, manages vacancies (CRUD), reviews applicant submissions, views resumes, records hiring decisions (Accept/Reject), recovers or purges deleted records via the Trash Bin, and reviews incoming feedback reports.
*   **EmailJS Gateway:** External serverless actor triggered by system events to dispatch structured HTML notifications to candidate email addresses.

---

### 3.3.4 Data Flow Diagrams (DFD)

#### DFD Level 0: Context Diagram
Figure 3.4 illustrates the Level 0 Context Diagram representing data flows across external entities and the centralized HireSphere system.

```
                               Job Vacancy Details
                   +----------------------------------------+
                   |                                        |
                   v                                        |
          +==================+   Application & Resume Data  |   +======================+
          |                  | ---------------------------> |   |                      |
          |    JOB SEEKER    |                              |   |      HIRESPHERE      |
          |                  | <--------------------------- |   |   RECRUITMENT SYSTEM |
          +==================+      Confirmation Email      +== |      (PROCESS 0)     |
                                                            |   +======================+
                                                            |      |              ^
                                                            |      |              |
                   +==================+  Dispatch Trigger   |      | Admin Auth   | Vacancy Data,
                   |     EMAILJS      | <-------------------+      | & Decisions  | App Records,
                   |  EMAIL GATEWAY   |                            v              | Feedback Data
                   +==================+                         +======================+
                            |                                   |                      |
                            v Email Notification                | SYSTEM ADMINISTRATOR |
                     [Applicant Inbox]                          |                      |
                                                                +======================+
```
*Figure 3.4: HireSphere DFD Level 0 — Context Diagram*

---

#### DFD Level 1: Detailed Process Decomposition Diagram
Figure 3.5 decomposes the system into its primary operational processes and associated data stores.

```
       JOB SEEKER                                  SYSTEM ADMINISTRATOR
           |                                                 |
           | Browse Request                                  | Auth Credentials
           v                                                 v
+-----------------------+                         +-----------------------+
|      PROCESS 1.0      |   Read Active Postings  |      PROCESS 5.0      |
|      JOB VACANCY      | <---------------------- |     ADMINISTRATOR     |
|      DISCOVERY        |                         |     AUTHENTICATION    |
+-----------+-----------+                         +-----------+-----------+
            |                                                 | Valid Session
            | Vacancy Details                                 v
            |                             +---------------------------------------+
            v                             |       ADMINISTRATOR DASHBOARD         |
+-----------------------+                 +---+---------------+---------------+---+
|      PROCESS 2.0      |                     |               |               |
|      APPLICATION      | Job CRUD Commands   v               v               v
|       INGESTION       | <-----------+---------------+ +---------------+ +---------------+
+-----------+-----------+             |  PROCESS 1.1  | |  PROCESS 3.0  | |  PROCESS 4.0  |
            |                         |  JOB VACANCY  | |  APPLICANT    | |  SOFT-DELETE  |
            | Write Application Data  |  MANAGEMENT   | |  EVALUATION   | |  & ARCHIVAL   |
            v                         +-------+-------+ +-------+-------+ +-------+-------+
       [( D1: JOBS )]                         |                 |                 |
            ^                                 | Write           | Update Decision | Update/Purge
            |                                 v                 v                 v
            | Read Jobs            +-----------------------------------------------------+
            +--------------------> |                 [( D2: APPLICATIONS )]              |
                                   +--------------------------+--------------------------+
            | Upload File                                     |
            v                                                 | Trigger Notification
+-----------------------+                                     v
|  [( D3: STORAGE )]    |                         +-----------------------+
|   (resume bucket)     |                         |      PROCESS 6.0      |
+-----------------------+                         |     TRANSACTIONAL     |
            ^                                     |     NOTIFICATION      |
            | Ingest Document                     +-----------+-----------+
            |                                                 |
            |                                                 | Dispatch Email
            |                                                 v
       Applicant Resume                                  EMAILJS GATEWAY
                                                              |
                                                              v
                                                       Applicant Inbox
```
*Figure 3.5: HireSphere DFD Level 1 — Process Decomposition Diagram*

#### Process Decomposition Explanations:
*   **Process 1.0 (Job Vacancy Discovery):** Queries data store `D1: JOBS` to display active employment opportunities to public job seekers.
*   **Process 1.1 (Job Vacancy Management):** Handles administrative creation, modification, active toggling, and deletion of vacancies in `D1: JOBS`.
*   **Process 2.0 (Application Ingestion):** Validates user inputs, sends binary files to `D3: STORAGE (resume bucket)`, retrieves public URLs, and writes candidate records to `D2: APPLICATIONS`.
*   **Process 3.0 (Applicant Evaluation):** Allows administrators to inspect candidate profiles, open resume URLs from `D3: STORAGE`, and update status flags (`pending`, `accepted`, `rejected`) in `D2: APPLICATIONS`.
*   **Process 4.0 (Soft-Delete & Archival):** Updates `deleted_at` timestamps in `D2: APPLICATIONS` when an application is moved to the Trash Bin, enabling recovery or permanent database deletion.
*   **Process 5.0 (Administrator Authentication):** Validates administrative credentials, generates session metadata in `sessionStorage`, and guards administrative views.
*   **Process 6.0 (Transactional Notification):** Formats applicant metadata and invokes EmailJS cloud templates to send status emails upon application receipt and evaluation.


---

# CHAPTER 4: IMPLEMENTATION, COST ANALYSIS & PROJECT MANAGEMENT

## 4.1 Development Roadmap (Gantt Schedule)

The development and deployment of HireSphere was structured across a 10-week execution timeline. This timeframe accommodates the four iterative Sprints established in the Scrum methodology, spanning initial problem discovery through final DNS production deployment. 

Table 4.1 outlines the work breakdown structure (WBS), task durations, precedence dependencies, and assigned project responsibilities.

**Table 4.1: HireSphere Project Work Breakdown Structure and Schedule**

| Phase / Sprint | Task Identifier | Task Description | Duration | Start Week | Finish Week | Dependencies | Responsible Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Discovery** | T1.1 | Stakeholder Interviews & Needs Analysis | 1.0 wk | W1 | W1 | None | Business Analyst / Researcher |
| | T1.2 | Product Backlog Inception & User Stories | 0.5 wk | W1 | W2 | T1.1 | Project Manager / Scrum Master |
| | T1.3 | UI/UX Wireframing & Flow Prototyping | 1.0 wk | W2 | W2 | T1.2 | UI/UX Designer |
| **Phase 2: Database** | T2.1 | Supabase Cloud Instance Provisioning | 0.5 wk | W3 | W3 | T1.2 | Database Architect |
| | T2.2 | PostgreSQL Schema Implementation & DDL | 1.0 wk | W3 | W4 | T2.1 | Database Architect |
| | T2.3 | Row-Level Security (RLS) Policy Setup | 0.5 wk | W4 | W4 | T2.2 | Security Lead |
| | T2.4 | Cloud Storage Bucket (`resume`) Setup | 0.5 wk | W4 | W4 | T2.1 | Cloud Systems Engineer |
| **Phase 3: Frontend** | T3.1 | React 18 & Tailwind CSS Project Scaffold | 0.5 wk | W5 | W5 | T1.3 | Frontend Developer |
| | T3.2 | Public Job Listings & Filtering Modules | 1.0 wk | W5 | W6 | T3.1, T2.2 | Frontend Developer |
| | T3.3 | Job Application Modal & File Ingestion UI | 1.0 wk | W6 | W7 | T3.2, T2.4 | Frontend Developer |
| | T3.4 | Admin Login & Session Protection Module | 0.5 wk | W6 | W7 | T3.1 | Full Stack Developer |
| | T3.5 | Admin Vacancy CRUD & Candidate Review | 1.0 wk | W6 | W7 | T3.4, T2.2 | Full Stack Developer |
| | T3.6 | Trash Bin Archiving & Feedback Modules | 0.5 wk | W7 | W7 | T3.5 | Full Stack Developer |
| **Phase 4: Integration** | T4.1 | Supabase Realtime Channel Wiring | 0.5 wk | W8 | W8 | T3.5, T2.2 | Full Stack Developer |
| | T4.2 | EmailJS Notification Gateway Wiring | 0.5 wk | W8 | W8 | T3.3, T3.5 | Full Stack Developer |
| | T4.3 | Automated Unit & Integration Testing | 1.0 wk | W8 | W9 | T4.1, T4.2 | QA Engineer |
| | T4.4 | Cross-Browser Responsive Quality Audit | 0.5 wk | W9 | W9 | T4.3 | QA Engineer |
| | T4.5 | User Acceptance Testing (UAT) with Users | 1.0 wk | W9 | W10 | T4.4 | Lead Researcher / Users |
| **Phase 5: Launch** | T5.1 | Production Build Optimization & Bundling | 0.5 wk | W10 | W10 | T4.5 | DevOps Lead |
| | T5.2 | Cloud Hosting Deployment & DNS Mapping | 0.5 wk | W10 | W10 | T5.1 | DevOps Lead |
| | T5.3 | Stakeholder Handover & Documentation | 0.5 wk | W10 | W10 | T5.2 | Project Manager / Author |

Figure 4.1 illustrates the timeline graphically through a Gantt chart representation.

```
+=============================================================================+
|                      HIRESPHERE 10-WEEK GANTT SCHEDULE                      |
+=============================================================================+

Task Name                       W1   W2   W3   W4   W5   W6   W7   W8   W9  W10
-------------------------------------------------------------------------------
T1.1 Needs Analysis             [====]
T1.2 Product Backlog                 [==]
T1.3 Wireframing                          [====]
T2.1 Supabase Provisioning                     [==]
T2.2 PostgreSQL Schema                             [====]
T2.3 RLS Security Policies                              [==]
T2.4 Storage Bucket Config                              [==]
T3.1 Project Scaffold                                        [==]
T3.2 Public Job Listings                                     [====]
T3.3 Application Modal & Upload                                   [====]
T3.4 Admin Auth & Session                                         [==]
T3.5 Admin Vacancy & Review                                       [====]
T3.6 Trash Bin & Feedback                                              [==]
T4.1 Realtime Channel Wiring                                                [==]
T4.2 EmailJS Gateway Wiring                                                 [==]
T4.3 QA Unit & Integration                                                  [====]
T4.4 Cross-Browser Audit                                                         [==]
T4.5 User Acceptance Testing                                                     [====]
T5.1 Production Optimization                                                          [==]
T5.2 DNS & Hosting Launch                                                             [==]
T5.3 Handover & Documentation                                                         [==]
-------------------------------------------------------------------------------
Sprint Milestones:              M1        M2                  M3             M4   M5
(M1: Backlog Locked | M2: DB Deployed | M3: UI Complete | M4: QA Pass | M5: Live DNS)
```
*Figure 4.1: HireSphere 10-Week Project Gantt Chart*

---

## 4.2 Financial Budget & Cost Breakdown

A critical dimension of HireSphere's dual role as an academic capstone and client-ready software proposal is the financial cost breakdown. By leveraging open-source front-end frameworks and the cloud-native free and scale tiers of modern Backend-as-a-Service providers, HireSphere demonstrates exceptional capital efficiency.

Table 4.2 provides an itemized financial budget detailing design, engineering labor, cloud infrastructure hosting, domain licensing, security certificates, and operational support.

**Table 4.2: HireSphere Financial Budget and Cost Breakdown**

| Expenditure Category | Itemized Description | Basis / Provider | Quantity / Duration | Unit Cost (PHP) | Unit Cost (USD) | Total Amount (PHP) | Total Amount (USD) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Design & Labor** | Requirements Analysis & System Architecture | Academic Capstone Team / Lead Analyst | 60 hours | 350.00 / hr | 6.25 / hr | 21,000.00 | 375.00 |
| | UI/UX Wireframing & Responsive Prototyping | UI/UX Specialist | 40 hours | 350.00 / hr | 6.25 / hr | 14,000.00 | 250.00 |
| | Frontend Engineering (React 18 & Tailwind) | Lead Frontend Engineer | 120 hours | 400.00 / hr | 7.15 / hr | 48,000.00 | 858.00 |
| | Backend Database & Cloud Storage Setup | Database / BaaS Specialist | 60 hours | 450.00 / hr | 8.04 / hr | 27,000.00 | 482.40 |
| | Integration, Testing & QA Validation | QA Test Specialist | 50 hours | 350.00 / hr | 6.25 / hr | 17,500.00 | 312.50 |
| | **Subtotal: Development Labor** | | **330 hours** | | | **127,500.00** | **2,277.90** |
| **2. Cloud & Services** | Managed Database & BaaS (PostgreSQL) | Supabase Free / Pro Tier Allowance | 12 Months | 0.00 (Tier Free) | 0.00 | 0.00 | 0.00 |
| | Cloud Object Storage (Resume Ingestion) | Supabase Storage (1GB Included) | 12 Months | 0.00 (Tier Free) | 0.00 | 0.00 | 0.00 |
| | Transactional Email Dispatch (EmailJS) | EmailJS Starter Tier (200 free/mo) | 12 Months | 0.00 (Starter) | 0.00 | 0.00 | 0.00 |
| | Static Web Hosting & Edge CDN | Cloudflare Pages / Vercel Edge | 12 Months | 0.00 (Tier Free) | 0.00 | 0.00 | 0.00 |
| | Top-Level Custom Domain Name (`.com`/`.ph`)| Domain Registrar (Namecheap / DotPH) | 1 Year | 950.00 / yr | 17.00 / yr | 950.00 | 17.00 |
| | SSL / TLS Certificate (HTTPS Encryption) | Let's Encrypt / Cloudflare Automated SSL | 1 Year | 0.00 (Free SSL) | 0.00 | 0.00 | 0.00 |
| | **Subtotal: Annual Infrastructure** | | **Annual** | | | **950.00** | **17.00** |
| **3. Hardware & Tools** | Workstation Hardware Depreciation | Development Laptops & Testing Mobiles | 10 Weeks | 500.00 / wk | 8.93 / wk | 5,000.00 | 89.30 |
| | Development Tools & IDE Licenses | Visual Studio Code, Git, GitHub Free | 10 Weeks | 0.00 (Open Source)| 0.00 | 0.00 | 0.00 |
| | Broadband Internet Connectivity | 100 Mbps Dedicated Fiber Line | 2.5 Months | 1,899.00 / mo | 33.91 / mo | 4,747.50 | 84.78 |
| | **Subtotal: Tools & Utilities** | | | | | **9,747.50** | **174.08** |
| **4. Maintenance Reserve**| Unscheduled Patching & Technical Support | Contingency Support Pool (5% Labor) | Annual | Lump Sum | Lump Sum | 6,375.00 | 113.84 |
| **PROJECT TOTAL COST**| **Complete Capstone & Production Delivery** | | | | | **144,572.50** | **2,582.82** |

*Note: Currency conversion calculated at prevailing rate of 1 USD = 56.00 PHP. Development labor costs represent academic project valuation benchmarks based on Philippine software industry junior-to-mid developer standards.*

---

## 4.3 Risk Assessment & Mitigation

Deploying web applications that handle public file uploads and sensitive candidate information requires proactive risk management. Table 4.3 details the risk matrix addressing technical dependencies, scope management, cybersecurity threats, and data governance.

**Table 4.3: HireSphere Risk Assessment and Mitigation Matrix**

| Risk Identifier | Risk Category | Risk Description | Probability (1–5) | Impact (1–5) | Severity Score | Proactive Mitigation Strategy & Contingency Action |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **R-01** | Technical Dependency | **Third-Party API Service Outages (Supabase or EmailJS):** Temporary cloud downtime could interrupt public applications or status email delivery. | 2 (Low) | 4 (Major) | **8 (Moderate)** | **Mitigation:** Implement defensive error handling (`try...catch` blocks) across all API calls. When EmailJS fails, the application record still saves to PostgreSQL, and a console warning alerts the administrator so the candidate can be contacted manually. |
| **R-02** | Project Management | **Scope Creep & Schedule Slippage:** Demands for complex secondary features (e.g., automated AI resume parsing, video interviews) could derail the 10-week schedule. | 4 (High) | 3 (Moderate) | **12 (High)** | **Mitigation:** Strict enforcement of the Scope and Delimitations boundary (Table 1.2). Non-essential enhancements are deferred to Phase 2 backlog items to preserve core sprint commitments. |
| **R-03** | Cybersecurity | **Malicious File Uploads (MIME Type Spoofing):** Attackers could attempt to upload executable scripts disguised as resumes to compromise storage or client viewports. | 2 (Low) | 5 (Critical) | **10 (High)** | **Mitigation:** Client-side validation restricts uploads strictly to `application/pdf`, `image/png`, `application/msword`, and `docx` formats up to 10MB. Files are served as raw binary attachments via Supabase Storage URLs rather than executed on the web server. |
| **R-04** | Cybersecurity | **Database Security & RLS Policy Misconfiguration:** Incorrect PostgreSQL permissions could expose unauthenticated candidate personal data. | 2 (Low) | 5 (Critical) | **10 (High)** | **Mitigation:** All PostgreSQL tables have Row-Level Security enabled (`ENABLE ROW LEVEL SECURITY`). Anon users are restricted to INSERT operations on `applications` and `feedback`, and SELECT on active `jobs`. Candidate lists remain restricted to authenticated administrative sessions. |
| **R-05** | Information Security | **Session Hijacking on Unattended Terminals:** Administrators walking away from shared workstations could leave open administrative dashboards. | 3 (Moderate) | 3 (Moderate) | **9 (Moderate)** | **Mitigation:** Administrative session data is stored in `sessionStorage` rather than `localStorage`. A sliding inactivity listener monitors mouse, keyboard, and scroll activity, automatically terminating sessions after prolonged inactivity. |
| **R-06** | Operational | **Accidental Data Deletion by Hiring Managers:** An administrator might inadvertently delete an active candidate application during batch review. | 3 (Moderate) | 3 (Moderate) | **9 (Moderate)** | **Mitigation:** Implemented a soft-delete architecture. Removed applications receive a timestamped `deleted_at` field and move to the Trash Bin, allowing one-click restoration before permanent database purging. |


---

# CHAPTER 5: TESTING, SERVICE LEVEL AGREEMENT & CONCLUSION

## 5.1 Quality Assurance Framework & Test Suite

To verify that HireSphere fulfills its functional and non-functional requirements with high reliability, the development team executed a multi-tiered Quality Assurance (QA) framework. Testing covered four rigorous dimensions: Unit Testing, Responsive UI Cross-Breakpoint Testing, Security & Vulnerability Auditing (OWASP Top 10 / ISO/IEC 25010), and User Acceptance Testing (UAT).

### 5.1.1 Unit Testing & Code Verification
Individual functional components and utility modules were systematically verified using automated and isolated manual testing procedures:
*   **Form Validation Utilities:** Tested input sanitization and regex validation for candidate email addresses (`emailRegex`). Verified that invalid email syntax (e.g., missing `@` symbol, absent top-level domains) successfully halted submission with clear error messages.
*   **File Upload Validation:** Verified file type filtering logic (`handleResumeUpload`). Confirmed that permissible file types (`application/pdf`, `image/png`, `application/msword`, `docx`) were accepted, while unauthorized formats (e.g., `.exe`, `.bat`, `.zip`, `.mp4`) were rejected immediately with a user-facing error message.
*   **Session Management Calculations:** Validated `getSessionTimeRemaining` and `isAdminSessionValid` functions within `adminSessionService.js`. Tested boundary conditions around the 8-hour expiration ceiling and verified that user input events successfully refreshed the sliding expiration timer.
*   **Database Query Formatting:** Confirmed that soft-delete queries properly append the condition `deleted_at IS NULL` to exclude archived records from active applicant views.

### 5.1.2 Responsive UI & Cross-Breakpoint Testing
Because job seekers frequently access recruitment portals via smartphones, the user interface was tested across multiple device form factors and browser rendering engines. Table 5.1 details the responsive design audit results.

**Table 5.1: Responsive UI Cross-Breakpoint Verification Matrix**

| Device Category | Target Viewport | Browsers Verified | Tested UI Components | Audit Observations & Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile (Small)** | 375 x 667 px (iPhone SE) | Mobile Safari, Chrome Mobile | Navbar, Hero Banner, Job Application Modal | Hamburger navigation toggles correctly. Application modal adjusts to full screen with internal vertical scrolling. Form fields stack vertically without horizontal overflow. **[PASS]** |
| **Mobile (Large)** | 414 x 896 px (iPhone XR/11) | Chrome Mobile, Samsung Internet | Job Listings Cards, Footer | Job cards render in single-column flex layouts. Typography scales down smoothly; action buttons maintain a minimum 44px tap target height conforming to mobile accessibility standards. **[PASS]** |
| **Tablet** | 768 x 1024 px (iPad Portrait)| Safari Mobile, Chrome Mobile | Admin Sidebar, Job Grid | Admin sidebar collapses into an accessible slide-over drawer with backdrop-blur overlay. Job cards transition into a clean two-column grid. **[PASS]** |
| **Desktop (Standard)**| 1440 x 900 px (MacBook/PC) | Google Chrome, Mozilla Firefox, MS Edge | Full Admin Interface, Application Info View | Sidebar pins cleanly to the left viewport. Applicant table displays multi-column metadata (Name, Job, Date, Status, Resume button) with no horizontal scroll required. **[PASS]** |
| **Desktop (Ultra-Wide)**| 1920 x 1080 px (FHD Display)| Google Chrome | Complete System Views | Container max-widths (`max-w-5xl`, `max-w-6xl`) prevent unnatural content stretching on large widescreen displays. Background radial gradients render uniformly. **[PASS]** |

---

### 5.1.3 Security Audits: OWASP Top 10 & ISO/IEC 25010 Compliance

#### 1. OWASP Top 10 (2021) Security Evaluation
*   **A01: Broken Access Control:** Protected administrative routes (`/admin-interface`, `/application-info/:unique_id`, `/trash-bin`) are wrapped in `ProtectedAdminRoute` components that check for valid, unexpired sessions in `sessionStorage`. On the database tier, PostgreSQL Row-Level Security (RLS) ensures that public anonymous clients cannot read administrative application lists.
*   **A02: Cryptographic Failures:** All communications between the client, Supabase BaaS, and EmailJS are conducted exclusively over TLS 1.3 encrypted HTTPS channels.
*   **A03: Injection (SQL Injection):** All database operations leverage Supabase PostgREST, which utilizes parameterized queries and Object-Relational Mapping abstractions. User input is never concatenated directly into raw SQL strings, neutralizing SQL injection vectors.
*   **A04: Insecure Design:** The implementation of a soft-delete architecture prevents irreversible accidental data loss. Administrative actions (deletions, logouts) require explicit modal confirmation.
*   **A05: Security Misconfiguration:** Anonymous database access is restricted strictly to permitted operations: INSERT on `applications` and `feedback`, and SELECT on active `jobs`. Unnecessary default endpoints are disabled.

#### 2. ISO/IEC 25010 Software Quality Evaluation
Table 5.2 evaluates HireSphere against the international standards defined in the ISO/IEC 25010 Software Product Quality Model.

**Table 5.2: ISO/IEC 25010 Software Quality Evaluation for HireSphere**

| Quality Characteristic | Sub-Characteristic | Target Metric / Standard | System Implementation in HireSphere | Compliance Evaluation |
| :--- | :--- | :--- | :--- | :---: |
| **Functional Suitability** | Functional Completeness | 100% of defined core user stories implemented. | Supports job vacancy CRUD, direct resume uploads, candidate evaluation, soft-delete archiving, and feedback processing. | **Compliant** |
| | Functional Correctness | Accurate data persistence and email triggering. | Automated verification confirmed all records match database constraints and email notifications reach recipient inboxes. | **Compliant** |
| **Performance Efficiency**| Time Behavior | Page load under 2.0 seconds; query execution < 250ms. | Single Page Application bundle loads in ~1.2s; Supabase PostgREST queries return in 80–180ms. | **Compliant** |
| | Resource Utilization | Client memory footprint < 100MB; optimized bundle size. | Production build size is ~380KB gzipped; memory usage remains stable during long administrative sessions. | **Compliant** |
| **Compatibility** | Co-existence & Interoperability | Standard web standards; REST & WebSocket protocols. | Interoperates seamlessly with standard web browsers, Supabase PostgreSQL, and EmailJS REST APIs. | **Compliant** |
| **Interaction Capability (Usability)** | Learnability & Operability | First-time application completed in under 2 minutes. | Streamlined modal interface requires only Name, Email, and Resume file, verified during user acceptance testing. | **Compliant** |
| | User Error Protection | Input validation preventing corrupted data submission. | Form error alerts highlight missing fields; file upload validation rejects invalid document formats. | **Compliant** |
| **Reliability** | Availability & Fault Tolerance | 99.9% uptime SLA target; graceful degradation on API failure. | Database backed by managed Supabase cloud cluster; application handles API failures gracefully without crashing. | **Compliant** |
| **Security** | Confidentiality & Integrity | Role-based separation and encrypted data storage. | PostgreSQL Row-Level Security policies prevent unauthorized record modification and private data exposure. | **Compliant** |
| **Maintainability** | Modularity & Reusability | Component-driven architecture with separation of concerns. | Modular React component hierarchy separates presentation views, business services, and database clients. | **Compliant** |

---

### 5.1.4 User Acceptance Testing (UAT)
User Acceptance Testing was conducted with a cohort of 10 test participants, comprising 5 community job seekers and 5 administrative/HR personnel. Participants executed structured operational test scenarios simulating genuine hiring cycles. 

Table 5.3 documents the formal UAT test scenarios, execution steps, expected outcomes, actual observations, and pass/fail statuses.

**Table 5.3: HireSphere User Acceptance Testing (UAT) Execution Matrix**

| Test Case ID | Test Scenario Description | Execution Steps | Expected Outcome | Actual Observed Result | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Public Job Vacancy Browsing | 1. Navigate to `/job-listings`.<br>2. Observe rendered job cards. | Active job vacancies display title, company, description, salary, and available slots. | All active job postings retrieved and formatted cleanly across cards. | **PASS** |
| **TC-02** | Validation on Incomplete Submission | 1. Click "Apply Now" on a job.<br>2. Leave Name and Resume empty.<br>3. Click "Submit Application". | Form blocks submission and displays specific validation errors. | Input borders turn red; error prompts require full name and resume attachment. | **PASS** |
| **TC-03** | Valid Application & Resume Upload | 1. Enter valid Full Name & Email.<br>2. Attach a valid 2MB PDF resume.<br>3. Click "Submit Application". | File uploads to cloud storage; record saves to database; success confirmation appears. | Resume uploaded to Supabase Storage; record written to `applications`; confirmation displayed. | **PASS** |
| **TC-04** | Automated Email Notification | 1. Complete TC-03.<br>2. Inspect applicant's Gmail inbox. | Applicant receives automated confirmation email acknowledging receipt. | Transactional email delivered via EmailJS within 10 seconds of submission. | **PASS** |
| **TC-05** | Administrator Login (Valid) | 1. Navigate to `/admin-login`.<br>2. Enter correct admin credentials.<br>3. Click Login. | Administrator authenticated; redirected to `/admin-interface`. | Session saved in `sessionStorage`; redirected immediately to Admin Dashboard. | **PASS** |
| **TC-06** | Administrator Login (Invalid) | 1. Navigate to `/admin-login`.<br>2. Enter incorrect password.<br>3. Click Login. | Login blocked; user remains on login page with error prompt. | Error alert displays "Invalid username or password"; access blocked. | **PASS** |
| **TC-07** | Admin Job Vacancy Creation | 1. Open Admin Job Listings.<br>2. Click "+ Add Job".<br>3. Fill details and save. | New vacancy saved to database and immediately appears on public job board. | Vacancy created in `jobs` table; synced in real time to `/job-listings`. | **PASS** |
| **TC-08** | Candidate Review & Decision Logging | 1. Open User Applications.<br>2. Select candidate to view details.<br>3. Click "Accept Application". | Status updates to "accepted"; decision email dispatched to candidate. | Database record updated; candidate status badge turns blue; email delivered via EmailJS. | **PASS** |
| **TC-09** | Soft-Delete & Trash Recovery | 1. Delete an application in dashboard.<br>2. Navigate to Trash Bin.<br>3. Click "Restore Application". | Application removed from active list; found in Trash Bin; restored successfully. | `deleted_at` timestamp managed correctly; application restored to active queue. | **PASS** |
| **TC-10** | Public Feedback Submission | 1. Navigate to `/contact-info`.<br>2. Fill message and submit.<br>3. Check Admin Feedback Reports. | Feedback saved to database and rendered in administrative report view. | Record persisted to `feedback` table; visible immediately in admin report view. | **PASS** |

#### UAT Summary Metrics:
*   Total Test Cases Executed: **10**
*   Total Passed: **10**
*   Total Failed: **0**
*   **Overall Pass Rate: 100.0%**

---

## 5.2 Post-Launch Warranty & Support Service Level Agreement (SLA)

To guarantee operational stability after production deployment, Table 5.4 outlines the software maintenance terms, severity classifications, guaranteed response times, and resolution targets.

**Table 5.4: Post-Launch Service Level Agreement (SLA) Matrix**

| Severity Level | Severity Definition & Scope | Example Scenarios | Guaranteed Initial Response | Target Resolution Window | Escalation & Action Protocol |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Level 1 (Critical)** | Complete system outage; public cannot view jobs or submit resumes; admin database inaccessible. | Database server unreachable; fatal client script crash preventing all page rendering. | **< 2 Hours** | **< 8 Hours** | Immediate escalation to Lead Developer and Database Architect; restore from latest clean backup if necessary. |
| **Level 2 (Major)** | Core feature degraded for multiple users; workaround unavailable, but core system remains operational. | File upload to Supabase Storage fails; EmailJS notifications blocked due to quota exhaustion. | **< 6 Hours** | **< 24 Hours** | Lead Developer investigates API logs; re-links storage bucket policies or upgrades email tier quota. |
| **Level 3 (Minor)** | Non-critical functionality defect; system remains operational; functional workaround exists. | Feedback report pagination glitch; layout misalignment on specific niche mobile browser. | **< 24 Hours** | **< 72 Hours** | Issue logged into Sprint maintenance backlog; resolved during regular weekly maintenance patch cycle. |
| **Level 4 (Enhancement)**| Cosmetic text adjustment or request for new minor capability. | Label re-wording; minor color palette adjustment; additional vacancy filter option. | **< 48 Hours** | **Next Scheduled Release** | Evaluated for inclusion in subsequent planned software releases. |

### Data Protection & Backup Strategy
1.  **Automated Daily Database Backups:** Supabase managed cloud infrastructure executes automated daily snapshot backups of the PostgreSQL database cluster. In the event of catastrophic data corruption, the database can be restored to any daily snapshot within the retention window.
2.  **Point-In-Time Recovery (PITR):** Transaction logs (Write-Ahead Logs) are maintained continuously, enabling point-in-time rollbacks to minimize data loss to within minutes of an incident.
3.  **Cloud Storage Redundancy:** Uploaded resume files in the `resume` bucket are stored across redundant cloud storage nodes, ensuring high availability and durability against hardware drive degradation.
4.  **Scheduled Dependency Patching:** The development team adheres to a monthly software dependency review. Running `npm audit` identifies and patches third-party package vulnerabilities, ensuring that React, React Router, and supporting libraries remain secure.

---

## 5.3 Conclusion & Handover Checklist

### 5.3.1 Concluding Summary
The HireSphere web-based recruitment and applicant tracking system successfully fulfills all general and specific objectives defined at the project's inception. By replacing fragmented, manual hiring procedures with an integrated, modern web platform, HireSphere eliminates lost applicant documents, closes the communication gap with automated email notifications, and empowers hiring managers with real-time vacancy control.

The system proves that modern web technologies—specifically React 18, Tailwind CSS, Supabase BaaS, and EmailJS—can be combined to deliver an accessible, high-performance recruitment platform without the heavy infrastructure and licensing costs of commercial enterprise applicant tracking systems. The successful execution of User Acceptance Testing with a 100% pass rate demonstrates that HireSphere is production-ready, technically sound, and immediately viable for community recruitment deployment.

### 5.3.2 Phase 2 Future Roadmap
While HireSphere provides a complete, robust recruitment platform, the research team has identified several prospective enhancements for Phase 2 development:
1.  **Automated Keyword Matching & Resume Scoring:** Implement optical character recognition (OCR) and natural language processing (NLP) to scan candidate PDF resumes, calculating compatibility scores against required job qualifications to assist recruiters during high-volume screening.
2.  **Job Seeker Self-Service Portal:** Extend the applicant side to include authenticated candidate profiles, enabling job seekers to view historical submissions, update stored contact information, and track application evaluation progress in real time.
3.  **Interview Calendar Self-Scheduling:** Integrate scheduling APIs (e.g., Google Calendar API or Calendly) to allow recruiters to include interview booking links directly within acceptance email notifications, automating the scheduling of preliminary interviews.
4.  **Progressive Web Application (PWA) Offline Caching:** Configure service workers to support PWA capabilities, allowing job seekers in low-connectivity areas to browse cached job listings offline and queue applications for automatic submission once network connectivity is restored.

### 5.3.3 Final Project Handover Checklist
Table 5.5 documents the final repository assets, infrastructure credentials, configuration tokens, and technical documentation handed over for operational deployment.

**Table 5.5: Final System Handover Delivery Checklist**

| Handover Deliverable Item | Description & Target Location | Verification Status | Received By / Date |
| :--- | :--- | :---: | :--- |
| **Source Code Repository** | Complete React 18 application codebase in structured directories (`/src/components`, `/src/services`, `/src/assets`). | **Verified & Ready** | Lead Project Administrator |
| **Production Environment File (`.env`)** | Configuration tokens containing Supabase Project URL, Public Anon Key, and Service Role Key. | **Verified & Ready** | Lead Project Administrator |
| **Database Migration Scripts** | SQL scripts (`supabase_migration.sql`, `supabase_realtime_setup.sql`) containing all DDL table schemas, indexes, and RLS policies. | **Verified & Ready** | Database Administrator |
| **Cloud Storage Configuration** | Active Supabase Storage bucket (`resume`) with public access and upload policy scripts. | **Verified & Ready** | Cloud Infrastructure Lead |
| **Email Gateway Configuration** | Active EmailJS service parameters (Service ID: `service_7ugsqbs`, Template ID: `template_q55l8yp`, Public Key). | **Verified & Ready** | Communications Administrator |
| **Administrative Credentials** | Default administrative management access credentials (`admin-01-management`). | **Verified & Ready** | System Administrator |
| **Complete Research Documentation** | Academic capstone documentation (Chapters 1 to 5) conforming to institutional standards and CHED CMO 25 Series of 2015. | **Verified & Ready** | Academic Review Panel |

---

# ANNEXES

### Annex A: Project Team Curriculum Vitae & Roles
*(Project Team members' Curriculum Vitae detailing academic backgrounds, technical specializations in Full-Stack Web Development, UI/UX Design, and Database Architecture).*

### Annex B: Compliance with CHED CMO No. 25, Series of 2015
This capstone research project complies with the Commission on Higher Education (CHED) Memorandum Order No. 25, Series of 2015 (*Revised Policies, Standards, and Guidelines for Bachelor of Science in Information Technology*). The system embodies an industry-relevant computing solution developed through a recognized software engineering methodology (Agile Scrum), incorporating structured database design, client-side security measures, quality assurance testing, and formal user acceptance evaluation.
