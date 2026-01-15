-- =========================================
-- V4: Seed Resume Data for Sita Vaibhavi Gunturi
-- =========================================

-- Clear existing seed data (except admin user)
DELETE FROM portfolio.experience_bullet;
DELETE FROM portfolio.experience;
DELETE FROM portfolio.project_bullet;
DELETE FROM portfolio.project;
DELETE FROM portfolio.skill_item;
DELETE FROM portfolio.skill_category;
DELETE FROM portfolio.education;
DELETE FROM portfolio.certification;
DELETE FROM portfolio.contact_settings;
DELETE FROM portfolio.profile;

-- =========================================
-- Profile
-- =========================================
INSERT INTO portfolio.profile (
    id, name, title, tagline, bio, email, 
    github_url, linkedin_url, avatar_url, resume_url,
    created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'Sita Vaibhavi Gunturi',
    'Full Stack Software Engineer',
    'Building scalable applications with Java, Spring Boot, and Angular',
    'I am a Master''s student in Computer Science at Penn State with professional experience as a Full Stack Software Engineer. My expertise spans backend development with Java and Spring Boot, frontend development with Angular, and cloud technologies including AWS, Docker, and Kubernetes. I''m passionate about AI/ML, data engineering, and building production-grade applications that solve real-world problems.',
    'sitag.dev@gmail.com',
    'https://github.com/Vaibhavi-Sita',
    'https://linkedin.com/in/vaibhavigs',
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- =========================================
-- Contact Settings
-- =========================================
INSERT INTO portfolio.contact_settings (
    id, email, phone, location, availability_status,
    form_enabled, form_recipient, success_message,
    created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'sitag.dev@gmail.com',
    NULL,
    'Pennsylvania, USA',
    'Open to opportunities',
    true,
    'sitag.dev@gmail.com',
    'Thank you for reaching out! I''ll get back to you as soon as possible.',
    NOW(),
    NOW()
);

-- =========================================
-- Education
-- =========================================
INSERT INTO portfolio.education (
    id, institution, degree, field_of_study, location,
    start_year, end_year, gpa, description, logo_url,
    sort_order, is_published, created_at, updated_at
) VALUES 
(
    gen_random_uuid(),
    'Pennsylvania State University',
    'Master of Science',
    'Computer Science',
    'Pennsylvania, USA',
    2024,
    2025,
    NULL,
    'Graduate studies focusing on Artificial Intelligence, Machine Learning, and Software Engineering.',
    NULL,
    1,
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Jawaharlal Nehru Technological University',
    'Bachelor of Technology',
    'Computer Science & Engineering',
    'India',
    2018,
    2022,
    NULL,
    'Undergraduate degree in Computer Science with focus on software development fundamentals.',
    NULL,
    2,
    true,
    NOW(),
    NOW()
);

-- =========================================
-- Work Experience
-- =========================================

-- Experience 1: AI Research Assistant
INSERT INTO portfolio.experience (
    id, company, role, location, employment_type,
    start_date, end_date, description, tech_stack,
    company_url, logo_url, sort_order, is_published,
    created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'The Pennsylvania State University',
    'Artificial Intelligence Research Assistant',
    'Pennsylvania, USA',
    'Part-time',
    '2024-01-01',
    '2025-12-31',
    'Conducting AI/ML research focusing on Large Language Models, RAG workflows, and data-driven decision support systems.',
    'Python, LLMs, RAG, Generative AI, Data Analysis, EDA',
    'https://www.psu.edu',
    NULL,
    1,
    true,
    NOW(),
    NOW()
);

-- Get the experience ID for bullets
DO $$
DECLARE
    exp_id UUID;
BEGIN
    SELECT id INTO exp_id FROM portfolio.experience WHERE company = 'The Pennsylvania State University' LIMIT 1;
    
    INSERT INTO portfolio.experience_bullet (id, experience_id, content, sort_order, created_at) VALUES
    (gen_random_uuid(), exp_id, 'Performed large scale exploratory data analysis (EDA) on real world EMS incident data to uncover temporal, spatial, and priority based demand patterns, driving data informed model design and simulation assumptions.', 1, NOW()),
    (gen_random_uuid(), exp_id, 'Researched and evaluated Large Language Models (LLMs) and Generative AI systems, including prompt engineering, retrieval augmented generation (RAG) workflows, and structured evaluation frameworks to support explainable and reproducible AI driven decision support.', 2, NOW());
END $$;

-- Experience 2: J&J Intern
INSERT INTO portfolio.experience (
    id, company, role, location, employment_type,
    start_date, end_date, description, tech_stack,
    company_url, logo_url, sort_order, is_published,
    created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'Johnson & Johnson',
    'Software Engineer Intern',
    'USA',
    'Internship',
    '2025-05-01',
    '2025-08-31',
    'Data engineering and automation for multi-omics research platforms.',
    'Python, AWS, TileDB, Plotly, PowerBI, Data Engineering',
    'https://www.jnj.com',
    NULL,
    2,
    true,
    NOW(),
    NOW()
);

DO $$
DECLARE
    exp_id UUID;
BEGIN
    SELECT id INTO exp_id FROM portfolio.experience WHERE company = 'Johnson & Johnson' LIMIT 1;
    
    INSERT INTO portfolio.experience_bullet (id, experience_id, content, sort_order, created_at) VALUES
    (gen_random_uuid(), exp_id, 'Integrated TileDB with AWS to build scalable storage and querying frameworks for large scale single cell multi omics data, supporting efficient data ingestion, preprocessing, cleaning, normalization, and faster downstream access for research teams.', 1, NOW()),
    (gen_random_uuid(), exp_id, 'Developed Python based automation pipelines to handle data validation, transformation, and feature preparation, transforming complex analyses into analytics outputs, interactive Plotly reports, and PowerBI dashboards for data visualization.', 2, NOW()),
    (gen_random_uuid(), exp_id, 'Selected Presenter at the 2025 Johnson & Johnson Global Research Symposium, recognized among top projects for technical impact, data engineering rigor, and Agentic AI integration.', 3, NOW());
END $$;

-- Experience 3: OpenText Full Stack
INSERT INTO portfolio.experience (
    id, company, role, location, employment_type,
    start_date, end_date, description, tech_stack,
    company_url, logo_url, sort_order, is_published,
    created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'OpenText',
    'Full Stack Software Engineer',
    'India',
    'Full-time',
    '2021-09-01',
    '2023-09-30',
    'Developed and maintained enterprise B2B applications using Java, Spring Boot, Angular, and cloud technologies.',
    'Java, Spring Boot, Angular, MySQL, Docker, Kubernetes, Helm, Jenkins, GitLab CI/CD',
    'https://www.opentext.com',
    NULL,
    3,
    true,
    NOW(),
    NOW()
);

DO $$
DECLARE
    exp_id UUID;
BEGIN
    SELECT id INTO exp_id FROM portfolio.experience WHERE company = 'OpenText' AND role = 'Full Stack Software Engineer' LIMIT 1;
    
    INSERT INTO portfolio.experience_bullet (id, experience_id, content, sort_order, created_at) VALUES
    (gen_random_uuid(), exp_id, 'Designed, developed, and supported production grade RESTful APIs using Java, Spring Boot, and MySQL, focusing on scalability, availability, and efficient data access for enterprise B2B platforms.', 1, NOW()),
    (gen_random_uuid(), exp_id, 'Built and optimized responsive Angular based front end applications, collaborating closely with backend services to improve user experience, data flow, and overall system performance.', 2, NOW()),
    (gen_random_uuid(), exp_id, 'Partnered with DevOps and security teams to enable containerized application deployments and DevSecOps workflows using Docker, Kubernetes, and Helm within controlled production environments.', 3, NOW()),
    (gen_random_uuid(), exp_id, 'Contributed to CI/CD driven delivery pipelines by integrating automated builds, testing, and deployments using GitLab CI/CD and Jenkins, improving release reliability and deployment consistency.', 4, NOW());
END $$;

-- Experience 4: OpenText QA Intern
INSERT INTO portfolio.experience (
    id, company, role, location, employment_type,
    start_date, end_date, description, tech_stack,
    company_url, logo_url, sort_order, is_published,
    created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'OpenText',
    'QA Software Engineer Intern',
    'India',
    'Internship',
    '2021-07-01',
    '2021-09-30',
    'Quality assurance and test automation for microservices applications.',
    'Selenium, JUnit, Jenkins, AWS, CI/CD, TDD',
    'https://www.opentext.com',
    NULL,
    4,
    true,
    NOW(),
    NOW()
);

DO $$
DECLARE
    exp_id UUID;
BEGIN
    SELECT id INTO exp_id FROM portfolio.experience WHERE company = 'OpenText' AND role = 'QA Software Engineer Intern' LIMIT 1;
    
    INSERT INTO portfolio.experience_bullet (id, experience_id, content, sort_order, created_at) VALUES
    (gen_random_uuid(), exp_id, 'Conducted extensive Software Quality Assurance through regression, integration, and functional testing using Selenium and JUnit in AWS environments, reducing critical defects and improving overall app stability.', 1, NOW()),
    (gen_random_uuid(), exp_id, 'Integrated automated regression and integration test suites into CI/CD pipelines using Jenkins, to support Test Driven Development (TDD) practices and validate RESTful microservices deployments across environments.', 2, NOW());
END $$;

-- =========================================
-- Skills
-- =========================================

-- Programming Languages
INSERT INTO portfolio.skill_category (id, name, icon, sort_order, is_published, created_at, updated_at)
VALUES (gen_random_uuid(), 'Programming Languages', 'code', 1, true, NOW(), NOW());

DO $$
DECLARE
    cat_id UUID;
BEGIN
    SELECT id INTO cat_id FROM portfolio.skill_category WHERE name = 'Programming Languages' LIMIT 1;
    
    INSERT INTO portfolio.skill_item (id, category_id, name, icon_url, proficiency, sort_order, created_at) VALUES
    (gen_random_uuid(), cat_id, 'Java', NULL, 'Expert', 1, NOW()),
    (gen_random_uuid(), cat_id, 'Python', NULL, 'Advanced', 2, NOW()),
    (gen_random_uuid(), cat_id, 'JavaScript', NULL, 'Advanced', 3, NOW()),
    (gen_random_uuid(), cat_id, 'TypeScript', NULL, 'Intermediate', 4, NOW()),
    (gen_random_uuid(), cat_id, 'SQL', NULL, 'Advanced', 5, NOW());
END $$;

-- Backend Development
INSERT INTO portfolio.skill_category (id, name, icon, sort_order, is_published, created_at, updated_at)
VALUES (gen_random_uuid(), 'Backend Development', 'server', 2, true, NOW(), NOW());

DO $$
DECLARE
    cat_id UUID;
BEGIN
    SELECT id INTO cat_id FROM portfolio.skill_category WHERE name = 'Backend Development' LIMIT 1;
    
    INSERT INTO portfolio.skill_item (id, category_id, name, icon_url, proficiency, sort_order, created_at) VALUES
    (gen_random_uuid(), cat_id, 'Spring Boot', NULL, 'Expert', 1, NOW()),
    (gen_random_uuid(), cat_id, 'Hibernate/JPA', NULL, 'Advanced', 2, NOW()),
    (gen_random_uuid(), cat_id, 'REST APIs', NULL, 'Expert', 3, NOW()),
    (gen_random_uuid(), cat_id, 'Node.js', NULL, 'Intermediate', 4, NOW()),
    (gen_random_uuid(), cat_id, 'MySQL', NULL, 'Advanced', 5, NOW()),
    (gen_random_uuid(), cat_id, 'PostgreSQL', NULL, 'Advanced', 6, NOW());
END $$;

-- Frontend Development
INSERT INTO portfolio.skill_category (id, name, icon, sort_order, is_published, created_at, updated_at)
VALUES (gen_random_uuid(), 'Frontend Development', 'layout', 3, true, NOW(), NOW());

DO $$
DECLARE
    cat_id UUID;
BEGIN
    SELECT id INTO cat_id FROM portfolio.skill_category WHERE name = 'Frontend Development' LIMIT 1;
    
    INSERT INTO portfolio.skill_item (id, category_id, name, icon_url, proficiency, sort_order, created_at) VALUES
    (gen_random_uuid(), cat_id, 'Angular', NULL, 'Advanced', 1, NOW()),
    (gen_random_uuid(), cat_id, 'React', NULL, 'Intermediate', 2, NOW()),
    (gen_random_uuid(), cat_id, 'HTML/CSS', NULL, 'Advanced', 3, NOW()),
    (gen_random_uuid(), cat_id, 'Responsive Design', NULL, 'Advanced', 4, NOW());
END $$;

-- Cloud & DevOps
INSERT INTO portfolio.skill_category (id, name, icon, sort_order, is_published, created_at, updated_at)
VALUES (gen_random_uuid(), 'Cloud & DevOps', 'cloud', 4, true, NOW(), NOW());

DO $$
DECLARE
    cat_id UUID;
BEGIN
    SELECT id INTO cat_id FROM portfolio.skill_category WHERE name = 'Cloud & DevOps' LIMIT 1;
    
    INSERT INTO portfolio.skill_item (id, category_id, name, icon_url, proficiency, sort_order, created_at) VALUES
    (gen_random_uuid(), cat_id, 'Amazon Web Services (AWS)', NULL, 'Advanced', 1, NOW()),
    (gen_random_uuid(), cat_id, 'Docker', NULL, 'Advanced', 2, NOW()),
    (gen_random_uuid(), cat_id, 'Kubernetes', NULL, 'Intermediate', 3, NOW()),
    (gen_random_uuid(), cat_id, 'Helm', NULL, 'Intermediate', 4, NOW()),
    (gen_random_uuid(), cat_id, 'Jenkins', NULL, 'Advanced', 5, NOW()),
    (gen_random_uuid(), cat_id, 'GitLab CI/CD', NULL, 'Advanced', 6, NOW());
END $$;

-- AI & Data
INSERT INTO portfolio.skill_category (id, name, icon, sort_order, is_published, created_at, updated_at)
VALUES (gen_random_uuid(), 'AI & Data', 'brain', 5, true, NOW(), NOW());

DO $$
DECLARE
    cat_id UUID;
BEGIN
    SELECT id INTO cat_id FROM portfolio.skill_category WHERE name = 'AI & Data' LIMIT 1;
    
    INSERT INTO portfolio.skill_item (id, category_id, name, icon_url, proficiency, sort_order, created_at) VALUES
    (gen_random_uuid(), cat_id, 'PyTorch', NULL, 'Intermediate', 1, NOW()),
    (gen_random_uuid(), cat_id, 'TensorFlow', NULL, 'Intermediate', 2, NOW()),
    (gen_random_uuid(), cat_id, 'LangChain', NULL, 'Intermediate', 3, NOW()),
    (gen_random_uuid(), cat_id, 'Pandas', NULL, 'Advanced', 4, NOW()),
    (gen_random_uuid(), cat_id, 'NumPy', NULL, 'Advanced', 5, NOW()),
    (gen_random_uuid(), cat_id, 'PowerBI', NULL, 'Intermediate', 6, NOW()),
    (gen_random_uuid(), cat_id, 'Matplotlib', NULL, 'Advanced', 7, NOW()),
    (gen_random_uuid(), cat_id, 'NLP', NULL, 'Intermediate', 8, NOW());
END $$;

-- Tools & Methods
INSERT INTO portfolio.skill_category (id, name, icon, sort_order, is_published, created_at, updated_at)
VALUES (gen_random_uuid(), 'Tools & Methods', 'wrench', 6, true, NOW(), NOW());

DO $$
DECLARE
    cat_id UUID;
BEGIN
    SELECT id INTO cat_id FROM portfolio.skill_category WHERE name = 'Tools & Methods' LIMIT 1;
    
    INSERT INTO portfolio.skill_item (id, category_id, name, icon_url, proficiency, sort_order, created_at) VALUES
    (gen_random_uuid(), cat_id, 'Git', NULL, 'Expert', 1, NOW()),
    (gen_random_uuid(), cat_id, 'Linux', NULL, 'Advanced', 2, NOW()),
    (gen_random_uuid(), cat_id, 'Maven', NULL, 'Advanced', 3, NOW()),
    (gen_random_uuid(), cat_id, 'Jira', NULL, 'Advanced', 4, NOW()),
    (gen_random_uuid(), cat_id, 'Swagger/OpenAPI', NULL, 'Advanced', 5, NOW()),
    (gen_random_uuid(), cat_id, 'Postman', NULL, 'Advanced', 6, NOW()),
    (gen_random_uuid(), cat_id, 'Agile/Scrum', NULL, 'Advanced', 7, NOW()),
    (gen_random_uuid(), cat_id, 'MVC Architecture', NULL, 'Expert', 8, NOW());
END $$;

-- =========================================
-- Certifications (Publications as achievement)
-- =========================================
INSERT INTO portfolio.certification (
    id, name, issuer, issue_date, expiry_date,
    credential_id, credential_url, badge_url,
    sort_order, is_published, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'An Evaluation of Prompt Engineering Strategies in Programming',
    'American Society for Engineering Education (ASEE)',
    '2024-01-01',
    NULL,
    '57608',
    'https://peer.asee.org/57608',
    NULL,
    1,
    true,
    NOW(),
    NOW()
);

-- =========================================
-- Projects (Based on experience, creating representative projects)
-- =========================================

-- Project 1: Portfolio Website
INSERT INTO portfolio.project (
    id, title, slug, description, long_description,
    tech_stack, live_url, github_url, image_url, thumbnail_url,
    is_featured, sort_order, is_published, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'Portfolio Website',
    'portfolio-website',
    'Full-stack portfolio application built with Spring Boot backend and Angular frontend, featuring admin dashboard for content management.',
    'A modern, responsive portfolio website built using a full-stack architecture. The backend is powered by Spring Boot with PostgreSQL database hosted on Supabase, featuring JWT authentication, RESTful APIs, and Flyway migrations. The frontend uses Angular with a beautiful, responsive design. Includes an admin dashboard for managing all portfolio content.',
    'Spring Boot, Angular, PostgreSQL, Supabase, JWT, Flyway, Docker',
    NULL,
    'https://github.com/Vaibhavi-Sita/portfolio',
    NULL,
    NULL,
    true,
    1,
    true,
    NOW(),
    NOW()
);

DO $$
DECLARE
    proj_id UUID;
BEGIN
    SELECT id INTO proj_id FROM portfolio.project WHERE slug = 'portfolio-website' LIMIT 1;
    
    INSERT INTO portfolio.project_bullet (id, project_id, content, sort_order, created_at) VALUES
    (gen_random_uuid(), proj_id, 'Designed and implemented RESTful APIs with Spring Boot following MVC architecture and clean code principles.', 1, NOW()),
    (gen_random_uuid(), proj_id, 'Built responsive Angular frontend with modern UI/UX design and smooth animations.', 2, NOW()),
    (gen_random_uuid(), proj_id, 'Implemented JWT-based authentication for secure admin access and content management.', 3, NOW()),
    (gen_random_uuid(), proj_id, 'Deployed database on Supabase PostgreSQL with Flyway migrations for version control.', 4, NOW());
END $$;

-- Project 2: Enterprise B2B Platform APIs
INSERT INTO portfolio.project (
    id, title, slug, description, long_description,
    tech_stack, live_url, github_url, image_url, thumbnail_url,
    is_featured, sort_order, is_published, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'Enterprise B2B Platform',
    'enterprise-b2b-platform',
    'Production-grade RESTful APIs for enterprise B2B platforms with high scalability and availability.',
    'Developed comprehensive backend services for enterprise B2B platforms at OpenText. The system handles complex business logic, data access patterns, and integrates with multiple enterprise systems. Built with focus on scalability, security, and maintainability.',
    'Java, Spring Boot, MySQL, Docker, Kubernetes, Helm, Jenkins',
    NULL,
    NULL,
    NULL,
    NULL,
    true,
    2,
    true,
    NOW(),
    NOW()
);

DO $$
DECLARE
    proj_id UUID;
BEGIN
    SELECT id INTO proj_id FROM portfolio.project WHERE slug = 'enterprise-b2b-platform' LIMIT 1;
    
    INSERT INTO portfolio.project_bullet (id, project_id, content, sort_order, created_at) VALUES
    (gen_random_uuid(), proj_id, 'Designed and implemented scalable RESTful APIs handling thousands of requests per minute.', 1, NOW()),
    (gen_random_uuid(), proj_id, 'Containerized applications using Docker and orchestrated deployments with Kubernetes and Helm.', 2, NOW()),
    (gen_random_uuid(), proj_id, 'Integrated CI/CD pipelines with Jenkins and GitLab for automated testing and deployment.', 3, NOW()),
    (gen_random_uuid(), proj_id, 'Implemented DevSecOps practices ensuring security compliance in production environments.', 4, NOW());
END $$;

-- Project 3: Multi-Omics Data Platform
INSERT INTO portfolio.project (
    id, title, slug, description, long_description,
    tech_stack, live_url, github_url, image_url, thumbnail_url,
    is_featured, sort_order, is_published, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'Multi-Omics Data Engineering Platform',
    'multi-omics-platform',
    'Scalable data engineering platform for single-cell multi-omics research with automated pipelines.',
    'Built at Johnson & Johnson, this platform enables researchers to efficiently work with large-scale single-cell multi-omics data. Features include automated data ingestion, preprocessing, cleaning, normalization, and visualization dashboards.',
    'Python, AWS, TileDB, Plotly, PowerBI, Pandas',
    NULL,
    NULL,
    NULL,
    NULL,
    true,
    3,
    true,
    NOW(),
    NOW()
);

DO $$
DECLARE
    proj_id UUID;
BEGIN
    SELECT id INTO proj_id FROM portfolio.project WHERE slug = 'multi-omics-platform' LIMIT 1;
    
    INSERT INTO portfolio.project_bullet (id, project_id, content, sort_order, created_at) VALUES
    (gen_random_uuid(), proj_id, 'Integrated TileDB with AWS for scalable storage and querying of large-scale biological data.', 1, NOW()),
    (gen_random_uuid(), proj_id, 'Developed Python automation pipelines for data validation, transformation, and feature engineering.', 2, NOW()),
    (gen_random_uuid(), proj_id, 'Created interactive Plotly dashboards and PowerBI reports for data visualization.', 3, NOW()),
    (gen_random_uuid(), proj_id, 'Recognized as top project at J&J Global Research Symposium for technical impact.', 4, NOW());
END $$;

-- Project 4: AI Decision Support System
INSERT INTO portfolio.project (
    id, title, slug, description, long_description,
    tech_stack, live_url, github_url, image_url, thumbnail_url,
    is_featured, sort_order, is_published, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'AI-Driven Decision Support System',
    'ai-decision-support',
    'Research project implementing LLMs and RAG workflows for explainable AI-driven decision support.',
    'Academic research project at Penn State focusing on applying Large Language Models and Retrieval Augmented Generation to real-world EMS incident data. The system provides explainable and reproducible AI-driven insights for emergency services optimization.',
    'Python, LLMs, RAG, LangChain, Generative AI, Data Analysis',
    NULL,
    NULL,
    NULL,
    NULL,
    false,
    4,
    true,
    NOW(),
    NOW()
);

DO $$
DECLARE
    proj_id UUID;
BEGIN
    SELECT id INTO proj_id FROM portfolio.project WHERE slug = 'ai-decision-support' LIMIT 1;
    
    INSERT INTO portfolio.project_bullet (id, project_id, content, sort_order, created_at) VALUES
    (gen_random_uuid(), proj_id, 'Performed large-scale exploratory data analysis on EMS incident data to uncover demand patterns.', 1, NOW()),
    (gen_random_uuid(), proj_id, 'Implemented RAG workflows for context-aware AI responses and decision support.', 2, NOW()),
    (gen_random_uuid(), proj_id, 'Developed structured evaluation frameworks for explainable and reproducible AI systems.', 3, NOW()),
    (gen_random_uuid(), proj_id, 'Applied prompt engineering techniques to optimize LLM performance for domain-specific tasks.', 4, NOW());
END $$;
