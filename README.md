
# EvalWrite AI
### Explainable NLP-Assisted Evaluation of Descriptive Answers

<p align="center">
  <strong>Making written-answer assessment more consistent, transparent, and actionable.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-Next.js-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/Language-Python-3776AB?logo=python" alt="Python">
  <img src="https://img.shields.io/badge/Domain-Natural%20Language%20Processing-527C70" alt="NLP">
  <img src="https://img.shields.io/badge/Status-In%20Development-orange" alt="Status">
</p>

---

## 1. Project Overview

**EvalWrite AI** is an NLP-based academic assessment platform designed to assist educators in evaluating descriptive answers. The project aims to move beyond simple keyword matching by considering semantic similarity, expected concepts, and configurable evaluation rubrics.

The platform is designed to provide suggested scores, criterion-level insights, and actionable feedback while keeping educators involved in final assessment decisions.

**Our vision:** Make descriptive answer evaluation more efficient, consistent, transparent, and explainable.

> **Implementation note:** The dashboard currently includes demonstration metrics and sample records. These are not measured model results. NLP scoring, persistent storage, and end-to-end evaluation should be described as completed only after they have been implemented and verified.

---

## 2. Problem Statement

Traditional descriptive answer evaluation can be time-consuming, particularly when educators need to review large numbers of student submissions.

Exact keyword matching may fail to recognize correct answers expressed in different words. Manual scoring can also vary between evaluators, and students may not always receive detailed feedback explaining their strengths and weaknesses.

EvalWrite AI aims to address these challenges through an NLP-assisted evaluation workflow that considers reference answers, expected concepts, and rubric-based criteria.

### Key Challenges

- Time-consuming manual evaluation.
- Difficulty recognizing semantically correct answers with different wording.
- Inconsistent application of marking criteria.
- Limited visibility into missing concepts and improvement areas.
- Difficulty reviewing trends across multiple submissions.

---

## 3. Project Objectives

- Develop a clean, responsive web platform for descriptive answer evaluation.
- Support reference-answer-aware assessment.
- Explore semantic similarity techniques for comparing student and reference answers.
- Provide configurable rubrics with weighted assessment criteria.
- Generate interpretable feedback about answer strengths and missing concepts.
- Maintain searchable evaluation history and assessment analytics.
- Keep educators responsible for reviewing and confirming suggested scores.

---

## 4. Key Features

| Module | Description |
|---|---|
| Dashboard | Displays assessment summaries, score distributions, criterion breakdowns, and recent records. |
| Evaluate Answer | Accepts the question prompt, subject, reference answer, rubric, and student response. |
| Rubric Builder | Supports defining assessment criteria and configuring their weights. |
| Submission History | Provides a structured interface for searching, filtering, and inspecting evaluation records. |
| Analytics | Presents score distributions and criterion-level summaries. |
| Authentication | Includes login and signup interfaces; verify backend authentication and session security before deployment. |

### Evaluation Workflow

1. Select or configure an evaluation rubric.
2. Enter the question and optional reference answer.
3. Submit the student's descriptive response.
4. Analyze the response using the configured NLP pipeline.
5. Calculate suggested criterion-level scores.
6. Present feedback and missing concepts, where supported by the implementation.
7. Allow an educator to review the suggested evaluation.

---

## 5. Application Screenshots

Screenshots help reviewers understand the interface and workflow without running the project locally.

Create the following folder in the repository:

`docs/screenshots/`

Recommended screenshots:

| Screenshot | File Name |
|---|---|
| Main dashboard | `dashboard.png` |
| Answer evaluation form | `evaluate-answer.png` |
| Rubric builder | `rubric-builder.png` |
| Submission history | `submission-history.png` |
| Analytics dashboard | `analytics.png` |
| Login page | `login.png` |
| Signup page | `signup.png` |

Once the actual screenshots have been saved and committed, display them here.

### Dashboard

![EvalWrite AI Dashboard](docs/screenshots/dashboard.png)

### Answer Evaluation

![Answer Evaluation Interface](docs/screenshots/evaluate-answer.png)

### Rubric Builder

![Rubric Builder Interface](docs/screenshots/rubric-builder.png)

### Submission History

![Submission History Interface](docs/screenshots/submission-history.png)

### Analytics

![Analytics Dashboard](docs/screenshots/analytics.png)

**Important:** Add the screenshot files to the repository before using these image links. Otherwise, GitHub will display broken images.

---

## 6. Technology Stack

### Frontend
- **Next.js** — React framework and application routing.
- **React** — Component-based user interface.
- **TypeScript** — Type-safe application development.
- **Tailwind CSS and project CSS** — Responsive styling.
- **Recharts** — Data visualization.
- **Lucide React** — Interface icons.

### Backend
- **Python** — Backend and NLP development.
- **FastAPI** — REST API framework.
- **Pydantic** — Request and data validation.
- **SQLAlchemy and SQLite** — Lightweight persistence options, where configured.
- **Pytest** — Backend testing.

### NLP and Machine Learning

The proposed NLP pipeline can explore:

- **TF-IDF:** Establishes a lexical similarity baseline.
- **Cosine Similarity:** Measures similarity between vector representations.
- **Sentence Transformers:** Generates semantic sentence embeddings.
- **Concept Coverage:** Identifies expected concepts addressed in a response.
- **Rubric-Weighted Scoring:** Combines criterion-level scores according to configured weights.

These techniques represent the intended evaluation approach. Actual model integration and measured performance must be verified separately.

---

## 7. System Architecture

```text
                 STUDENT / EDUCATOR
                         |
                         v
              +----------------------+
              |   Next.js Frontend   |
              |                      |
              | Dashboard            |
              | Evaluate Answer      |
              | Rubric Builder       |
              | History and Analytics|
              +----------+-----------+
                         |
                      HTTP/JSON
                         |
                         v
              +----------------------+
              |    FastAPI Backend  |
              |                      |
              | Request Validation   |
              | Authentication       |
              | Evaluation Endpoints |
              +----------+-----------+
                         |
              +----------+-----------+
              |                      |
              v                      v
      +----------------+    +------------------+
      | NLP Evaluation |    | Database Layer   |
      |                |    |                  |
      | Semantic       |    | Users            |
      | Similarity     |    | Rubrics          |
      | Concept        |    | Submissions      |
      | Coverage       |    | Evaluation Logs  |
      | Rubric Scoring |    | Where Implemented|
      +----------------+    +------------------+
```

This diagram describes the intended architecture. Confirm that each integration is implemented before presenting the complete architecture as operational.

---

## 8. Project Directory Structure

```text
EvalWrite-AI/
|
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |-- components/
|   |   |-- context/
|   |   |-- data/
|   |   |-- hooks/
|   |   `-- types/
|   |-- public/
|   |-- package.json
|   `-- ...
|
|-- backend/
|   |-- main.py
|   |-- .venv/              # Local only; not committed
|   |-- requirements.txt    # Add if not yet present
|   `-- ...
|
|-- docs/
|   `-- screenshots/
|
|-- .gitignore
`-- README.md
```

The exact structure may differ as the project evolves.

---

## 9. Installation and Setup

### Prerequisites

Install:

- Git
- Node.js and npm
- Python 3.11 or a version supported by the backend dependencies

### Step 1: Clone the Repository

```bash
git clone https://github.com/Hamzah1507/EvalWrite-AI.git
cd EvalWrite-AI
```

### Step 2: Set Up the Backend

Open PowerShell:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the project's backend dependencies from its dependency file. If `requirements.txt` is missing, create one from the actual packages used by the project.

```powershell
pip install -r requirements.txt
```

Start the backend:

```powershell
uvicorn main:app --reload --port 8000
```

Backend URL:

`http://127.0.0.1:8000`

Interactive API documentation:

`http://127.0.0.1:8000/docs`

### Step 3: Set Up the Frontend

Open a second terminal from the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the application:

`http://localhost:3000`

### Step 4: Run Frontend Checks

From the `frontend` directory:

```powershell
npm run lint
npx tsc --noEmit
npm run build
```

### Step 5: Run Backend Tests

From the `backend` directory, activate the virtual environment and run:

```powershell
python -m pytest
```

Run the tests and checks that are configured for the current codebase, and resolve failures before deployment.

---

## 10. API and Data Management

FastAPI provides the backend API foundation. The exact routes and supported operations should be confirmed through the running API documentation.

A complete evaluation endpoint should:

1. Validate the submitted question and answer.
2. Load the appropriate rubric and reference information.
3. Execute the configured NLP evaluation.
4. Return a suggested score and criterion-level feedback.
5. Persist the evaluation if database integration is enabled.
6. Distinguish machine-suggested marks from educator-confirmed marks.

Database persistence, authentication, and evaluation history must be tested independently before they are treated as production-ready.

---

## 11. NLP Evaluation Methodology

The project can be developed and assessed in progressive stages.

### Stage 1: Lexical Baseline

Use TF-IDF and cosine similarity to establish a baseline for comparing student responses with reference answers.

### Stage 2: Semantic Similarity

Use sentence embeddings to represent the meaning of the student answer and reference answer.

### Stage 3: Concept Coverage

Identify expected concepts addressed in the response and highlight important concepts that appear to be missing.

### Stage 4: Rubric-Based Scoring

Calculate criterion-level scores and combine them using configured rubric weights.

### Stage 5: Explainable Feedback

Present evidence for the suggested score, strengths, missing concepts, and actionable improvement recommendations.

The pipeline must be validated against labelled examples before its scores can be considered reliable.

---

## 12. Testing and Performance Evaluation

A credible evaluation system should be assessed against answers scored by human evaluators.

Recommended metrics include:

| Metric | Purpose |
|---|---|
| Mean Absolute Error (MAE) | Measures average absolute scoring error. |
| Root Mean Squared Error (RMSE) | Penalizes larger scoring errors more strongly. |
| Precision | Measures the proportion of predicted concepts that are correct. |
| Recall | Measures the proportion of expected concepts successfully identified. |
| F1 Score | Balances precision and recall. |
| Weighted Cohen's Kappa | Measures agreement for suitable ordinal scoring tasks. |

### Recommended Experiments

- Compare lexical similarity against semantic similarity.
- Evaluate responses with correct meaning but different wording.
- Test incomplete, irrelevant, contradictory, and ambiguous answers.
- Compare automated scores with human-assigned marks.
- Record model settings, dataset details, and test results.

**No accuracy or agreement percentage should be reported until it has been measured on a documented evaluation dataset.**

---

## 13. Security and Responsible Use

- Never commit `.env` files, passwords, tokens, or private credentials.
- Store password hashes instead of plaintext passwords.
- Validate input on the backend.
- Protect authenticated routes and private records.
- Use secure session handling and appropriate cookie settings.
- Disable development-only credentials and sample data in production.
- Restrict access to private rubrics, reference answers, and evaluation materials.
- Review automated scores before using them for consequential academic decisions.

NLP similarity does not guarantee factual correctness. Human oversight and transparent evaluation criteria remain essential.

---

## 14. Current Implementation Status

The project includes a responsive Next.js interface and a FastAPI backend foundation. The dashboard and related screens provide a visual demonstration of the intended assessment workflow.

The following milestones should be verified against the current codebase:

- [ ] Connect answer submission to the actual NLP scoring pipeline.
- [ ] Validate semantic similarity and rubric-weighted scoring.
- [ ] Implement and test persistent evaluation records.
- [ ] Verify authentication, session handling, and protected routes.
- [ ] Add actual screenshots to the repository.
- [ ] Compare model scores against human-assessed answers.
- [ ] Document reproducible evaluation results.
- [ ] Prepare secure production deployment configuration.

This checklist is intended to keep the project documentation aligned with the implementation.

---

## 15. Future Scope

Potential improvements include:

- Support for multiple subjects and custom rubrics.
- Improved semantic similarity and concept extraction.
- Teacher review and score-adjustment workflows.
- Exportable assessment reports.
- Student performance trends over time.
- Multilingual answer evaluation.
- More extensive validation against human-assessed datasets.
- Deployment with secure authentication and persistent database storage.

---

## 16. Project Team

| Enrollment Number | Team Member |
|---|---|
| 202201619010072 | **Saiyed Mohammed Hamzah Khalidmiya** |
| 202201619010107 | **Trivedi Naman Ravikumar** |
| 202201619010082 | **Shah Khush Prakashbhai** |
| 202201619010071 | **Raval Ved Sanjaybhai** |

---

## 17. Conclusion

EvalWrite AI explores how Natural Language Processing can support descriptive answer assessment through semantic analysis, structured rubrics, and interpretable feedback.

By combining a modern web interface with a Python API foundation, the project provides a basis for developing a transparent, educator-supervised evaluation workflow.

The long-term goal is not to replace educators, but to help them assess answers more efficiently while providing students with clearer, more actionable feedback.

---

<p align="center">
  <strong>EvalWrite AI</strong><br>
  <em>More transparent assessment. More actionable feedback.</em>
</p>
