// Job Roles Definition with core competencies, descriptions, and realistic sample job descriptions
export const JOB_ROLES = [
  {
    id: 'ai_engineer',
    title: 'AI Engineer',
    icon: '🤖',
    category: 'Artificial Intelligence',
    defaultJobTitle: 'Senior AI Engineer — LLMs & Generative AI',
    description: 'Designs, develops, and deploys intelligent generative AI systems, LLM agents, RAG pipelines, and deep neural models.',
    coreMandatorySkills: [
      'python',
      'generative_ai',
      'llms',
      'rag',
      'langchain',
      'vector_db',
      'pytorch',
      'docker',
      'rest_api',
      'git'
    ],
    secondarySkills: [
      'huggingface',
      'fine_tuning',
      'pinecone',
      'fastapi',
      'aws',
      'kubernetes',
      'mlops',
      'prompt_engineering',
      'problem_solving'
    ],
    sampleJobDescription: `Title: Senior AI Engineer (Generative AI & LLMs)
Location: Remote / Hybrid
Experience: 3-6+ Years

About the Role:
We are seeking an experienced AI Engineer to spearhead our next-generation Generative AI platform. In this role, you will architect enterprise-grade Retrieval-Augmented Generation (RAG) pipelines, build autonomous agent workflows, and deploy fine-tuned Large Language Models (LLMs) into scalable production systems.

Key Responsibilities:
• Design and implement production RAG systems using LangChain, LlamaIndex, and Vector Databases (Pinecone, ChromaDB, or Milvus).
• Fine-tune foundation models (PEFT, LoRA) and optimize inference latency using ONNX and TensorRT.
• Build scalable microservice endpoints using Python, FastAPI, and Docker for real-time model serving.
• Collaborate with ML engineers and data teams to engineer robust prompt pipelines and evaluation benchmarks.
• Deploy and maintain AI services on AWS / Kubernetes with automated CI/CD pipelines.

Qualifications & Requirements:
• 3+ years of hands-on experience building AI/ML applications in Python.
• Strong practical expertise with PyTorch, Hugging Face Transformers, and LLM frameworks.
• Deep understanding of vector embeddings, semantic search, and prompt engineering.
• Proven track record of deploying containerized microservices (Docker, Kubernetes, RESTful APIs).
• Familiarity with MLOps tools (MLflow) and cloud providers (AWS, Azure, or GCP).
• Excellent analytical problem-solving and clean code engineering practices.`
  },
  {
    id: 'machine_learning_engineer',
    title: 'Machine Learning Engineer',
    icon: '🧠',
    category: 'Artificial Intelligence',
    defaultJobTitle: 'Machine Learning Engineer — Production Systems',
    description: 'Builds, trains, evaluates, and productionalizes statistical ML models, feature pipelines, and scalable predictive architectures.',
    coreMandatorySkills: [
      'python',
      'machine_learning',
      'deep_learning',
      'scikit_learn',
      'pytorch',
      'mlops',
      'docker',
      'sql',
      'git'
    ],
    secondarySkills: [
      'tensorflow',
      'xgboost',
      'pandas',
      'numpy',
      'mlflow',
      'kubeflow',
      'aws',
      'kubernetes',
      'system_design'
    ],
    sampleJobDescription: `Title: Machine Learning Engineer (Core Algorithms & Inference)
Location: San Francisco, CA / Remote
Experience: 3-5 Years

Job Overview:
Our algorithmic platform team is looking for a talented Machine Learning Engineer to design, evaluate, and scale predictive models handling millions of daily events. You will bridge data science research and backend engineering to ensure high-throughput, low-latency model inference.

Key Duties:
• Develop, validate, and maintain supervised and unsupervised machine learning algorithms using Python, Scikit-Learn, PyTorch, and XGBoost.
• Build automated MLOps pipelines using MLflow and Kubeflow for continuous model training, evaluation, and drift monitoring.
• Design efficient feature engineering pipelines and high-performance data transformations in Pandas, NumPy, and SQL.
• Containerize models with Docker and deploy resilient inference endpoints on Kubernetes.
• Collaborate with cross-functional product and backend teams to conduct rigorous A/B experimentation and statistical evaluation.

Must-Have Requirements:
• Strong programming fundamentals in Python and object-oriented software design.
• Deep knowledge of ML algorithms: Gradient Boosting, Random Forests, Neural Networks, and Loss Optimizers.
• Experience building automated CI/CD and MLOps workflows in AWS or GCP environments.
• Solid grasp of data structures, algorithms, and distributed systems.`
  },
  {
    id: 'data_analyst',
    title: 'Data Analyst',
    icon: '📊',
    category: 'Data & Analytics',
    defaultJobTitle: 'Senior Data Analyst — Product & Growth',
    description: 'Transforms raw business data into actionable strategic insights, executive dashboards, KPI telemetry, and cohort metrics.',
    coreMandatorySkills: [
      'sql',
      'tableau',
      'power_bi',
      'excel_advanced',
      'statistics',
      'business_intelligence',
      'problem_solving'
    ],
    secondarySkills: [
      'python',
      'pandas',
      'ab_testing',
      'looker',
      'snowflake',
      'data_modeling',
      'documentation'
    ],
    sampleJobDescription: `Title: Senior Data Analyst (Product & Growth Metrics)
Location: New York, NY / Hybrid
Experience: 2-5 Years

Role Summary:
We are seeking an analytical and business-savvy Senior Data Analyst to empower data-informed decision making across marketing, product, and leadership teams. You will turn terabytes of complex transactional data into compelling dashboards, cohort analyses, and clear executive recommendations.

Responsibilities:
• Write complex SQL queries, window functions, and CTEs to extract and model behavioral telemetry from Snowflake and PostgreSQL.
• Build, publish, and maintain interactive business intelligence dashboards in Tableau and Power BI.
• Conduct statistical evaluations and A/B test analysis to measure feature adoption, user retention, and conversion funnels.
• Partner closely with product managers and stakeholders to establish OKRs, KPI trees, and automated reporting cadences.
• Present findings with clear visual storytelling and actionable data-driven strategies to leadership.

Qualifications:
• 3+ years in data analytics or business intelligence roles.
• Mastery in advanced SQL and data modeling concepts.
• Proven expertise building executive-ready dashboards in Tableau or Power BI.
• Strong foundation in statistical hypothesis testing, cohort retention, and exploratory data analysis.
• Experience with Python (Pandas) or Looker is a strong plus.`
  },
  {
    id: 'data_scientist',
    title: 'Data Scientist',
    icon: '🔬',
    category: 'Data & Analytics',
    defaultJobTitle: 'Data Scientist — Predictive Analytics & AI',
    description: 'Applies statistical rigor, predictive modeling, NLP, and machine learning to uncover deep patterns and solve complex business problems.',
    coreMandatorySkills: [
      'python',
      'statistics',
      'machine_learning',
      'pandas',
      'numpy',
      'sql',
      'ab_testing',
      'scikit_learn'
    ],
    secondarySkills: [
      'deep_learning',
      'nlp',
      'xgboost',
      'matplotlib',
      'bigquery',
      'snowflake',
      'git',
      'problem_solving'
    ],
    sampleJobDescription: `Title: Data Scientist (Predictive Modeling & Statistical AI)
Location: Boston, MA / Remote
Experience: 3-6 Years

Opportunity:
Join our Applied Science group to solve challenging problems across customer lifetime value modeling, churn forecasting, and personalization. As a Data Scientist, you will design statistical frameworks, conduct controlled experiments, and build ML models that drive commercial success.

What You Will Do:
• Formulate business problems as rigorous mathematical and statistical models.
• Perform exploratory data analysis (EDA), outlier detection, and feature engineering using Python, Pandas, and NumPy.
• Train and tune predictive models (XGBoost, Random Forests, Scikit-Learn) and validate performance with cross-validation.
• Design, implement, and analyze rigorous A/B experiments and multivariate tests.
• Communicate quantitative insights, methodology, and model boundaries to non-technical stakeholders.

Requirements:
• Degree in Computer Science, Statistics, Mathematics, Data Science, or related quantitative field.
• Strong proficiency in Python, SQL, and statistical modeling libraries.
• Demonstrable experience deploying machine learning models into production workflows.
• Deep understanding of causal inference, hypothesis testing, and statistical significance.
• Familiarity with Cloud Data Warehouses (BigQuery / Snowflake) and Git.`
  },
  {
    id: 'python_developer',
    title: 'Python Developer',
    icon: '🐍',
    category: 'Software Development',
    defaultJobTitle: 'Senior Python Backend Developer',
    description: 'Architects robust, high-performance backend microservices, REST/GraphQL APIs, background workers, and database architectures in Python.',
    coreMandatorySkills: [
      'python',
      'fastapi',
      'django',
      'postgresql',
      'rest_api',
      'docker',
      'git',
      'unit_testing'
    ],
    secondarySkills: [
      'redis',
      'flask',
      'ci_cd',
      'aws',
      'microservices',
      'linux',
      'oop',
      'system_design'
    ],
    sampleJobDescription: `Title: Senior Python Backend Developer
Location: Austin, TX / Remote
Experience: 3-5+ Years

Position Overview:
We are looking for a Senior Python Developer to build and scale our high-throughput backend services. You will design resilient RESTful APIs, optimize database queries, implement asynchronous task queues, and uphold clean code architecture standards.

Responsibilities:
• Architect, write, and maintain clean, testable, and secure Python services using FastAPI or Django REST Framework.
• Design normalized database schemas and optimize query performance in PostgreSQL and Redis.
• Integrate third-party APIs, authentication systems (OAuth2, JWT), and event-driven messaging.
• Write comprehensive unit and integration tests using PyTest to ensure high test coverage.
• Deploy containerized microservices with Docker and participate in code reviews, sprint planning, and CI/CD automation.

Requirements:
• 3+ years of professional backend engineering experience primarily in Python.
• In-depth mastery of modern Python features (asyncio, type hints, dataclasses).
• Hands-on expertise with ORMs (SQLAlchemy, Django ORM) and relational database tuning.
• Experience with caching patterns (Redis) and Docker containers.
• Commitment to automated testing, Git workflows, and clean code principles.`
  },
  {
    id: 'java_developer',
    title: 'Java Developer',
    icon: '☕',
    category: 'Software Development',
    defaultJobTitle: 'Senior Java Backend Engineer — Spring Boot',
    description: 'Builds enterprise-grade distributed systems, resilient microservices, multithreaded backends, and secure banking/fintech platforms in Java.',
    coreMandatorySkills: [
      'java',
      'springboot',
      'rest_api',
      'postgresql',
      'microservices',
      'unit_testing',
      'git',
      'oop'
    ],
    secondarySkills: [
      'docker',
      'kubernetes',
      'kafka',
      'redis',
      'ci_cd',
      'system_design',
      'mysql',
      'security'
    ],
    sampleJobDescription: `Title: Senior Java Backend Engineer (Spring Boot & Microservices)
Location: Chicago, IL / Hybrid
Experience: 4-7 Years

About the Position:
Our core enterprise platform engineering team is seeking a Senior Java Developer to construct resilient, distributed backend services that process millions of secure transactions per day.

Key Duties:
• Architect scalable microservices in Java 17/21 using Spring Boot, Spring Data JPA, and Spring Security.
• Design event-driven messaging pipelines utilizing Apache Kafka and Redis for low-latency asynchronous processing.
• Optimize relational data queries, transactions, and indexing strategies in PostgreSQL and MySQL.
• Enforce high software reliability with comprehensive JUnit and Mockito test suites.
• Package and deploy microservices using Docker, Kubernetes, and automated Jenkins / GitHub Actions CI/CD.

Desired Qualifications:
• 4+ years of hands-on Java development with deep understanding of JVM tuning, garbage collection, and concurrency.
• Strong practical experience with Spring Boot ecosystem and RESTful API architecture.
• Familiarity with event streaming platforms (Kafka) and distributed caching (Redis).
• Strong understanding of OOP, SOLID design principles, and enterprise design patterns.`
  },
  {
    id: 'software_engineer',
    title: 'Software Engineer',
    icon: '💻',
    category: 'Software Development',
    defaultJobTitle: 'Full-Stack Software Engineer',
    description: 'Generalist engineering powerhouse capable of building end-to-end full-stack applications, distributed services, and robust APIs.',
    coreMandatorySkills: [
      'javascript',
      'typescript',
      'python',
      'git',
      'rest_api',
      'unit_testing',
      'dsa',
      'system_design',
      'problem_solving'
    ],
    secondarySkills: [
      'react',
      'nodejs',
      'docker',
      'postgresql',
      'ci_cd',
      'agile',
      'oop',
      'security'
    ],
    sampleJobDescription: `Title: Full-Stack Software Engineer (Generalist)
Location: Seattle, WA / Hybrid / Remote
Experience: 3-5 Years

Role Summary:
We are seeking an adaptable Full-Stack Software Engineer who loves taking ambitious user-facing features from concept to production. You will write code across the frontend (React / TypeScript), backend services (Node.js or Python), and relational databases.

Core Responsibilities:
• Build responsive, high-performance web applications using modern TypeScript, React, and modular styling.
• Develop clean, secure RESTful and GraphQL APIs backed by PostgreSQL or MongoDB.
• Write clean, maintainable, and well-documented code with strong unit test coverage.
• Troubleshoot production bugs, improve system observability, and participate in blameless post-mortems.
• Partner closely with design, QA, and product teams in an agile two-week sprint cycle.

Candidate Profile:
• Bachelor's degree in Computer Science or equivalent practical industry experience.
• 3+ years of professional software development experience.
• Strong foundation in Data Structures, Algorithms, and System Design.
• Proficiency in TypeScript/JavaScript, and familiarity with Python or Java.
• Proven ability to quickly learn new frameworks and technologies.`
  },
  {
    id: 'android_developer',
    title: 'Android Developer',
    icon: '📱',
    category: 'Mobile Development',
    defaultJobTitle: 'Senior Android Mobile Engineer — Kotlin',
    description: 'Crafts fluid, intuitive native Android applications using modern Kotlin, Jetpack Compose, Coroutines, and MVVM architecture.',
    coreMandatorySkills: [
      'kotlin',
      'android_sdk',
      'jetpack_compose',
      'android_architecture',
      'rest_api',
      'git',
      'unit_testing'
    ],
    secondarySkills: [
      'java',
      'mobile_dev',
      'ci_cd',
      'oop',
      'problem_solving',
      'responsive_design'
    ],
    sampleJobDescription: `Title: Senior Android Engineer (Kotlin & Jetpack Compose)
Location: Denver, CO / Remote
Experience: 3-6 Years

About the Role:
We are looking for an experienced Native Android Developer to lead the development of our flagship mobile app used by over 5 million active users worldwide. You will craft pixel-perfect user interfaces in Jetpack Compose, build reliable offline-first architectures, and optimize rendering performance.

Key Responsibilities:
• Build and maintain modern Android applications using 100% Kotlin and Jetpack Compose.
• Implement clean reactive architectures (MVVM / MVI) leveraging Kotlin Coroutines, StateFlow, and Jetpack ViewModel.
• Handle offline caching, local persistence with Room Database, and seamless network communication via Retrofit / OkHttp.
• Write comprehensive unit tests and automated UI tests with JUnit and Espresso.
• Profile CPU, memory, and battery usage to deliver 60fps animations and rapid startup times.
• Publish and maintain releases on the Google Play Store, managing release tracks and crash reporting.

Qualifications:
• 3+ years of professional native Android development experience.
• In-depth mastery of Kotlin, modern Android SDK components, and Jetpack libraries.
• Hands-on experience migrating legacy XML layouts to declarative Jetpack Compose.
• Solid understanding of dependency injection (Hilt / Dagger) and RESTful API integration.`
  },
  {
    id: 'data_engineer',
    title: 'Data Engineer',
    icon: '⚡',
    category: 'Data & Analytics',
    defaultJobTitle: 'Senior Data Platform Engineer — Spark & Snowflake',
    description: 'Designs, constructs, and optimizes large-scale data lakehouses, streaming pipelines, batch ETL workflows, and data orchestration.',
    coreMandatorySkills: [
      'python',
      'sql',
      'spark',
      'kafka',
      'airflow',
      'etl_pipelines',
      'snowflake',
      'data_warehousing'
    ],
    secondarySkills: [
      'databricks',
      'dbt',
      'aws',
      'docker',
      'postgresql',
      'git',
      'system_design',
      'data_modeling'
    ],
    sampleJobDescription: `Title: Senior Data Engineer (Pipelines & Lakehouse Platform)
Location: Seattle, WA / Remote
Experience: 4-7 Years

Opportunity:
Our Data Platform team is seeking a Senior Data Engineer to architect the data foundation powering enterprise analytics and real-time machine learning models. You will build fault-tolerant data pipelines that process hundreds of gigabytes of streaming and batch data daily.

Responsibilities:
• Architect, deploy, and maintain scalable ETL/ELT pipelines using Python, PySpark, and Apache Airflow.
• Ingest real-time event streams utilizing Apache Kafka and Spark Streaming into Snowflake / Databricks Lakehouse.
• Design and optimize dimensional models, partition strategies, and SQL queries for massive distributed datasets.
• Implement automated data quality checks, schema evolution validations, and pipeline alerting using dbt.
• Maintain cloud infrastructure across AWS (S3, EMR, Redshift) using Terraform and Docker.

Requirements:
• 4+ years of data engineering experience with strong proficiency in Python and advanced SQL.
• Deep expertise with Apache Spark (PySpark) and distributed data processing principles.
• Hands-on experience with workflow orchestrators like Apache Airflow and streaming tools like Kafka.
• Proven track record with modern cloud warehouses (Snowflake, Databricks, or BigQuery).
• Strong commitment to data governance, schema validation, and CI/CD for data.`
  },
  {
    id: 'technical_support_engineer',
    title: 'Technical Support Engineer',
    icon: '🛠️',
    category: 'Support & Operations',
    defaultJobTitle: 'Tier 2/3 Technical Support Engineer',
    description: 'Resolves complex technical incidents, diagnoses enterprise software and networking issues, manages ticketing workflows, and ensures client satisfaction.',
    coreMandatorySkills: [
      'troubleshooting',
      'ticketing_systems',
      'networking_support',
      'active_directory',
      'itil',
      'customer_support',
      'sla_management'
    ],
    secondarySkills: [
      'office365',
      'remote_support',
      'linux',
      'bash',
      'sql',
      'service_desk',
      'documentation',
      'problem_solving'
    ],
    sampleJobDescription: `Title: Technical Support Engineer (Enterprise Tier 2 / 3)
Location: Dallas, TX / Remote
Experience: 2-5 Years

Role Overview:
We are looking for a customer-focused, technically sharp Technical Support Engineer to join our global operations team. You will be the primary technical escalation point for enterprise clients, troubleshooting complex software bugs, network connectivity hurdles, and API integrations.

Key Responsibilities:
• Triage, investigate, and resolve high-severity enterprise incidents adhering strictly to SLA timelines.
• Manage and document cases thoroughly within Jira and ServiceNow ticketing platforms.
• Perform deep-dive diagnostics across network protocols (TCP/IP, DNS, DHCP, VPN) and system logs.
• Manage user provisioning, role assignments, and permissions via Active Directory / Azure AD (Entra ID).
• Write internal troubleshooting runbooks, customer-facing knowledge base articles, and incident root cause analyses (RCA).
• Reproduce client bugs, identify code anomalies, and escalate cleanly to engineering and product teams.

Requirements:
• 2+ years of experience in enterprise technical support, application support, or sysadmin roles.
• Strong troubleshooting methodology with ability to dissect logs and isolate systemic issues.
• Practical understanding of networking fundamentals (DNS, HTTP/HTTPS, SSL, firewalls, routing).
• Familiarity with Active Directory, Windows Server, Linux CLI, and basic SQL query execution.
• Exceptional empathetic written and verbal communication skills with a client-first mindset.`
  },
  {
    id: 'cloud_engineer',
    title: 'Cloud Engineer',
    icon: '☁️',
    category: 'Cloud & Infrastructure',
    defaultJobTitle: 'Senior Cloud DevOps & Infrastructure Engineer',
    description: 'Architects, secures, automates, and maintains highly available multi-cloud architectures, Kubernetes clusters, and CI/CD pipelines.',
    coreMandatorySkills: [
      'aws',
      'docker',
      'kubernetes',
      'terraform',
      'ci_cd',
      'linux',
      'networking_cloud',
      'git'
    ],
    secondarySkills: [
      'azure',
      'gcp',
      'github_actions',
      'ansible',
      'monitoring',
      'serverless',
      'bash',
      'security',
      'system_design'
    ],
    sampleJobDescription: `Title: Senior Cloud DevOps & Infrastructure Engineer
Location: San Jose, CA / Remote
Experience: 4-7 Years

Overview:
We are looking for a Senior Cloud Engineer to drive our cloud modernization, infrastructure automation, and zero-downtime deployment pipelines. You will lead the architecture of secure, resilient AWS environments utilizing Kubernetes and Infrastructure as Code.

Responsibilities:
• Architect, provision, and maintain production multi-region cloud infrastructure using Terraform on AWS.
• Manage enterprise Kubernetes clusters (EKS), container networking, Helm charts, and ingress controllers.
• Build automated CI/CD deployment pipelines using GitHub Actions, ensuring security scanning and automated rollbacks.
• Implement observability, synthetic monitoring, and alerting dashboards using Prometheus, Grafana, and CloudWatch.
• Enforce cloud security posture: IAM least-privilege, VPC peering, secrets management (Vault), and compliance.
• Participate in 24/7 on-call rotations to maintain five-nines (99.999%) application availability.

Requirements:
• 4+ years of dedicated cloud engineering and DevOps experience in production environments.
• Expert-level proficiency with AWS core services (VPC, IAM, EKS, RDS, S3, CloudFront).
• Proven mastery in Terraform for reproducible Infrastructure as Code (IaC).
• Strong Linux systems administration, bash scripting, and networking fundamentals.
• Industry certification (AWS Certified Solutions Architect or CKA) is highly regarded.`
  },
  {
    id: 'web_developer',
    title: 'Web Developer',
    icon: '🌐',
    category: 'Web & Mobile',
    defaultJobTitle: 'Senior Frontend & Web Developer — React / Next.js',
    description: 'Constructs fast, accessible, interactive web applications and portals using modern HTML5, CSS3, JavaScript/TypeScript, and React.',
    coreMandatorySkills: [
      'javascript',
      'typescript',
      'react',
      'html_css',
      'responsive_design',
      'rest_api',
      'git',
      'unit_testing'
    ],
    secondarySkills: [
      'nextjs',
      'nodejs',
      'tailwind',
      'vuejs',
      'graphql',
      'agile',
      'problem_solving',
      'documentation'
    ],
    sampleJobDescription: `Title: Senior Frontend & Web Developer (React / TypeScript)
Location: Los Angeles, CA / Remote
Experience: 3-5 Years

Role Summary:
Our digital experience team is looking for a passionate Senior Web Developer to build beautiful, snappy, and accessible user interfaces. You will collaborate with UX designers and backend engineers to craft engaging web experiences that delight millions of users.

What You Will Build:
• Develop responsive, high-performance web components using React, TypeScript, and modern CSS.
• Integrate with RESTful and GraphQL APIs, managing client-side caching and state (TanStack Query, Zustand).
• Ensure exceptional accessibility (WCAG 2.1 AA compliance) and cross-browser responsiveness.
• Optimize Core Web Vitals, page load performance, bundle sizes, and image delivery.
• Write robust unit and component tests using Vitest / Jest and React Testing Library.

Qualifications:
• 3+ years of professional front-end web development experience.
• Mastery in modern JavaScript (ES6+), TypeScript, semantic HTML5, and advanced CSS (Flexbox, Grid, CSS Variables).
• Deep expertise with React ecosystem, component lifecycles, and custom hooks.
• Experience with build tools (Vite, Webpack) and version control (Git).
• A sharp eye for design details, typography, smooth micro-interactions, and usability.`
  }
];

// Helper to look up role by ID
export const getRoleById = (roleId) => {
  return JOB_ROLES.find(r => r.id === roleId) || JOB_ROLES[0];
};
