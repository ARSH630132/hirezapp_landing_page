export type BlueprintAnswers = {
  industry: string;
  companySize: string;
  topPriorities: string[];
  aiJourney: string;
  dataReadiness: string;
  leadershipCommitment: string;
  biggestChallenge: string;
  email: string;
  otp?: string;
  budget?: string;
  geography?: string;
};

export const industryOptions = [
  { value: "Banking", label: "Banking" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Retail", label: "Retail" },
  { value: "Education", label: "Education" },
  { value: "Government", label: "Government" },
  { value: "Other", label: "Other" },
];

export const companySizeOptions = [
  { value: "<100", label: "<100 employees" },
  { value: "100-1000", label: "100 - 1,000 employees" },
  { value: "1000-10000", label: "1,000 - 10,000 employees" },
  { value: "10000+", label: "10,000+ employees" },
];

export const priorityOptions = [
  { value: "Cost Reduction", label: "Reduce Costs" },
  { value: "Revenue Growth", label: "Increase Revenue" },
  { value: "Productivity", label: "Improve Productivity" },
  { value: "Customer Experience", label: "Improve Customer Experience" },
  { value: "Automate Processes", label: "Automate Processes" },
  { value: "Compliance", label: "Strengthen Compliance" },
  { value: "AI Transformation", label: "AI Transformation" },
];

export const aiJourneyOptions = [
  { value: "Exploring AI", label: "Exploring AI" },
  { value: "Running Pilots", label: "Running Pilots" },
  { value: "Scaling AI", label: "Scaling AI" },
  { value: "AI-Driven Enterprise", label: "AI-Driven Enterprise" },
];

export const dataReadinessOptions = [
  { value: "Highly fragmented", label: "Highly fragmented" },
  { value: "Partially connected", label: "Partially connected" },
  { value: "Mostly integrated", label: "Mostly integrated (Mostly Integrated Data)" },
  { value: "Fully integrated", label: "Fully integrated" },
];

export const leadershipOptions = [
  { value: "Not Discussed", label: "Not Discussed" },
  { value: "Exploring", label: "Exploring" },
  { value: "Budget Approved", label: "Budget Approved" },
  { value: "Executive Mandate", label: "Executive Mandate" },
];

export const challengeOptions = [
  { value: "Tech Stack", label: "Legacy Technology Stack" },
  { value: "Budget/ROI", label: "Unclear ROI & Budget Constraint" },
  { value: "Talent Shortage", label: "Talent & Skill Shortage" },
  { value: "Security/Compliance", label: "Security, Privacy & Compliance" },
  { value: "Change Management", label: "Organizational Inertia" },
];

export const budgetOptions = [
  { value: "Under $100k", label: "Under $100k" },
  { value: "$100k-$500k", label: "$100k - $500k" },
  { value: "$500k-$2M", label: "$500k - $2M" },
  { value: "$2M+", label: "$2M+" },
];

export const geographyOptions = [
  { value: "North America", label: "North America" },
  { value: "Europe", label: "Europe" },
  { value: "APAC", label: "APAC" },
  { value: "LATAM", label: "LATAM" },
  { value: "Global", label: "Global" },
];

export function calculateBlueprintScore(answers: BlueprintAnswers) {
  let aiMaturity = 10;
  if (answers.aiJourney === "Exploring AI") aiMaturity = 30;
  else if (answers.aiJourney === "Running Pilots") aiMaturity = 60;
  else if (answers.aiJourney === "Scaling AI") aiMaturity = 85;
  else if (answers.aiJourney === "AI-Driven Enterprise") aiMaturity = 100;

  let businessNeed = 0;
  (answers.topPriorities || []).forEach((p) => {
    if (p === "Cost Reduction") businessNeed += 20;
    else if (p === "Productivity") businessNeed += 20;
    else if (p === "Customer Experience") businessNeed += 15;
    else if (p === "Revenue Growth") businessNeed += 15;
    else if (p === "Compliance") businessNeed += 10;
    else if (p === "AI Transformation") businessNeed += 20;
    else if (p === "Automate Processes") businessNeed += 20;
  });
  if (businessNeed > 100) businessNeed = 100;

  let dataReadiness = 20;
  if (answers.dataReadiness === "Highly fragmented") dataReadiness = 20;
  else if (answers.dataReadiness === "Partially connected") dataReadiness = 50;
  else if (
    answers.dataReadiness === "Mostly integrated" ||
    answers.dataReadiness === "Mostly Integrated Data"
  )
    dataReadiness = 75;
  else if (answers.dataReadiness === "Fully integrated") dataReadiness = 100;

  let processComplexity = 20;
  if (answers.companySize === "<100") processComplexity = 20;
  else if (answers.companySize === "100-1000") processComplexity = 50;
  else if (answers.companySize === "1000-10000") processComplexity = 80;
  else if (answers.companySize === "10000+") processComplexity = 100;

  let transformationReadiness = 20;
  if (answers.leadershipCommitment === "Not Discussed")
    transformationReadiness = 20;
  else if (answers.leadershipCommitment === "Exploring")
    transformationReadiness = 50;
  else if (answers.leadershipCommitment === "Budget Approved")
    transformationReadiness = 80;
  else if (answers.leadershipCommitment === "Executive Mandate")
    transformationReadiness = 100;

  const score =
    0.2 * aiMaturity +
    0.25 * businessNeed +
    0.2 * dataReadiness +
    0.2 * processComplexity +
    0.15 * transformationReadiness;

  return Math.round(score);
}

export function getScoreCategory(score: number) {
  if (score <= 25) return "AI Beginner";
  if (score <= 50) return "AI Explorer";
  if (score <= 70) return "AI Adopter";
  if (score <= 85) return "AI Transformer";
  return "AI-Native Leader";
}

export function getRecommendedOpportunities(industry: string): string[] {
  return [
    "Procurement Copilot",
    "HR Assistant",
    "Contract Intelligence",
    "Knowledge Search",
    "Executive Dashboard",
  ];
}

export function getRecommendedSolution(
  challenge: string
): { title: string; description: string } {
  return {
    title: "Recommended Solutions",
    description:
      "• Agent Factory™️\n• Knowledge Graph™️\n• AI Governance™️\n• Managed AI Operations™️",
  };
}

export function getExpectedImpact(
  priorities: string[]
): { metric: string; disclaimer: string } {
  return {
    metric:
      "20–30% Productivity Gain • 15–25% Cost Reduction • Faster Decision Making • Improved Employee Experience",
    disclaimer:
      "90-Day Roadmap: Garage - Discovery • Foundry - Pilot • Factory - Enterprise Rollout",
  };
}