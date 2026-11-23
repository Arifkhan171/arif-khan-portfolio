// Text that only the case-study pages show, keyed by featured project id.
// Kept apart from content.ts on purpose: content.ts is in the main bundle, this file is not.
// Import it only from CaseStudy.tsx and scripts/validate-content.ts.
// A definition's key must be the exact `label` of a metric in content.ts (the validator checks it).
import type { CaseStudyDetails } from "../types/content.ts";

export const caseStudies: Readonly<Record<string, CaseStudyDetails>> = {
  "uoli-ai-assistant": {
    status: "In production",
    definitions: {
      "documents indexed": "University pages and files the assistant can search.",
      "specialized pipelines":
        "Separate agents for admissions, scheduling, academic support, FAQ and more.",
      "departments served": "University departments whose questions the assistant answers.",
      "RAGAS faithfulness": "Share of the answer's claims supported by the retrieved documents.",
      "answer relevancy": "How directly the answer addresses the question.",
      "context recall": "Share of the needed facts that retrieval actually found.",
    },
    decisions: [
      {
        title: "One supervisor, six specialized pipelines",
        why: "Admissions, fees, timetables and policies live in different documents and need different prompts. Separate pipelines can be tested and improved one at a time without breaking the others, and the supervisor only has to decide where each question goes.",
      },
      {
        title: "Hybrid search with re-ranking",
        why: "Students ask with exact names, course codes and fee terms that vector search alone can miss. BM25 catches the exact words, vector search catches the meaning, and a Cross-Encoder re-ranks the combined results so only the best passages reach the model.",
      },
      {
        title: "Measure every change before release",
        why: "Each change runs through RAGAS and DeepEval and every LLM call is traced in LangSmith, so an improvement is a measured number, not a feeling.",
      },
    ],
    improvements: [
      "Show the source document under each answer, so students can check it themselves.",
      "Build a larger test set from real student questions, so evaluation covers more edge cases.",
    ],
  },
  neuroai: {
    status: "Completed",
    resultsNote:
      "Dice measures the overlap between the model's tumor outline and the expert's, on held-out BraTS 2020 cases; 100% = identical.",
    definitions: {
      "BraTS 2020 training cases":
        "Expert-labeled brain MRI cases; 15% were held out for validation.",
      "radiomics features per scan":
        "Measurements of tumor shape, size and texture used for grade prediction.",
    },
    decisions: [
      {
        title: "Three models, averaged",
        why: "DynUNet, SwinUNETR and SegResNet each reach about 89–91% Whole Tumor Dice on their own. Averaging their per-voxel probabilities gives steadier tumor outlines and protects against one model's mistake on a hard scan.",
      },
      {
        title: "The same held-out split for every model",
        why: "All three models are validated on the same 15% of BraTS 2020 cases that they never trained on, so the comparison between them is fair.",
      },
      {
        title: "XGBoost with SHAP for the tumor grade",
        why: "The grade is one label per patient, so the data is small. A tree model on 30 measured tumor features fits that well, balanced class weights handle the HGG/LGG imbalance, 5-fold cross-validation checks it, and SHAP shows which features drove each prediction.",
      },
    ],
    improvements: [
      "Test on real hospital scans, not only the BraTS challenge data, before any clinical use.",
      "Make inference faster, so a full scan is analyzed in under a minute on a normal GPU.",
    ],
  },
  acadtrack: {
    status: "Completed",
    definitions: {
      "HEC formula compliance": "GPA and grade points follow the official HEC Pakistan formula.",
      "user roles with access control":
        "Student, Coordinator and Controller of Examinations each see only their own tools.",
    },
    decisions: [
      {
        title: "No language model in the grade math",
        why: "Parsing, the edge-case validation rules and the HEC GPA formula are plain Python inside LangGraph nodes. Grades must be exact and auditable, so a language model never decides a number.",
      },
      {
        title: "A human approves before anything is saved",
        why: "Flagged rows go to a coordinator, who approves each semester before results are written to the database. A wrong grade on a transcript is expensive to fix.",
      },
      {
        title: "QR-verified transcripts with an audit log",
        why: "Anyone can scan the QR code to confirm a transcript is genuine, and every change is logged with who made it.",
      },
    ],
    improvements: [
      "Check the calculator against a full past batch of official results.",
      "Read marks directly from the university's exam records instead of uploaded Excel files.",
    ],
  },
};
