-- Phase 1B Test Dataset: 50 Sample Candidates with Resume Text
-- This file contains SQL-ready data for testing the screening algorithm

-- Sample Resume 1: Senior Full Stack Developer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'alex.johnson@email.com', '+971 50 123 4567', 'Alex', 'Johnson', 'Dubai, UAE',
  'https://linkedin.com/in/alexjohnson',
  'ALEX JOHNSON
Senior Full Stack Developer | Dubai, UAE
Phone: +971 50 123 4567 | Email: alex.johnson@email.com
LinkedIn: linkedin.com/in/alexjohnson

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 8 years in web development. Expert in JavaScript, React, Node.js, and cloud technologies. Strong leadership background mentoring junior developers. Passionate about innovation and problem-solving in fast-paced startup environments.

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, Java, C++
Frontend: React, Angular, Vue.js, HTML5, CSS3
Backend: Node.js, Express, Django, Spring Boot
Databases: MongoDB, PostgreSQL, MySQL, Firebase
Tools: Docker, Kubernetes, AWS, Azure, Git, CI/CD, Jenkins
Methodologies: Agile, Scrum, TDD, Microservices

PROFESSIONAL EXPERIENCE
Senior Developer at TechCorp Solutions | Dubai | 2021 - Present (3 years)
- Led development of microservices architecture serving 2M+ users
- Mentored team of 5 junior developers
- Implemented CI/CD pipeline reducing deployment time by 60%
- Technologies: Node.js, React, PostgreSQL, Docker, Kubernetes

Full Stack Developer at StartupXYZ | Dubai | 2018 - 2021 (3 years)
- Built complete web platform from scratch using MERN stack
- Optimized database queries improving response time by 40%
- Managed AWS infrastructure and deployment

Software Engineer at WebDev Inc | Dubai | 2015 - 2018 (3 years)
- Developed responsive web applications
- Implemented REST APIs

EDUCATION
Bachelor of Science in Computer Science | University of Dubai | 2015
- GPA: 3.8/4.0
- Relevant Coursework: Data Structures, Algorithms, Database Design

CERTIFICATIONS & ACHIEVEMENTS
- AWS Certified Solutions Architect
- Completed Google Cloud Professional Developer Certification
- Leadership Award 2023

LANGUAGES
English (Fluent), Arabic (Native), French (Basic)',
  'LinkedIn'
);

-- Sample Resume 2: Mid-Level Frontend Developer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'sarah.williams@email.com', '+971 55 234 5678', 'Sarah', 'Williams', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/sarahwilliams',
  'SARAH WILLIAMS
Frontend Developer | Abu Dhabi, UAE
Email: sarah.williams@email.com | Phone: +971 55 234 5678

PROFESSIONAL SUMMARY
Dedicated Frontend Developer with 4 years of experience building responsive web applications. Expertise in React and Vue.js. Strong problem-solving skills and team collaboration abilities.

TECHNICAL SKILLS
JavaScript, TypeScript, React, Vue.js, CSS3, HTML5, RESTful APIs, Webpack, Git

WORK EXPERIENCE
Frontend Developer at DesignStudio | Abu Dhabi | 2021 - Present (2 years)
- Developed dynamic user interfaces for 15+ client projects
- Improved page load time by 35%

Junior Frontend Developer at WebAgency | Abu Dhabi | 2019 - 2021 (2 years)
- Built responsive websites using React

EDUCATION
Diploma in Web Development | Tech Academy | 2019

SKILLS SUMMARY
- React expert with 4 years experience
- Problem-solving and teamwork orientation
- Fast learner and creative thinker',
  'Job Board'
);

-- Sample Resume 3: Backend Engineer - Entry Level
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'mohammed.ahmed@email.com', '+971 50 456 7890', 'Mohammed', 'Ahmed', 'Sharjah, UAE',
  'https://linkedin.com/in/mohammedahmed',
  'MOHAMMED AHMED
Backend Developer | Sharjah, UAE
Phone: +971 50 456 7890 | Email: mohammed.ahmed@email.com

SUMMARY
Recent graduate with strong passion for backend development and API design. Proficient in Python and Node.js. Seeking opportunity to contribute to innovative projects.

TECHNICAL SKILLS
Python, Node.js, Express, MongoDB, MySQL, REST APIs, Git, Linux

EDUCATION
Bachelor of Engineering (Computer Science) | Ajman University | 2023
- Thesis: Building Scalable Microservices Architecture
- GPA: 3.5/4.0

PROJECTS
Personal Portfolio API | 2023
- Built REST API using Node.js and MongoDB
- Implemented user authentication

Data Analytics Tool | 2022
- Created data processing application using Python
- Processed 50K+ records

LANGUAGES
Arabic (Native), English (Fluent)',
  'University'
);

-- Sample Resume 4: UX/UI Designer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'fatima.design@email.com', '+971 55 567 8901', 'Fatima', 'Al-Mansouri', 'Dubai, UAE',
  'https://linkedin.com/in/fatimadesign',
  'FATIMA AL-MANSOURI
UX/UI Designer | Dubai, UAE
Phone: +971 55 567 8901 | Email: fatima.design@email.com
Portfolio: fatima-design.com

PROFESSIONAL SUMMARY
Creative UX/UI Designer with 5 years of experience designing user-centered digital products. Expertise in user research, wireframing, prototyping, and visual design.

KEY SKILLS
Figma, Adobe XD, Sketch, User Research, Wireframing, Prototyping, UI Design, Web Design, Mobile Design

EXPERIENCE
Senior Product Designer at InnovateTech | Dubai | 2021 - Present (2 years)
- Led design of mobile app with 500K+ downloads
- Conducted user research with 200+ users

Designer at DesignHouse | Dubai | 2019 - 2021 (2 years)
- Designed websites and mobile interfaces

EDUCATION
Diploma in Graphic Design | ADU | 2018',
  'LinkedIn'
);

-- Sample Resume 5: DevOps Engineer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'khaled.devops@email.com', '+971 50 678 9012', 'Khaled', 'Hassan', 'Dubai, UAE',
  'https://linkedin.com/in/khaleddevops',
  'KHALED HASSAN
DevOps Engineer | Dubai, UAE
Phone: +971 50 678 9012 | Email: khaled.devops@email.com

SUMMARY
Experienced DevOps Engineer with 6 years managing cloud infrastructure and implementing CI/CD pipelines. Expertise in Docker, Kubernetes, AWS, and Infrastructure as Code.

TECHNICAL SKILLS
Docker, Kubernetes, AWS, Azure, CI/CD (Jenkins, GitLab), Terraform, Infrastructure as Code, Linux, Python, Bash, Ansible

PROFESSIONAL EXPERIENCE
Senior DevOps Engineer at CloudSolutions | Dubai | 2020 - Present (3 years)
- Managed infrastructure for 50+ applications
- Reduced deployment time from 4 hours to 15 minutes
- Implemented monitoring and logging solutions

DevOps Engineer at TechCorp | Dubai | 2018 - 2020 (2 years)
- Set up Kubernetes clusters
- Automated deployment processes

Junior DevOps Engineer at WebHost | Dubai | 2017 - 2018 (1 year)
- Learned Docker and basic AWS

CERTIFICATIONS
- AWS Certified Solutions Architect
- Kubernetes Application Developer (CKAD)

EDUCATION
Diploma in Network Administration | 2016',
  'LinkedIn'
);

-- Sample Resume 6: Data Scientist
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'amira.data@email.com', '+971 55 789 0123', 'Amira', 'Ali', 'Dubai, UAE',
  'https://linkedin.com/in/amiradata',
  'AMIRA ALI
Data Scientist | Dubai, UAE
Phone: +971 55 789 0123 | Email: amira.data@email.com

PROFESSIONAL SUMMARY
Data Scientist with 4 years of experience in machine learning and data analysis. Proficient in Python, SQL, and statistical analysis. Strong track record of delivering data-driven insights.

TECHNICAL SKILLS
Python (NumPy, Pandas, Scikit-learn), R, TensorFlow, PyTorch, SQL, Machine Learning, Statistical Analysis, Data Visualization (Matplotlib, Tableau), Jupyter Notebooks

EXPERIENCE
Data Scientist at InsightCorp | Dubai | 2021 - Present (2 years)
- Built ML models for customer churn prediction
- Improved model accuracy to 94%
- Led team of 3 analysts

Junior Data Scientist at DataAnalytics | Dubai | 2019 - 2021 (2 years)
- Performed statistical analysis on large datasets
- Created dashboards for business insights

EDUCATION
Master of Science in Data Science | AUS | 2019
Bachelor of Science in Mathematics | University of Dubai | 2017

PUBLICATIONS & AWARDS
- Published paper on ML algorithms in tech journal 2022
- Data Science Excellence Award 2023',
  'LinkedIn'
);

-- Sample Resume 7: QA Engineer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'noor.qa@email.com', '+971 50 890 1234', 'Noor', 'Rashid', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/noorqa',
  'NOOR RASHID
QA Engineer | Abu Dhabi, UAE
Phone: +971 50 890 1234 | Email: noor.qa@email.com

SUMMARY
QA Automation Engineer with 5 years testing experience. Specialized in automated testing, test planning, and quality assurance processes. Proven ability to improve product quality and reduce bugs.

TECHNICAL SKILLS
Selenium, JUnit, TestNG, Python, Java, API Testing, Manual Testing, Agile/Scrum, JIRA, SQL, Linux

PROFESSIONAL EXPERIENCE
QA Lead at SoftwareCorp | Abu Dhabi | 2021 - Present (2 years)
- Led QA team for 5+ products
- Implemented automated testing framework
- Reduced bug escape rate by 40%

QA Automation Engineer at TestTech | Abu Dhabi | 2019 - 2021 (2 years)
- Created automation test scripts using Selenium
- Executed 100+ test cases per cycle

Manual QA at StartupApp | Abu Dhabi | 2017 - 2019 (2 years)
- Performed functional and regression testing
- Reported and tracked bugs

EDUCATION
Diploma in Software Testing | 2017
ISTQB Certified Tester - Foundation Level

ACHIEVEMENTS
- Team Quality Award 2022
- Zero-defect release 2023',
  'LinkedIn'
);

-- Sample Resume 8: Product Manager (Non-Technical)
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'layla.pm@email.com', '+971 55 901 2345', 'Layla', 'Ibrahim', 'Dubai, UAE',
  'https://linkedin.com/in/laylapm',
  'LAYLA IBRAHIM
Product Manager | Dubai, UAE
Phone: +971 55 901 2345 | Email: layla.pm@email.com

PROFESSIONAL SUMMARY
Results-driven Product Manager with 7 years experience in digital products. Expert in product strategy, roadmapping, and cross-functional leadership. Strong analytical and communication skills.

CORE COMPETENCIES
Product Strategy, Roadmapping, Market Analysis, Stakeholder Management, Agile Methodology, User Research, Data Analysis, Leadership

PROFESSIONAL EXPERIENCE
Senior Product Manager at InnovateApp | Dubai | 2021 - Present (2 years)
- Managed portfolio of 3 products with $5M revenue
- Increased user engagement by 65%
- Led cross-functional teams of 20+ people

Product Manager at DigitalVentures | Dubai | 2018 - 2021 (3 years)
- Launched 2 successful products
- Grew user base from 0 to 500K

Associate Product Manager at TechStartup | Dubai | 2015 - 2018 (3 years)
- Supported product launches
- Conducted market research

EDUCATION
MBA in Business Administration | University of Dubai | 2018
Bachelor of Commerce | University of Dubai | 2015

LANGUAGES
Arabic (Native), English (Fluent), German (Basic)',
  'LinkedIn'
);

-- Sample Resume 9: Experienced Recruiter
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'omar.recruiter@email.com', '+971 50 012 3456', 'Omar', 'Al-Fahidi', 'Dubai, UAE',
  'https://linkedin.com/in/omarrecruiter',
  'OMAR AL-FAHIDI
Recruitment Manager | Dubai, UAE
Phone: +971 50 012 3456 | Email: omar.recruiter@email.com

PROFESSIONAL SUMMARY
Experienced Recruitment Manager with 9 years building high-performing teams. Expertise in tech talent acquisition, team building, and HR strategy. Proven track record of recruiting 500+ professionals.

KEY SKILLS
Talent Acquisition, Team Building, HR Strategy, Candidate Screening, Interview Conduct, Negotiation, LinkedIn Recruiting, HRIS Systems, Employer Branding, Leadership

PROFESSIONAL EXPERIENCE
Recruitment Manager at TechTalent | Dubai | 2020 - Present (3 years)
- Managed recruitment for 10+ tech companies
- Filled 100+ positions with 90% retention rate
- Built recruitment processes and training programs

Senior Recruiter at StaffingPro | Dubai | 2017 - 2020 (3 years)
- Sourced and screened 500+ candidates
- Achieved 85% placement success rate

Recruiter at HRSolutions | Dubai | 2014 - 2017 (3 years)
- Conducted interviews and assessments
- Used LinkedIn and job boards for sourcing

EDUCATION
Diploma in Human Resources | 2014
Certified Recruiter - Professional Certification | 2018',
  'LinkedIn'
);

-- Sample Resume 10: Business Analyst (Non-Technical)
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'rania.ba@email.com', '+971 55 123 4567', 'Rania', 'Hassan', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/raniaba',
  'RANIA HASSAN
Business Analyst | Abu Dhabi, UAE
Phone: +971 55 123 4567 | Email: rania.ba@email.com

SUMMARY
Business Analyst with 6 years of experience translating business needs into technical requirements. Strong analytical and documentation skills. Expertise in process improvement and requirements gathering.

CORE COMPETENCIES
Requirements Analysis, Process Improvement, Business Modeling, Stakeholder Management, Data Analysis, Documentation, Agile, JIRA, SQL Basics, Reporting

PROFESSIONAL EXPERIENCE
Senior Business Analyst at ConsultingGroup | Abu Dhabi | 2021 - Present (2 years)
- Analyzed business processes for 5 enterprise clients
- Improved efficiency by 30%

Business Analyst at TechSolutions | Abu Dhabi | 2018 - 2021 (3 years)
- Gathered requirements for software projects
- Created detailed specifications and test cases

Junior Analyst at InfoSystems | Abu Dhabi | 2016 - 2018 (2 years)
- Documented business processes
- Supported project implementation

EDUCATION
Bachelor of Business Administration | AUS | 2016
CBAP (Certified Business Analyst Professional) | 2019',
  'LinkedIn'
);

-- Bulk insert remaining 40 sample candidates
-- Sample Resume 11: Database Administrator
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'rashid.dba@email.com', '+971 50 234 5678', 'Rashid', 'Al-Mazrouei', 'Dubai, UAE',
  'https://linkedin.com/in/rashiddba',
  'RASHID AL-MAZROUEI
Database Administrator | Dubai, UAE
SUMMARY: DBA with 7 years managing enterprise databases. Expert in PostgreSQL, MySQL, and performance tuning.
SKILLS: PostgreSQL, MySQL, Oracle, MongoDB, Backup & Recovery, Performance Tuning, SQL, Linux
EXPERIENCE: Senior DBA at DataServices (2020-Present), DBA at TechCorp (2017-2020), Junior DBA at InfoHost (2016-2017)
EDUCATION: Bachelor in IT, Ajman University 2016',
  'LinkedIn'
);

-- Sample Resume 12: Mobile Developer (iOS)
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'amira.ios@email.com', '+971 55 345 6789', 'Amira', 'Al-Mansoori', 'Dubai, UAE',
  'https://linkedin.com/in/amirawiosdev',
  'AMIRA AL-MANSOORI
iOS Developer | Dubai, UAE
SUMMARY: iOS developer with 4 years building apps. Expertise in Swift, Objective-C, and iOS frameworks.
SKILLS: Swift, Objective-C, iOS SDK, Xcode, CocoaPods, REST APIs, Git, Agile
EXPERIENCE: Senior iOS Developer at AppStudio (2021-Present), iOS Developer at MobileFirst (2019-2021), Junior Developer at AppWorks (2017-2019)
EDUCATION: Bachelor in Computer Science, University of Dubai 2017',
  'LinkedIn'
);

-- Sample Resume 13: Android Developer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'hamza.android@email.com', '+971 50 456 7890', 'Hamza', 'Hassan', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/hamzaandroid',
  'HAMZA HASSAN
Android Developer | Abu Dhabi, UAE
SUMMARY: Android developer with 5 years experience. Expertise in Kotlin, Java, and Android Studio. Published 3 successful apps with 200K+ downloads.
SKILLS: Kotlin, Java, Android SDK, Retrofit, Room Database, Firebase, Google Play Store
EXPERIENCE: Senior Android Developer at MobileApp Co (2021-Present), Android Developer at StartupApp (2018-2021)
EDUCATION: Diploma in Mobile App Development 2018',
  'LinkedIn'
);

-- Sample Resume 14: Cloud Architect
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'ali.cloud@email.com', '+971 55 567 8901', 'Ali', 'Al-Kaabi', 'Dubai, UAE',
  'https://linkedin.com/in/alicloud',
  'ALI AL-KAABI
Cloud Architect | Dubai, UAE
SUMMARY: Cloud Architect with 8 years designing scalable cloud solutions. Expert in AWS, Azure, and multi-cloud strategies.
SKILLS: AWS (EC2, S3, RDS, Lambda), Azure, Google Cloud, Terraform, CloudFormation, Architecture Design, Security
EXPERIENCE: Senior Cloud Architect at CloudCorp (2020-Present), Cloud Architect at TechInnovate (2017-2020)
CERTIFICATIONS: AWS Solutions Architect Professional, Azure Solutions Architect Expert
EDUCATION: Master in Computer Science, AUS 2016',
  'LinkedIn'
);

-- Sample Resume 15: Security Engineer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'fatima.security@email.com', '+971 50 678 9012', 'Fatima', 'Al-Neyadi', 'Dubai, UAE',
  'https://linkedin.com/in/fatimasecurity',
  'FATIMA AL-NEYADI
Information Security Engineer | Dubai, UAE
SUMMARY: Security Engineer with 6 years protecting enterprise systems. Expertise in vulnerability assessment, penetration testing, and security architecture.
SKILLS: Penetration Testing, Vulnerability Assessment, Security Architecture, OWASP, Network Security, Encryption, Firewalls, SIEM
CERTIFICATIONS: CEH (Certified Ethical Hacker), OSCP (Offensive Security Certified Professional)
EXPERIENCE: Senior Security Engineer at SecurityFirst (2019-Present), Security Analyst at TechSecure (2017-2019)
EDUCATION: Bachelor in Cybersecurity, Ajman University 2017',
  'LinkedIn'
);

-- Sample Resume 16: Solution Architect
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'hassan.architect@email.com', '+971 55 789 0123', 'Hassan', 'Al-Mansouri', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/hassanarchitect',
  'HASSAN AL-MANSOURI
Solutions Architect | Abu Dhabi, UAE
SUMMARY: Solutions Architect with 10 years designing enterprise solutions. Expert in system architecture, integration, and digital transformation.
SKILLS: Enterprise Architecture, Microservices, Integration Patterns, Requirements Gathering, Agile, AWS, Docker, Kubernetes
EXPERIENCE: Principal Architect at EnterpriseSoft (2020-Present), Solutions Architect at TechConsulting (2016-2020)
EDUCATION: Master in Software Engineering, AUS 2014
CERTIFICATIONS: TOGAF 9, AWS Solutions Architect Professional',
  'LinkedIn'
);

-- Sample Resume 17: Technical Writer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'nada.writer@email.com', '+971 50 890 1234', 'Nada', 'Ibrahim', 'Dubai, UAE',
  'https://linkedin.com/in/nadawriter',
  'NADA IBRAHIM
Technical Writer | Dubai, UAE
SUMMARY: Technical Writer with 5 years documenting complex software systems. Expertise in API documentation, user guides, and technical content.
SKILLS: Technical Writing, API Documentation, User Guide Creation, Markdown, MadCap Flare, DITA, Content Management, Agile
EXPERIENCE: Senior Technical Writer at SoftDocs (2020-Present), Technical Writer at TechContent (2017-2020)
EDUCATION: Bachelor in English Literature, University of Dubai 2016',
  'LinkedIn'
);

-- Sample Resume 18: Scrum Master
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'karim.scrum@email.com', '+971 55 901 2345', 'Karim', 'Al-Falahi', 'Dubai, UAE',
  'https://linkedin.com/in/karimscrum',
  'KARIM AL-FALAHI
Scrum Master | Dubai, UAE
SUMMARY: Certified Scrum Master with 6 years facilitating Agile teams. Expertise in team coaching, removing impediments, and process improvement.
SKILLS: Scrum, Kanban, Agile Transformation, Team Coaching, Conflict Resolution, Jira, Sprint Planning, Retrospectives
CERTIFICATIONS: Certified Scrum Master (CSM), Professional Scrum Master (PSM II)
EXPERIENCE: Senior Scrum Master at AgileCorp (2019-Present), Scrum Master at StartupTeam (2017-2019)
EDUCATION: Bachelor in Computer Science, Ajman University 2016',
  'LinkedIn'
);

-- Sample Resume 19: Graphic Designer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'layla.design@email.com', '+971 50 012 3456', 'Layla', 'Al-Kaabi', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/layladesign',
  'LAYLA AL-KAABI
Graphic Designer | Abu Dhabi, UAE
SUMMARY: Creative Graphic Designer with 6 years design experience. Expertise in brand identity, visual design, and digital marketing materials.
SKILLS: Adobe Creative Suite, Figma, Branding, Logo Design, Print Design, Digital Design, Web Design, Color Theory
EXPERIENCE: Senior Designer at CreativeStudio (2020-Present), Designer at DesignHouse (2017-2020)
EDUCATION: Diploma in Graphic Design, Abu Dhabi Design School 2016
PORTFOLIO: layla-design-portfolio.com',
  'LinkedIn'
);

-- Sample Resume 20: Network Administrator
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'salem.network@email.com', '+971 55 123 4567', 'Salem', 'Al-Suwaidi', 'Dubai, UAE',
  'https://linkedin.com/in/salemnetwork',
  'SALEM AL-SUWAIDI
Network Administrator | Dubai, UAE
SUMMARY: Network Administrator with 7 years managing enterprise networks. Expertise in Cisco systems, network security, and troubleshooting.
SKILLS: Cisco IOS, Network Design, Security, Firewalls, VPN, Load Balancing, Monitoring, Linux, Windows Server
CERTIFICATIONS: CCNA (Cisco Certified Network Associate)
EXPERIENCE: Senior Network Admin at NetworkCorp (2019-Present), Network Admin at TechServices (2016-2019)
EDUCATION: Diploma in Network Administration 2015',
  'LinkedIn'
);

-- Sample Resume 21: Machine Learning Engineer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'zahra.ml@email.com', '+971 50 234 5678', 'Zahra', 'Al-Hallawi', 'Dubai, UAE',
  'https://linkedin.com/in/zahraml',
  'ZAHRA AL-HALLAWI
Machine Learning Engineer | Dubai, UAE
SUMMARY: ML Engineer with 5 years building ML systems. Expertise in deep learning, computer vision, and NLP.
SKILLS: Python, TensorFlow, PyTorch, Scikit-learn, Computer Vision, NLP, Deep Learning, Data Engineering
EXPERIENCE: Senior ML Engineer at AITech (2020-Present), ML Engineer at DataLabs (2017-2020)
EDUCATION: Master in Machine Learning, AUS 2017
PUBLICATIONS: 2 papers on deep learning in top-tier journals',
  'LinkedIn'
);

-- Sample Resume 22: IT Support Specialist
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'mahmoud.support@email.com', '+971 55 345 6789', 'Mahmoud', 'Hassan', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/mahmoudsupport',
  'MAHMOUD HASSAN
IT Support Specialist | Abu Dhabi, UAE
SUMMARY: IT Support Specialist with 4 years providing technical support to enterprise users. Expertise in troubleshooting hardware, software, and networking issues.
SKILLS: Windows & Linux, Networking, Troubleshooting, Help Desk Tools, Hardware Support, User Training
CERTIFICATIONS: CompTIA A+, CompTIA Network+
EXPERIENCE: IT Support Lead at TechSupport (2019-Present), IT Support Technician at HelpDesk (2017-2019)
EDUCATION: Diploma in IT 2017',
  'LinkedIn'
);

-- Sample Resume 23: Solutions Engineer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'dina.solutions@email.com', '+971 50 456 7890', 'Dina', 'Al-Mazrouei', 'Dubai, UAE',
  'https://linkedin.com/in/dinasolutions',
  'DINA AL-MAZROUEI
Solutions Engineer | Dubai, UAE
SUMMARY: Solutions Engineer with 6 years translating customer needs into technical solutions. Expertise in solution design, technical sales, and customer implementation.
SKILLS: Solution Design, Technical Sales, Customer Management, Enterprise Systems, Cloud Solutions, Problem-Solving, Presentation
EXPERIENCE: Senior Solutions Engineer at CloudSolutions (2020-Present), Solutions Engineer at TechVendor (2017-2020)
EDUCATION: Bachelor in Computer Science, Ajman University 2016',
  'LinkedIn'
);

-- Sample Resume 24: Systems Administrator
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'jamal.sysadmin@email.com', '+971 55 567 8901', 'Jamal', 'Al-Mansouri', 'Dubai, UAE',
  'https://linkedin.com/in/jamalsysadmin',
  'JAMAL AL-MANSOURI
Systems Administrator | Dubai, UAE
SUMMARY: Systems Administrator with 8 years managing enterprise IT infrastructure. Expertise in Windows/Linux servers, virtualization, and disaster recovery.
SKILLS: Windows Server, Linux, VMware, Hyper-V, Active Directory, Backup & Recovery, Monitoring, Security Hardening
CERTIFICATIONS: Microsoft Certified Systems Administrator
EXPERIENCE: Senior Systems Admin at EnterpriseTech (2019-Present), Systems Admin at CoreIT (2016-2019)
EDUCATION: Bachelor in IT, Ajman University 2015',
  'LinkedIn'
);

-- Sample Resume 25: API Developer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'leila.api@email.com', '+971 50 678 9012', 'Leila', 'Hassan', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/leilaapi',
  'LEILA HASSAN
API Developer | Abu Dhabi, UAE
SUMMARY: API Developer with 5 years designing and building RESTful and GraphQL APIs. Expertise in scalability, security, and documentation.
SKILLS: Node.js, Python, REST APIs, GraphQL, API Design, Database Design, Authentication/Authorization, API Testing
EXPERIENCE: Senior API Developer at APIFirst (2020-Present), API Developer at TechServices (2017-2020)
EDUCATION: Bachelor in Computer Science, University of Dubai 2016',
  'LinkedIn'
);

-- Sample Resume 26: Game Developer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'malik.game@email.com', '+971 55 789 0123', 'Malik', 'Al-Marri', 'Dubai, UAE',
  'https://linkedin.com/in/malikgame',
  'MALIK AL-MARRI
Game Developer | Dubai, UAE
SUMMARY: Game Developer with 6 years creating interactive games. Expertise in Unity, C#, and game mechanics.
SKILLS: Unity, Unreal Engine, C#, C++, Game Design, Physics Engine, Networking, Mobile Games
EXPERIENCE: Senior Game Developer at GameStudio (2019-Present), Game Developer at IndieGames (2016-2019)
EDUCATION: Bachelor in Game Development, AUS 2016
PUBLISHED GAMES: 3 mobile games with 1M+ downloads',
  'LinkedIn'
);

-- Sample Resume 27: Embedded Systems Engineer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'waleed.embedded@email.com', '+971 50 890 1234', 'Waleed', 'Al-Mansoori', 'Dubai, UAE',
  'https://linkedin.com/in/waleedembedded',
  'WALEED AL-MANSOORI
Embedded Systems Engineer | Dubai, UAE
SUMMARY: Embedded Systems Engineer with 7 years designing firmware and hardware systems. Expertise in microcontrollers, RTOS, and device drivers.
SKILLS: C, C++, ARM, RTOS, Microcontrollers, IoT, Hardware Design, PCB Design, Debugging Tools
CERTIFICATIONS: Certified Embedded Developer
EXPERIENCE: Senior Embedded Engineer at HardwareCorp (2019-Present), Embedded Engineer at Electronics (2016-2019)
EDUCATION: Bachelor in Electronics Engineering, Ajman University 2015',
  'LinkedIn'
);

-- Sample Resume 28: Compliance Officer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'sara.compliance@email.com', '+971 55 901 2345', 'Sara', 'Ibrahim', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/saracompliance',
  'SARA IBRAHIM
Compliance Officer | Abu Dhabi, UAE
SUMMARY: Compliance Officer with 8 years ensuring regulatory compliance. Expertise in ISO standards, GDPR, and risk management.
SKILLS: ISO Standards, GDPR, Risk Management, Audit, Documentation, Regulatory Knowledge, Process Development
CERTIFICATIONS: CPCO (Certified Compliance Professional)
EXPERIENCE: Senior Compliance Officer at FinanceCore (2020-Present), Compliance Officer at RiskManagement (2016-2020)
EDUCATION: Bachelor in Business Law, AUS 2014',
  'LinkedIn'
);

-- Sample Resume 29: Release Manager
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'maya.release@email.com', '+971 50 012 3456', 'Maya', 'Al-Kaabi', 'Dubai, UAE',
  'https://linkedin.com/in/mayarelease',
  'MAYA AL-KAABI
Release Manager | Dubai, UAE
SUMMARY: Release Manager with 6 years coordinating software releases. Expertise in deployment planning, risk management, and cross-team coordination.
SKILLS: Release Planning, Deployment Management, Change Management, Risk Assessment, Documentation, JIRA, Jenkins
EXPERIENCE: Senior Release Manager at SoftwareCorp (2020-Present), Release Manager at TechServices (2017-2020)
EDUCATION: Bachelor in Computer Science, University of Dubai 2016',
  'LinkedIn'
);

-- Sample Resume 30: CRM Administrator
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'hana.crm@email.com', '+971 55 123 4567', 'Hana', 'Al-Neyadi', 'Dubai, UAE',
  'https://linkedin.com/in/hanacrm',
  'HANA AL-NEYADI
CRM Administrator | Dubai, UAE
SUMMARY: CRM Administrator with 5 years managing Salesforce systems. Expertise in configuration, customization, and user support.
SKILLS: Salesforce, APEX, Visualforce, Data Management, System Configuration, User Training, Reporting
CERTIFICATIONS: Salesforce Certified Administrator
EXPERIENCE: Senior CRM Admin at SalesForce Solutions (2020-Present), CRM Admin at CRM Services (2017-2020)
EDUCATION: Diploma in CRM Administration 2017',
  'LinkedIn'
);

-- Continue with more diverse candidates to reach 50...
-- Sample Resume 31: Business Intelligence Developer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'rashida.bi@email.com', '+971 50 234 5678', 'Rashida', 'Hassan', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/rashidabi',
  'RASHIDA HASSAN
Business Intelligence Developer | Abu Dhabi, UAE
SUMMARY: BI Developer with 6 years building data warehouses and BI solutions. Expertise in ETL, data modeling, and analytics.
SKILLS: Tableau, Power BI, SQL Server, ETL, Data Modeling, Pentaho, Database Design, Analytics
EXPERIENCE: Senior BI Developer at DataAnalytics (2020-Present), BI Developer at InsightCorp (2017-2020)
EDUCATION: Master in Business Analytics, AUS 2017',
  'LinkedIn'
);

-- Sample Resume 32: Infrastructure Engineer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'amr.infra@email.com', '+971 55 345 6789', 'Amr', 'Al-Suwaidi', 'Dubai, UAE',
  'https://linkedin.com/in/amrinfra',
  'AMR AL-SUWAIDI
Infrastructure Engineer | Dubai, UAE
SUMMARY: Infrastructure Engineer with 7 years building enterprise infrastructure. Expertise in cloud, on-premise, and hybrid environments.
SKILLS: AWS, Azure, Terraform, Ansible, Linux, Windows Server, Networking, Virtualization, Monitoring
CERTIFICATIONS: AWS Solutions Architect Associate
EXPERIENCE: Senior Infrastructure Engineer at CloudTech (2020-Present), Infrastructure Engineer at TechServices (2017-2020)
EDUCATION: Bachelor in IT, Ajman University 2016',
  'LinkedIn'
);

-- Sample Resume 33: Technical Project Manager
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'elham.pm@email.com', '+971 50 456 7890', 'Elham', 'Ibrahim', 'Dubai, UAE',
  'https://linkedin.com/in/elhampm',
  'ELHAM IBRAHIM
Technical Project Manager | Dubai, UAE
SUMMARY: Technical PM with 8 years managing complex IT projects. Expertise in Agile, Waterfall, and hybrid methodologies.
SKILLS: Project Management, Agile, Scrum, Risk Management, Budget Control, Team Leadership, Stakeholder Management
CERTIFICATIONS: PMP (Project Management Professional), Scrum Master
EXPERIENCE: Senior Project Manager at EnterpriseSolutions (2020-Present), Project Manager at TechConsulting (2016-2020)
EDUCATION: Master in Project Management, AUS 2015',
  'LinkedIn'
);

-- Sample Resume 34: UX Researcher
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'yara.research@email.com', '+971 55 567 8901', 'Yara', 'Al-Mansouri', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/yararesearch',
  'YARA AL-MANSOURI
UX Researcher | Abu Dhabi, UAE
SUMMARY: UX Researcher with 5 years conducting user research studies. Expertise in qualitative and quantitative research methods.
SKILLS: User Research, Interviewing, Surveys, Usability Testing, Data Analysis, User Personas, Journey Mapping
EXPERIENCE: Senior UX Researcher at DesignCorp (2020-Present), UX Researcher at UserCentric (2017-2020)
EDUCATION: Master in Human-Computer Interaction, AUS 2017',
  'LinkedIn'
);

-- Sample Resume 35: Content Manager
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'lina.content@email.com', '+971 50 678 9012', 'Lina', 'Hassan', 'Dubai, UAE',
  'https://linkedin.com/in/linacontent',
  'LINA HASSAN
Content Manager | Dubai, UAE
SUMMARY: Content Manager with 6 years developing content strategies. Expertise in digital content, SEO, and analytics.
SKILLS: Content Strategy, SEO, Analytics, WordPress, CMS, Copywriting, Social Media, Performance Metrics
EXPERIENCE: Senior Content Manager at MediaCorp (2020-Present), Content Manager at DigitalMarketing (2017-2020)
EDUCATION: Bachelor in Communications, University of Dubai 2016',
  'LinkedIn'
);

-- Sample Resume 36: Penetration Tester
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'zain.pentest@email.com', '+971 55 789 0123', 'Zain', 'Al-Mansoori', 'Dubai, UAE',
  'https://linkedin.com/in/zainpentest',
  'ZAIN AL-MANSOORI
Penetration Tester | Dubai, UAE
SUMMARY: Pen Tester with 6 years identifying security vulnerabilities. Expertise in offensive security and vulnerability management.
SKILLS: Penetration Testing, Vulnerability Assessment, Exploit Development, Networking, Metasploit, Burp Suite
CERTIFICATIONS: OSCP, CEH, GWAPT
EXPERIENCE: Senior Pen Tester at CyberSecurity (2020-Present), Pen Tester at SecurityLabs (2017-2020)
EDUCATION: Bachelor in Cybersecurity, Ajman University 2016',
  'LinkedIn'
);

-- Sample Resume 37: Knowledge Manager
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'fatou.km@email.com', '+971 50 890 1234', 'Fatou', 'Al-Kaabi', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/fatouknowledge',
  'FATOU AL-KAABI
Knowledge Manager | Abu Dhabi, UAE
SUMMARY: Knowledge Manager with 7 years implementing knowledge management systems. Expertise in organizational learning and documentation.
SKILLS: Knowledge Management, Documentation, Training, Wiki/Intranet Management, Process Documentation, Learning Platforms
EXPERIENCE: Senior Knowledge Manager at EnterpriseLearning (2020-Present), Knowledge Manager at OrgDevelopment (2016-2020)
EDUCATION: Master in Organizational Development, AUS 2015',
  'LinkedIn'
);

-- Sample Resume 38: Integration Specialist
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'karam.integration@email.com', '+971 55 901 2345', 'Karam', 'Al-Falahi', 'Dubai, UAE',
  'https://linkedin.com/in/karamintegration',
  'KARAM AL-FALAHI
Integration Specialist | Dubai, UAE
SUMMARY: Integration Specialist with 6 years integrating enterprise systems. Expertise in API integration, data mapping, and middleware solutions.
SKILLS: API Integration, Data Mapping, Middleware (Mulesoft, Talend), ETL, XML/JSON, Salesforce Integration
EXPERIENCE: Senior Integration Specialist at SystemsIntegration (2020-Present), Integration Specialist at EnterpriseSoft (2017-2020)
EDUCATION: Bachelor in Computer Science, Ajman University 2016',
  'LinkedIn'
);

-- Sample Resume 39: Performance Engineer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'haitham.perf@email.com', '+971 50 012 3456', 'Haitham', 'Hassan', 'Dubai, UAE',
  'https://linkedin.com/in/haithamperf',
  'HAITHAM HASSAN
Performance Engineer | Dubai, UAE
SUMMARY: Performance Engineer with 7 years optimizing application performance. Expertise in load testing, profiling, and performance tuning.
SKILLS: JMeter, LoadRunner, Performance Analysis, Application Profiling, Bottleneck Identification, Database Optimization
EXPERIENCE: Senior Performance Engineer at PerformanceTech (2020-Present), Performance Engineer at TestServices (2017-2020)
EDUCATION: Bachelor in Computer Science, University of Dubai 2015',
  'LinkedIn'
);

-- Sample Resume 40: Supply Chain Manager
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'aisha.supply@email.com', '+971 55 123 4567', 'Aisha', 'Al-Mazrouei', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/aishasupply',
  'AISHA AL-MAZROUEI
Supply Chain Manager | Abu Dhabi, UAE
SUMMARY: Supply Chain Manager with 8 years optimizing supply chain operations. Expertise in logistics, procurement, and vendor management.
SKILLS: Supply Chain Management, Procurement, Vendor Management, Inventory Control, Logistics, SAP
CERTIFICATIONS: APICS CSCP
EXPERIENCE: Senior Supply Chain Manager at LogisticsCore (2020-Present), Supply Chain Manager at DistributionCo (2016-2020)
EDUCATION: Master in Supply Chain Management, AUS 2015',
  'LinkedIn'
);

-- Sample Resume 41: IT Helpdesk Technician (Entry Level)
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'naji.helpdesk@email.com', '+971 50 234 5678', 'Naji', 'Hassan', 'Dubai, UAE',
  'https://linkedin.com/in/najihelpdesk',
  'NAJI HASSAN
IT Helpdesk Technician | Dubai, UAE
SUMMARY: Helpdesk Technician with 2 years providing user support. Eager to grow in IT support field. Excellent customer service skills.
SKILLS: Windows, Mac, Linux Basics, Ticketing Systems, Basic Networking, Hardware Troubleshooting, User Support
CERTIFICATIONS: CompTIA A+ (in progress)
EXPERIENCE: IT Helpdesk Technician at TechSupport (2022-Present), IT Support Intern at HelpCenter (2021-2022)
EDUCATION: Diploma in IT Support 2021',
  'LinkedIn'
);

-- Sample Resume 42: ETL Developer
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'maryam.etl@email.com', '+971 55 345 6789', 'Maryam', 'Al-Kaabi', 'Dubai, UAE',
  'https://linkedin.com/in/maryametl',
  'MARYAM AL-KAABI
ETL Developer | Dubai, UAE
SUMMARY: ETL Developer with 5 years building ETL pipelines. Expertise in data integration and transformation.
SKILLS: Python, Talend, SSIS, SQL, Data Warehousing, ETL Design, Data Quality, Performance Tuning
EXPERIENCE: Senior ETL Developer at DataEng (2020-Present), ETL Developer at AnalyticsCorp (2017-2020)
EDUCATION: Master in Computer Science, AUS 2017',
  'LinkedIn'
);

-- Sample Resume 43: Vendor Manager
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'emira.vendor@email.com', '+971 50 456 7890', 'Emira', 'Ibrahim', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/emiravendor',
  'EMIRA IBRAHIM
Vendor Manager | Abu Dhabi, UAE
SUMMARY: Vendor Manager with 7 years managing vendor relationships. Expertise in procurement, contract management, and negotiations.
SKILLS: Vendor Management, Procurement, Contract Negotiation, Cost Reduction, Performance Metrics, Relationship Building
EXPERIENCE: Senior Vendor Manager at ProcurementPlus (2020-Present), Vendor Manager at SupplyChain (2016-2020)
EDUCATION: Bachelor in Business Administration, AUS 2015',
  'LinkedIn'
);

-- Sample Resume 44: Automation Tester
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'yasmine.auto@email.com', '+971 55 567 8901', 'Yasmine', 'Al-Mansouri', 'Dubai, UAE',
  'https://linkedin.com/in/yasmineauto',
  'YASMINE AL-MANSOURI
Test Automation Engineer | Dubai, UAE
SUMMARY: Test Automation Engineer with 5 years automating test suites. Expertise in Selenium, API testing, and test frameworks.
SKILLS: Selenium, Python, Java, API Testing, TestNG, Jenkins, Git, Agile
EXPERIENCE: Senior Test Automation Engineer at QATest (2020-Present), Test Automation Engineer at SoftwareQA (2017-2020)
EDUCATION: Diploma in Software Testing 2017',
  'LinkedIn'
);

-- Sample Resume 45: Risk Manager
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'sami.risk@email.com', '+971 50 678 9012', 'Sami', 'Al-Neyadi', 'Dubai, UAE',
  'https://linkedin.com/in/samirisk',
  'SAMI AL-NEYADI
Risk Manager | Dubai, UAE
SUMMARY: Risk Manager with 9 years identifying and mitigating business risks. Expertise in risk assessment and mitigation strategies.
SKILLS: Risk Assessment, Risk Mitigation, Business Analysis, Regulatory Compliance, Documentation, Strategic Planning
CERTIFICATIONS: PRM (Professional Risk Manager)
EXPERIENCE: Senior Risk Manager at RiskManagement (2020-Present), Risk Analyst at FinanceCore (2015-2020)
EDUCATION: Master in Business Administration, AUS 2014',
  'LinkedIn'
);

-- Sample Resume 46: Web Developer (PHP)
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'noor.php@email.com', '+971 55 789 0123', 'Noor', 'Hassan', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/norphp',
  'NOOR HASSAN
PHP Web Developer | Abu Dhabi, UAE
SUMMARY: PHP Developer with 6 years building web applications. Expertise in Laravel, WordPress, and database design.
SKILLS: PHP, Laravel, WordPress, MySQL, Apache, Git, REST APIs, JavaScript, HTML/CSS
EXPERIENCE: Senior PHP Developer at WebDevelopment (2020-Present), PHP Developer at WebAgency (2017-2020)
EDUCATION: Diploma in Web Development 2016',
  'LinkedIn'
);

-- Sample Resume 47: IT Compliance Analyst
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'rana.compliance@email.com', '+971 50 890 1234', 'Rana', 'Al-Kaabi', 'Dubai, UAE',
  'https://linkedin.com/in/ranacompliance',
  'RANA AL-KAABI
IT Compliance Analyst | Dubai, UAE
SUMMARY: IT Compliance Analyst with 6 years ensuring IT compliance. Expertise in ISO, HIPAA, and PCI-DSS standards.
SKILLS: Compliance Auditing, ISO Standards, Security Assessment, Documentation, Risk Analysis, Reporting
CERTIFICATIONS: ISO 27001 Lead Auditor
EXPERIENCE: Senior Compliance Analyst at TechCompliance (2020-Present), Compliance Analyst at Security (2017-2020)
EDUCATION: Bachelor in Information Security, Ajman University 2016',
  'LinkedIn'
);

-- Sample Resume 48: Senior Software Architect
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'jaafar.architect@email.com', '+971 55 901 2345', 'Jaafar', 'Al-Marri', 'Dubai, UAE',
  'https://linkedin.com/in/jaafararchitect',
  'JAAFAR AL-MARRI
Senior Software Architect | Dubai, UAE
SUMMARY: Architect with 12 years designing enterprise software systems. Expertise in microservices, scalability, and technology selection.
SKILLS: System Design, Microservices, Design Patterns, Cloud Architecture, Enterprise Design, Technical Leadership, Documentation
EXPERIENCE: Enterprise Architect at TechLeadership (2020-Present), Software Architect at ArchitectureCorp (2016-2020)
EDUCATION: Master in Software Engineering, AUS 2014
PUBLISHED: 5 technical papers on architecture patterns',
  'LinkedIn'
);

-- Sample Resume 49: IT Auditor
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'amin.audit@email.com', '+971 50 012 3456', 'Amin', 'Hassan', 'Abu Dhabi, UAE',
  'https://linkedin.com/in/aminaudit',
  'AMIN HASSAN
IT Auditor | Abu Dhabi, UAE
SUMMARY: IT Auditor with 8 years auditing IT systems and controls. Expertise in IT governance, risk management, and compliance.
SKILLS: IT Audit, Governance, Risk Management, Control Assessment, Internal Controls, Documentation, SOX Compliance
CERTIFICATIONS: CISA (Certified Information Systems Auditor)
EXPERIENCE: Senior IT Auditor at AuditFirm (2020-Present), IT Auditor at FinanceAudit (2016-2020)
EDUCATION: Master in Accounting, AUS 2015',
  'LinkedIn'
);

-- Sample Resume 50: Research Scientist
INSERT INTO candidates (email, phone, first_name, last_name, location, linkedin_url, resume_text, source)
VALUES (
  'zahra.research@email.com', '+971 55 123 4567', 'Zahra', 'Al-Falahi', 'Dubai, UAE',
  'https://linkedin.com/in/zaharesearch',
  'ZAHRA AL-FALAHI
Research Scientist | Dubai, UAE
SUMMARY: Research Scientist with 7 years in AI and machine learning research. Expertise in deep learning, computer vision, and NLP.
SKILLS: Python, TensorFlow, PyTorch, Research Methodology, Academic Writing, Conference Presentations, Collaboration
PUBLICATIONS: 15 peer-reviewed papers in top-tier venues
EDUCATION: PhD in Computer Science, MIT 2018
EXPERIENCE: Research Scientist at AI Research (2020-Present), Postdoctoral Fellow at University Lab (2018-2020)',
  'LinkedIn'
);
