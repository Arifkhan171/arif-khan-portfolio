// The single content file for the whole site. Edit text here, not in components.
// To add a project, copy an object in `projects` below. See "Editing content" in README.md.
// Relative type-only import on purpose: scripts/validate-content.ts loads this file with plain Node.
import type { SiteContent } from "../types/content.ts";

const GITHUB = "https://github.com/Arifkhan171";

export const content = {
  // ---------------------------------------------------------------- site
  site: {
    title: "Arif Khan | Agentic AI Engineer",
    description:
      "Portfolio of Arif Khan, an Agentic AI Engineer building production multi-agent LLM systems, RAG pipelines and medical deep learning.",
    url: "https://arif-khan-portfolio.vercel.app", // placeholder, confirmed in Spec 10
    language: "en",
  },

  // ------------------------------------------------------------- profile
  profile: {
    name: "Arif Khan",
    title: "Agentic AI Engineer",
    tagline:
      "I build production LLM systems end to end: multi-agent workflows, RAG pipelines and medical deep learning.",
    summary:
      "AI Engineer at the University of Loralai, where I build and run a production multi-agent chatbot used across 10 university departments. Building AI systems since 2023, with a BS in Computer Science (CGPA 3.73).",
    location: "Loralai, Balochistan, Pakistan",
    availability: "Open to remote AI roles",
    buildingSince: 2023,
    email: "arifeng171@gmail.com",
    links: {
      github: GITHUB,
      linkedin: "https://www.linkedin.com/in/arif-khan-ai-engineer",
    },
    stats: [
      { value: "7,021", label: "documents indexed in production RAG" },
      { value: "10", label: "university departments served" },
      { value: ">89%", label: "Whole Tumor Dice (brain MRI)" },
      { value: "0.85", label: "RAGAS faithfulness (up from 0.75)" },
    ],
  },

  // ------------------------------------------------------------ projects
  projects: [
    // ---- featured ----
    {
      id: "uoli-ai-assistant",
      title: "UOLI AI Assistant",
      subtitle: "Production multi-agent university chatbot",
      tier: "featured",
      order: 1,
      summary:
        "A multi-agent LLM chatbot that answers admissions, scheduling, academic and FAQ questions for 10 departments at the University of Loralai, grounded in 7,021 indexed documents.",
      problem:
        "Students and staff had to search hundreds of pages and contact several offices to find answers about admissions, schedules, fees and policies.",
      role: "AI Engineer (architect and lead developer)",
      period: { start: "2025-02", end: "present" },
      metrics: [
        { value: "7,021", label: "documents indexed" },
        { value: "6", label: "specialized pipelines" },
        { value: "10", label: "departments served" },
        { value: "0.75 → 0.85", label: "RAGAS faithfulness" },
        { value: "0.77 → 0.87", label: "answer relevancy" },
        { value: "0.60 → 0.85", label: "context recall" },
      ],
      highlights: [
        "Supervisor pattern routing queries across 6 specialized pipelines (admissions, scheduling, academic support, FAQ and more)",
        "Graph RAG with BM25 + vector hybrid search and Cross-Encoder re-ranking on ChromaDB and Redis",
        "Raised RAGAS and DeepEval scores through iterative prompt engineering and retrieval tuning",
        "Every LLM call traced in LangSmith to detect and reduce hallucinations",
        "Fully containerized with Docker; worked with faculty stakeholders from requirements to production launch",
      ],
      architecture: [
        "User question",
        "Supervisor agent routes to one of 6 pipelines",
        "Hybrid retrieval (BM25 + vector + Graph RAG)",
        "Cross-Encoder re-ranking",
        "LLM answer streamed to the user",
        "Redis caching",
        "LangSmith tracing",
      ],
      tech: [
        "LangChain",
        "LangGraph",
        "LangSmith",
        "FastAPI",
        "ChromaDB",
        "Redis",
        "Graph RAG",
        "BM25",
        "Cross-Encoder",
        "RAGAS",
        "DeepEval",
        "Docker",
      ],
      images: [
        {
          src: "/images/projects/uoli-ai-assistant/01-chat-welcome.webp",
          alt: "UOLI AI Assistant chat interface welcome screen",
          caption: "University-branded chat UI with session history and live system status",
        },
        {
          src: "/images/projects/uoli-ai-assistant/02-multi-turn-qa.webp",
          alt: "Multi-turn conversation answering university questions",
          caption: "Multi-turn answers on admissions, fees and faculty from 7,021 documents",
        },
      ],
      video: { youtubeId: "YpSCygFuMA8", title: "UOLI AI Assistant demo" },
      repo: {
        visibility: "private",
        note: "Private university project. Code walkthrough available on request.",
      },
    },
    {
      id: "neuroai",
      title: "NeuroAI",
      subtitle: "Brain tumor segmentation and analysis system",
      tier: "featured",
      order: 2,
      summary:
        "A clinical AI pipeline that segments brain tumors from MRI scans with a 3-model deep learning ensemble and produces grade predictions, radiomics and PDF reports automatically.",
      problem:
        "Manual tumor segmentation in brain MRI is slow and varies between experts, and turning scans into a clinical report takes many manual steps.",
      role: "Team Lead (team of 3)",
      period: { start: "2025-01", end: "2026-07" },
      metrics: [
        { value: ">89%", label: "Whole Tumor Dice" },
        { value: ">85%", label: "Tumor Core Dice" },
        { value: ">77%", label: "Enhancing Tumor Dice" },
        { value: "369", label: "BraTS 2020 training cases" },
        { value: "30", label: "radiomics features per scan" },
      ],
      highlights: [
        "Ensemble of DynUNet, SwinUNETR and SegResNet trained on BraTS 2020",
        "Interactive 3D MRI viewer with multi-year scan history comparison",
        "XGBoost grade classifier with SHAP explainability",
        "Automated PDF clinical reports",
        "Deployed with Docker for end-to-end inference without manual steps",
      ],
      architecture: [
        "MRI upload",
        "Preprocessing",
        "3-model ensemble segmentation",
        "Radiomics extraction (30 features)",
        "XGBoost grade prediction + SHAP",
        "3D viewer and PDF report",
      ],
      tech: ["PyTorch", "TensorFlow", "MONAI", "XGBoost", "SHAP", "FastAPI", "Streamlit", "Docker"],
      images: [
        {
          src: "/images/projects/neuroai/01-mri-viewer.webp",
          alt: "Three-plane MRI viewer with tumor overlay",
          caption: "Axial, coronal and sagittal views with color-coded tumor regions",
        },
        {
          src: "/images/projects/neuroai/02-patient-registration.webp",
          alt: "Patient registration and MRI upload form",
          caption: "Patient details flow automatically into reports and records",
        },
        {
          src: "/images/projects/neuroai/03-mri-upload.webp",
          alt: "MRI upload portal",
          caption: "MRI upload step of the pipeline",
        },
        {
          src: "/images/projects/neuroai/04-habitat-map.webp",
          alt: "Tumor habitat map overlay on an MRI slice",
          caption: "K-means tumor habitat clustering shown on the MRI",
        },
        {
          src: "/images/projects/neuroai/05-habitat-stats.webp",
          alt: "Tumor habitat statistics",
          caption: "Statistics for each tumor habitat zone",
        },
        {
          src: "/images/projects/neuroai/06-grade-prediction.webp",
          alt: "High-grade vs low-grade tumor prediction",
          caption: "XGBoost grade prediction with SHAP explanation",
        },
        {
          src: "/images/projects/neuroai/07-compare-visits.webp",
          alt: "Comparison of scans across patient visits",
          caption: "Longitudinal tumor tracking across visits",
        },
      ],
      video: { youtubeId: "zeKYup9Rga8", title: "NeuroAI demo" },
      repo: { visibility: "public", url: `${GITHUB}/brain-tumor-segmentation` },
    },
    {
      id: "acadtrack",
      title: "AcadTrack",
      subtitle: "Agentic GPA calculation system",
      tier: "featured",
      order: 3,
      summary:
        "An autonomous LangGraph workflow that calculates GPA, parses transcripts and analyzes academic performance, with 100% compliance with HEC Pakistan grading rules.",
      problem:
        "GPA calculation and transcript preparation were manual, slow and error-prone for university coordinators and examination staff.",
      role: "AI Engineer",
      period: { start: "2025-09", end: "2026-01" },
      metrics: [
        { value: "100%", label: "HEC formula compliance" },
        { value: "3", label: "user roles with access control" },
      ],
      highlights: [
        "Autonomous LangGraph pipeline for GPA calculation, transcript parsing and performance analysis",
        "Calculation logic validated against official HEC Pakistan grading rubrics",
        "Conversational Streamlit interface: students ask about standing, semesters and degree progress in plain language",
        "Role-based access (Student, Coordinator, Controller of Examinations)",
        "QR-verified PDF transcripts with full audit logging",
      ],
      architecture: [
        "Mark sheets in",
        "Validation agent",
        "GPA/CGPA calculation (HEC formula)",
        "Coordinator review",
        "Transcript generation with QR verification",
        "Role-based dashboards",
      ],
      tech: ["Python", "LangChain", "LangGraph", "SQLAlchemy", "PostgreSQL", "Streamlit"],
      images: [
        {
          src: "/images/projects/acadtrack/01-coordinator-dashboard.webp",
          alt: "Coordinator dashboard for uploading mark sheets",
          caption: "Coordinators upload and approve semester mark sheets before GPA calculation",
        },
        {
          src: "/images/projects/acadtrack/02-student-grades.webp",
          alt: "Student grades view with CGPA",
          caption: "Students see CGPA, semester breakdown and letter grades",
        },
        {
          src: "/images/projects/acadtrack/03-transcripts.webp",
          alt: "Transcript management panel",
          caption: "Controller of Examinations generates and verifies official transcripts",
        },
        {
          src: "/images/projects/acadtrack/04-login.webp",
          alt: "Role-based login screen",
          caption: "Each role sees a different dashboard and permissions",
        },
      ],
      video: { youtubeId: "Z2Cbma3yKYY", title: "AcadTrack demo" },
      repo: { visibility: "public", url: `${GITHUB}/ai-gpa-automation-agent` },
    },

    // ---- other (smaller complete projects) ----
    {
      id: "student-performance-predictor",
      title: "Student Performance Predictor",
      subtitle: "Predicting student results with explainable ML",
      tier: "other",
      order: 1,
      summary:
        "Regression system predicting student results, with a Streamlit dashboard that flags at-risk students and explains predictions with SHAP.",
      problem: "Teachers need to spot at-risk students early, before final results.",
      role: "Solo project",
      period: { start: "2024-01", end: "2024-10" },
      metrics: [{ value: "98%", label: "R² score" }],
      highlights: [],
      tech: ["Python", "Scikit-learn", "XGBoost", "SHAP", "Streamlit"],
      images: [],
      repo: { visibility: "public", url: `${GITHUB}/student-performance-predictor` },
    },
    {
      id: "laptop-price-predictor",
      title: "Laptop Price Predictor",
      subtitle: "Laptop price estimation from hardware specs",
      tier: "other",
      order: 2,
      summary:
        "Benchmarked 5 regression models on 8 engineered features; real-time price estimates in under 500 ms across 20+ brands.",
      problem: "Laptop prices are hard to compare across brands and specifications.",
      role: "Solo project",
      period: { start: "2023-07", end: "2023-12" },
      metrics: [{ value: "0.88", label: "R² (Random Forest)" }],
      highlights: [],
      tech: ["Python", "Scikit-learn", "Random Forest", "Streamlit"],
      images: [],
      repo: { visibility: "public", url: `${GITHUB}/laptop-price-predictor` },
    },
    {
      id: "sms-spam-classifier",
      title: "SMS Spam Classifier",
      subtitle: "NLP spam detection for SMS messages",
      tier: "other",
      order: 3,
      summary:
        "NLP pipeline (tokenizing, stemming, TF-IDF) compared 11 classifiers; Naive Bayes chosen for zero false positives.",
      problem: "Spam messages waste time, and blocking a real message by mistake is costly.",
      role: "Solo project",
      metrics: [
        { value: "97%", label: "accuracy" },
        { value: "100%", label: "precision" },
      ],
      highlights: [],
      tech: ["Python", "NLTK", "Scikit-learn", "Naive Bayes", "Streamlit"],
      images: [],
      repo: { visibility: "public", url: `${GITHUB}/sms-spam-classifier` },
    },
    {
      id: "car-price-predictor",
      title: "Car Price Predictor",
      subtitle: "Used-car resale price prediction",
      tier: "other",
      order: 4,
      summary:
        "Predicts used-car resale prices from brand, year, mileage and fuel type with a Streamlit app.",
      problem: "Sellers and buyers of used cars lack a quick, fair price estimate.",
      role: "Solo project",
      metrics: [{ value: "0.83", label: "R²" }],
      highlights: [],
      tech: ["Python", "Scikit-learn", "Linear Regression", "Streamlit"],
      images: [],
      repo: { visibility: "public", url: `${GITHUB}/car-price-predictor` },
    },

    // ---- learning (practice repositories) ----
    {
      id: "pytorch-fundamentals",
      title: "PyTorch Fundamentals",
      subtitle: "Learning repository",
      tier: "learning",
      order: 1,
      summary:
        "A hands-on repository for mastering the core concepts and building blocks of PyTorch. A practical guide for beginners and intermediate practitioners moving from machine learning theory to production-ready deep learning code.",
      metrics: [],
      highlights: [],
      tech: ["Python", "PyTorch"],
      images: [],
      repo: { visibility: "public", url: `${GITHUB}/pytorch-fundamentals` },
    },
    {
      id: "ml-algorithms",
      title: "ML Algorithms",
      subtitle: "Learning repository",
      tier: "learning",
      order: 2,
      summary:
        "Complete ML algorithms: regression, classification, ensemble methods and clustering with real datasets.",
      metrics: [],
      highlights: [],
      tech: ["Python", "Scikit-learn"],
      images: [],
      repo: { visibility: "public", url: `${GITHUB}/ml-algorithms` },
    },
    {
      id: "ml-feature-engineering",
      title: "ML Feature Engineering",
      subtitle: "Learning repository",
      tier: "learning",
      order: 3,
      summary:
        "Complete ML feature engineering: scaling, encoding, missing values, outlier removal, transformation, datetime features and pipelines.",
      metrics: [],
      highlights: [],
      tech: ["Python", "Pandas", "Scikit-learn"],
      images: [],
      repo: { visibility: "public", url: `${GITHUB}/ml-feature-engineering` },
    },
    {
      id: "pandas-fundamentals",
      title: "Pandas Fundamentals",
      subtitle: "Learning repository",
      tier: "learning",
      order: 4,
      summary:
        "Complete Pandas practice: Series, DataFrame, data cleaning, groupby, merge, concat, pivot and CSV handling with real datasets.",
      metrics: [],
      highlights: [],
      tech: ["Python", "Pandas"],
      images: [],
      repo: { visibility: "public", url: `${GITHUB}/pandas-fundamentals` },
    },
    {
      id: "numpy-fundamentals",
      title: "NumPy Fundamentals",
      subtitle: "Learning repository",
      tier: "learning",
      order: 5,
      summary:
        "Complete NumPy practice: array operations, indexing, slicing, matrix operations and more.",
      metrics: [],
      highlights: [],
      tech: ["Python", "NumPy"],
      images: [],
      repo: { visibility: "public", url: `${GITHUB}/numpy-fundamentals` },
    },
    {
      id: "matplotlib-fundamentals",
      title: "Matplotlib Fundamentals",
      subtitle: "Learning repository",
      tier: "learning",
      order: 6,
      summary:
        "Complete Matplotlib visualization: bar, pie, scatter, histogram, subplots, annotations and more.",
      metrics: [],
      highlights: [],
      tech: ["Python", "Matplotlib"],
      images: [],
      repo: { visibility: "public", url: `${GITHUB}/matplotlib-fundamentals` },
    },
    {
      id: "seaborn-fundamentals",
      title: "Seaborn Fundamentals",
      subtitle: "Learning repository",
      tier: "learning",
      order: 7,
      summary:
        "Complete Seaborn visualization: scatter, line, histogram, box, violin, heatmap, pairplot and more, using the real Penguins dataset.",
      metrics: [],
      highlights: [],
      tech: ["Python", "Seaborn"],
      images: [],
      repo: { visibility: "public", url: `${GITHUB}/seaborn-fundamentals` },
    },
    {
      id: "python-oop-fundamentals",
      title: "Python OOP Fundamentals",
      subtitle: "Learning repository",
      tier: "learning",
      order: 8,
      summary:
        "Complete Python OOP practice: classes, inheritance, polymorphism, encapsulation, abstraction, aggregation and more.",
      metrics: [],
      highlights: [],
      tech: ["Python"],
      images: [],
      repo: { visibility: "public", url: `${GITHUB}/python-oop-fundamentals` },
    },
  ],

  // ---------------------------------------------------------- experience
  experience: [
    {
      role: "AI Engineer",
      organization: "University of Loralai",
      location: "Loralai, Pakistan",
      employmentType: "Paid position",
      period: { start: "2025-02", end: "present" },
      highlights: [
        "Architected a production multi-agent LLM chatbot (LangChain, LangGraph, FastAPI) with a Supervisor pattern across 6 specialized pipelines, serving 10 departments",
        "Built Graph RAG with BM25 hybrid search and Cross-Encoder re-ranking on ChromaDB and Redis, indexing 7,021 documents across 500+ pages",
        "Raised RAGAS scores: Faithfulness 0.75 → 0.85, Answer Relevancy 0.77 → 0.87, Context Recall 0.60 → 0.85; monitored all LLM calls with LangSmith",
        "Containerized the system with Docker and coordinated all release cycles",
        "Worked with faculty stakeholders from requirements to production launch, with biweekly milestone updates",
      ],
      tech: [
        "LangChain",
        "LangGraph",
        "LangSmith",
        "FastAPI",
        "ChromaDB",
        "Redis",
        "Docker",
        "RAGAS",
        "DeepEval",
      ],
    },
  ],

  // ----------------------------------------------------------- education
  education: [
    {
      degree: "BS Computer Science",
      institution: "University of Loralai",
      period: { start: "2022-08", end: "2026-08" },
      grade: "CGPA 3.73 / 4.0",
      coursework: [
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing",
        "Data Structures and Algorithms",
        "Database Systems",
        "Software Engineering",
      ],
    },
  ],

  // ------------------------------------------------------------ timeline
  timeline: [
    { year: 2022, title: "Started BS Computer Science", description: "University of Loralai" },
    {
      year: 2023,
      title: "First machine learning projects",
      description: "Laptop Price Predictor and core ML foundations",
    },
    { year: 2024, title: "Applied ML", description: "Student Performance Predictor (98% R²)" },
    {
      year: 2025,
      title: "AI Engineer, University of Loralai",
      description: "Production multi-agent chatbot and NeuroAI team lead",
    },
    { year: 2026, title: "Graduated, CGPA 3.73", description: "Open to remote AI roles" },
  ],

  // -------------------------------------------------------------- skills
  skills: [
    {
      name: "LLM & Agentic AI",
      items: [
        "LangChain",
        "LangGraph",
        "LangSmith",
        "Multi-Agent Systems",
        "Tool Calling",
        "Prompt Engineering",
        "OpenAI API",
        "Claude API",
        "Hugging Face Transformers",
      ],
    },
    {
      name: "RAG & Vector Databases",
      items: [
        "Graph RAG",
        "Hybrid Search (BM25 + Vector)",
        "ChromaDB",
        "Redis",
        "FAISS",
        "Embeddings",
        "Parent-Child Retrieval",
        "Cross-Encoder Re-Ranking",
      ],
    },
    {
      name: "Evaluation & Observability",
      items: ["RAGAS", "DeepEval", "LangSmith Tracing", "Hallucination Detection"],
    },
    {
      name: "Deep Learning & ML",
      items: [
        "PyTorch",
        "TensorFlow",
        "MONAI",
        "Scikit-learn",
        "XGBoost",
        "Computer Vision",
        "Image Segmentation",
        "NLP",
      ],
    },
    {
      name: "Backend & MLOps",
      items: ["Python", "FastAPI", "Docker", "GitHub Actions", "SQL", "PostgreSQL", "Streamlit"],
    },
    {
      name: "Data & Visualization",
      items: ["NumPy", "Pandas", "Matplotlib", "Seaborn", "Plotly", "SHAP"],
    },
  ],
} as const satisfies SiteContent;
