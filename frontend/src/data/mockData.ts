import { EvaluationItem, MetricSummary, ScoreBucket, RubricDefinition } from '../types/evaluation';

export const IS_DEMO_DATA = true;
export const DEMO_DATA_NOTICE = 'Sample demonstration dataset for UI visualization. Database persistence and real NLP scoring will connect via the FastAPI service.';

// Zero / initial real metrics for when demonstration mode is off
export const emptyMetrics: MetricSummary = {
  totalEvaluations: 0,
  averageScore: 0,
  evaluatedAnswers: 0,
  pendingReviews: 0,
  totalChangePct: 0,
  avgScoreChangePct: 0,
  completionRatePct: 0,
};

// Simulated sample metrics strictly labeled for demonstration
export const sampleCohortMetrics: MetricSummary = {
  totalEvaluations: 1248,
  averageScore: 78.4,
  evaluatedAnswers: 1186,
  pendingReviews: 62,
  totalChangePct: 14.2,
  avgScoreChangePct: 2.8,
  completionRatePct: 95.0,
};

// Simulated score distribution for demonstration
export const mockScoreDistribution: ScoreBucket[] = [
  { range: '0–49', count: 48, percentage: 3.8, grade: 'F / Needs Support' },
  { range: '50–59', count: 96, percentage: 7.7, grade: 'D / Developing' },
  { range: '60–69', count: 215, percentage: 17.2, grade: 'C / Satisfactory' },
  { range: '70–79', count: 420, percentage: 33.7, grade: 'B / Proficient' },
  { range: '80–89', count: 348, percentage: 27.9, grade: 'A- / Advanced' },
  { range: '90–100', count: 121, percentage: 9.7, grade: 'A+ / Exemplary' },
];

export const mockCriteriaPerformance = [
  { criteria: 'Content Relevance', score: 84, benchmark: 75 },
  { criteria: 'Critical Analysis', score: 72, benchmark: 70 },
  { criteria: 'Coherence & Flow', score: 79, benchmark: 75 },
  { criteria: 'Vocabulary & Style', score: 81, benchmark: 72 },
  { criteria: 'Argument Evidence', score: 74, benchmark: 68 },
];

export const mockWeeklyTrends = [
  { week: 'Week 1', evaluations: 180, avgScore: 75.2 },
  { week: 'Week 2', evaluations: 220, avgScore: 76.5 },
  { week: 'Week 3', evaluations: 295, avgScore: 78.1 },
  { week: 'Week 4', evaluations: 265, avgScore: 77.8 },
  { week: 'Week 5', evaluations: 310, avgScore: 79.4 },
  { week: 'Week 6', evaluations: 348, avgScore: 78.4 },
];

export const mockRecentEvaluations: EvaluationItem[] = [
  {
    id: 'EVAL-9042',
    studentName: 'Aarav Sharma',
    studentId: 'STU-2024-089',
    assignmentTitle: 'Impact of Industrial Revolution on Urban Sociology',
    subject: 'Modern World History',
    submittedAt: '12 mins ago',
    score: 88,
    status: 'completed',
    rubricName: 'University Essay Standard Rubric',
    wordCount: 420,
    isSample: true,
    questionPrompt: 'Explain how the rapid migration toward factory cities in 19th century Britain restructured social hierarchies and family labor dynamics.',
    studentAnswer: 'The industrial boom compelled rural agrarian families into concentrated industrial clusters like Manchester and Birmingham. Rather than home-based cottage industry where family units worked communally, the steam-driven factories fractured domestic patterns. Children and women were recruited extensively into textile mills for lower wages, altering the traditional breadwinner hierarchy. Concurrently, a stark divide emerged between the rising capitalist bourgeoisie and the industrial proletariat, creating sanitary and sociological crises that catalyzed early labor reform legislation.',
    referenceAnswer: 'Expected key concepts: Agrarian to urban shift, cottage industries vs factory floor, role of women and children, emergence of proletariat vs industrial capitalist class, and early legislative reforms.',
    overallFeedback: 'Strong historical synthesis with precise terminology. Clearly explains the breakdown of cottage industries and labor restructuring.',
    strengths: [
      'Accurate reference to specific urban centers and demographic shifts.',
      'Clear differentiation between domestic cottage industry and mechanized labor.',
      'Sophisticated vocabulary and transition phrasing.'
    ],
    areasForImprovement: [
      'Could cite specific legislative acts (e.g., Factory Act of 1833) to substantiate reform points.',
    ],
    coveredConcepts: [
      'Agrarian to urban migration',
      'Fracturing of cottage industries',
      'Exploitation of women and child labor',
      'Bourgeoisie vs proletariat divide'
    ],
    missingConcepts: [
      'Specific statutory references (e.g., Factory Act of 1833)'
    ],
    criteriaScores: [
      { id: 'c1', name: 'Content Relevance', weight: 35, score: 92, description: 'Direct alignment with prompt requirements.' },
      { id: 'c2', name: 'Critical Analysis', weight: 25, score: 86, description: 'Depth of analytical insight vs mere summary.' },
      { id: 'c3', name: 'Structure & Flow', weight: 20, score: 88, description: 'Logical paragraph transitions and thesis support.' },
      { id: 'c4', name: 'Grammar & Mechanics', weight: 20, score: 85, description: 'Syntactic accuracy and academic diction.' },
    ],
  },
  {
    id: 'EVAL-9041',
    studentName: 'Elena Rostova',
    studentId: 'STU-2024-114',
    assignmentTitle: 'Photosynthesis & Light-Dependent Reactions',
    subject: 'Cellular Biology',
    submittedAt: '34 mins ago',
    score: 64,
    status: 'pending_review',
    rubricName: 'Scientific Mechanism Description Rubric',
    wordCount: 290,
    isSample: true,
    questionPrompt: 'Detail the electron transport chain within thylakoid membranes during the light-dependent reactions of oxygenic photosynthesis.',
    studentAnswer: 'Photons hit chlorophyll in photosystem 2 which energizes electrons. The electrons move through proteins in the membrane and make ATP by pumping hydrogen ions. Water is split into oxygen so we can breathe. Then electrons go to photosystem 1 to make NADPH for the Calvin cycle.',
    referenceAnswer: 'Expected key concepts: PSII (P680), photolysis of H2O generating O2 + H+ + e-, plastoquinone/cytochrome b6f complex, proton gradient driving ATP synthase, PSI (P700), ferredoxin-NADP+ reductase.',
    overallFeedback: 'Student grasps the macro trajectory of electron flow, but omitted technical protein complexes (cytochrome b6f, ATP synthase mechanism) and reaction centers (P680/P700). Flagged for educator confirmation.',
    strengths: [
      'Correct sequential flow from PSII to PSI.',
      'Identified photolysis and water breakdown products.'
    ],
    areasForImprovement: [
      'Incorporate molecular nomenclature such as cytochrome b6f and chemiosmosis.',
      'Clarify the electrochemical gradient driving ATP synthase.'
    ],
    coveredConcepts: [
      'Chlorophyll photo-excitation',
      'Water splitting (photolysis)',
      'ATP & NADPH synthesis'
    ],
    missingConcepts: [
      'Cytochrome b6f complex',
      'Chemiosmotic proton gradient details',
      'P680 / P700 reaction centers'
    ],
    criteriaScores: [
      { id: 'c1', name: 'Scientific Accuracy', weight: 40, score: 68, description: 'Factual correctness and biochemical fidelity.' },
      { id: 'c2', name: 'Terminology & Depth', weight: 30, score: 55, description: 'Accurate biological nomenclature.' },
      { id: 'c3', name: 'Sequential Coherence', weight: 30, score: 70, description: 'Chronological clarity of molecular stages.' },
    ],
  },
  {
    id: 'EVAL-9040',
    studentName: 'Marcus Vance',
    studentId: 'STU-2024-042',
    assignmentTitle: 'Ethical Dilemmas in Artificial Intelligence Governance',
    subject: 'Philosophy & Ethics',
    submittedAt: '1 hour ago',
    score: 93,
    status: 'completed',
    rubricName: 'Applied Ethics Analytical Rubric',
    wordCount: 510,
    isSample: true,
    questionPrompt: 'Contrast utilitarian and deontological frameworks in evaluating autonomous vehicle crash-avoidance algorithms.',
    studentAnswer: 'In autonomous vehicle navigation under unavoidable collision scenarios, utilitarianism dictates algorithmic optimization toward aggregate harm minimization—effectively implementing a quantitative calculus that prioritizes minimizing overall fatalities regardless of occupant status. Conversely, a Kantian deontological perspective asserts that humans must never be treated purely as instruments to a collective numerical end. Programming a vehicle to deliberately sacrifice its passenger to save three pedestrians violates the duty of non-instrumentalization. This philosophical tension reveals why utilitarian optimization encounters insurmountable constitutional and rights-based opposition in legal jurisprudence.',
    overallFeedback: 'Exceptional conceptual clarity. The comparative treatment of Kantian duties against utilitarian aggregate calculations is articulate and academically mature.',
    strengths: [
      'Clear definition of philosophical frameworks applied to autonomous dilemmas.',
      'Nuanced discussion of instrumentalization and moral duty.',
      'Flawless syntactic variety and persuasive tone.'
    ],
    areasForImprovement: [
      'Could touch on virtue ethics or contractualism as alternative modern paradigms.'
    ],
    coveredConcepts: [
      'Utilitarian aggregate harm minimization',
      'Kantian non-instrumentalization duty',
      'Autonomous collision trade-offs'
    ],
    missingConcepts: [
      'Alternative paradigms (virtue ethics, contractualism)'
    ],
    criteriaScores: [
      { id: 'c1', name: 'Philosophical Rigor', weight: 35, score: 95, description: 'Clarity of framework comparison.' },
      { id: 'c2', name: 'Argumentative Defense', weight: 30, score: 92, description: 'Logical defense of positions.' },
      { id: 'c3', name: 'Clarity & Synthesis', weight: 35, score: 93, description: 'Composition and synthesis.' },
    ],
  },
  {
    id: 'EVAL-9039',
    studentName: 'Devon K. Miller',
    studentId: 'STU-2024-219',
    assignmentTitle: 'Macroeconomic Effects of Quantitative Tightening',
    subject: 'Economics 301',
    submittedAt: '2 hours ago',
    score: 76,
    status: 'completed',
    rubricName: 'Economics Analytical Rubric',
    wordCount: 380,
    isSample: true,
    questionPrompt: 'Evaluate how balance sheet normalization by central banks influences sovereign bond yields and private capital formation.',
    studentAnswer: 'When central banks sell bonds or let them mature without reinvestment, the supply of government debt on the secondary market increases. This pushes bond prices downward and forces yields upward. As risk-free rates rise, borrowing costs for private firms expand, dampening capital expenditure. While this curbs inflation expectations, prolonged tightening risks slowing down business investment.',
    overallFeedback: 'Solid foundational analysis. Accurately links open market sales to yield curve dynamics and corporate debt issuance costs.',
    strengths: [
      'Direct link between bond supply, price, and yield mechanics.',
      'Proper economic context on capital expenditure slowdown.'
    ],
    areasForImprovement: [
      'Expand on transmission channels such as mortgage-backed securities and foreign exchange flows.'
    ],
    coveredConcepts: [
      'Open market sales & bond yields',
      'Corporate borrowing cost transmission',
      'Capital expenditure reduction'
    ],
    missingConcepts: [
      'Mortgage-backed securities impact',
      'Foreign exchange rate transmission'
    ],
    criteriaScores: [
      { id: 'c1', name: 'Economic Theory', weight: 40, score: 78, description: 'Accuracy of macroeconomic principles.' },
      { id: 'c2', name: 'Causal Chain Logic', weight: 30, score: 76, description: 'Step-by-step transmission mechanisms.' },
      { id: 'c3', name: 'Clarity & Presentation', weight: 30, score: 74, description: 'Clear structured exposition.' },
    ],
  },
  {
    id: 'EVAL-9038',
    studentName: 'Priya N. Patel',
    studentId: 'STU-2024-305',
    assignmentTitle: 'Literary Symbolism in The Great Gatsby',
    subject: 'American Literature',
    submittedAt: '3 hours ago',
    score: 52,
    status: 'flagged',
    rubricName: 'Literary Critique Rubric',
    wordCount: 220,
    isSample: true,
    questionPrompt: 'Discuss the symbolic evolution of the green light at the end of Daisy’s dock across the novel’s climax.',
    studentAnswer: 'The green light represents Gatsby’s dreams and the American dream. He looks at it across the water from his house. In the end it is gone because Daisy chose Tom and Gatsby died in his pool. It shows money cannot buy love.',
    overallFeedback: 'Overly brief and reliant on cliché phrasing. Lacks textual citations and does not trace how the symbol shifts from an active beacon of yearning into an unreachable nostalgic artifact.',
    strengths: [
      'Correctly identifies the core symbolic association with unattainable dreams.'
    ],
    areasForImprovement: [
      'Provide close textual analysis of Nick Carraway’s closing reflection on the Dutch sailors.',
      'Deepen the contrast between Daisy the individual and Daisy the idealized beacon.'
    ],
    coveredConcepts: [
      'Symbol of the green light',
      'Yearning for the American dream'
    ],
    missingConcepts: [
      'Textual quotations and close analysis',
      'Evolution from physical beacon to intangible nostalgia',
      'Closing Dutch sailors metaphor'
    ],
    criteriaScores: [
      { id: 'c1', name: 'Textual Depth & Quotes', weight: 40, score: 45, description: 'Evidence-based textual commentary.' },
      { id: 'c2', name: 'Thematic Insight', weight: 35, score: 56, description: 'Sophistication of literary interpretation.' },
      { id: 'c3', name: 'Academic Prose', weight: 25, score: 58, description: 'Command of critical vocabulary.' },
    ],
  },
  {
    id: 'EVAL-9037',
    studentName: 'Julian C. Morales',
    studentId: 'STU-2024-067',
    assignmentTitle: 'Distributed Systems: CAP Theorem Tradeoffs',
    subject: 'Computer Science',
    submittedAt: '4 hours ago',
    score: 82,
    status: 'completed',
    rubricName: 'Technical Case Analysis Rubric',
    wordCount: 350,
    isSample: true,
    questionPrompt: 'Contrast CP and AP database architectures in the presence of a network partition, citing real-world engineering instances.',
    studentAnswer: 'In distributed storage systems, network partitions are an inevitable physical reality. When a partition occurs, a CP system (such as Apache HBase or etcd) prioritizes data consistency by refusing read/write operations on isolated nodes to prevent split-brain state, sacrificing availability. In contrast, an AP system (such as Apache Cassandra or DynamoDB) accepts writes on partitioned replicas to ensure high availability, sacrificing immediate consistency in favor of eventual convergence using vector clocks or last-write-wins.',
    overallFeedback: 'Well structured and technically accurate. Good citations of specific distributed systems like etcd and Cassandra.',
    strengths: [
      'Clear definition of consistency sacrifice vs availability sacrifice during network partition.',
      'Appropriate industry architecture examples.'
    ],
    areasForImprovement: [
      'Could mention PACELC theorem as an extension for non-partition latency tradeoffs.'
    ],
    coveredConcepts: [
      'CAP theorem definitions under partition',
      'CP consistency guarantee (etcd, HBase)',
      'AP availability guarantee (Cassandra, DynamoDB)'
    ],
    missingConcepts: [
      'PACELC theorem extensions'
    ],
    criteriaScores: [
      { id: 'c1', name: 'Technical Accuracy', weight: 40, score: 85, description: 'Factual engineering validity.' },
      { id: 'c2', name: 'Comparative Reasoning', weight: 35, score: 80, description: 'Systematic contrast of architectures.' },
      { id: 'c3', name: 'Conciseness & Diction', weight: 25, score: 80, description: 'Direct, unambiguous terminology.' },
    ],
  },
];

export const mockRubrics: RubricDefinition[] = [
  {
    id: 'rubric-1',
    title: 'University Essay Standard Rubric',
    description: 'Comprehensive 4-dimension evaluation criteria for academic essays and argumentative synthesis.',
    subject: 'Humanities & Social Sciences',
    createdAt: '2026-09-15',
    totalSubmissions: 642,
    criteria: [
      { id: 'r1-c1', name: 'Content Relevance', weight: 35, description: 'Direct alignment with prompt requirements and depth of source material.' },
      { id: 'r1-c2', name: 'Critical Analysis', weight: 25, description: 'Analytical reasoning, synthesis of multiple perspectives, and original insight.' },
      { id: 'r1-c3', name: 'Structure & Flow', weight: 20, description: 'Cohesive transitions, logical progression, and paragraph architecture.' },
      { id: 'r1-c4', name: 'Grammar & Mechanics', weight: 20, description: 'Syntactic precision, academic diction, and absence of stylistic errors.' },
    ],
  },
  {
    id: 'rubric-2',
    title: 'Scientific Mechanism Description Rubric',
    description: 'Targeted for STEM descriptive assessments requiring precise molecular and biochemical pathways.',
    subject: 'Natural Sciences & Biology',
    createdAt: '2026-10-01',
    totalSubmissions: 318,
    criteria: [
      { id: 'r2-c1', name: 'Scientific Accuracy', weight: 40, description: 'Factual correctness of biological or physical mechanisms.' },
      { id: 'r2-c2', name: 'Terminology & Depth', weight: 30, description: 'Use of proper domain vocabulary and chemical/molecular nomenclature.' },
      { id: 'r2-c3', name: 'Sequential Coherence', weight: 30, description: 'Accurate chronological sequencing of stages and causal links.' },
    ],
  },
  {
    id: 'rubric-3',
    title: 'Short Answer Conceptual Rubric',
    description: 'Optimized for quick diagnostic descriptive responses and mid-term conceptual checks.',
    subject: 'General Education',
    createdAt: '2026-10-10',
    totalSubmissions: 288,
    criteria: [
      { id: 'r3-c1', name: 'Concept Definition', weight: 50, description: 'Accurate and concise encapsulation of the core concept.' },
      { id: 'r3-c2', name: 'Illustrative Example', weight: 30, description: 'Provision of a valid contextualizing scenario or real-world example.' },
      { id: 'r3-c3', name: 'Conciseness & Clarity', weight: 20, description: 'Clarity without fluff or circular reasoning.' },
    ],
  },
];
