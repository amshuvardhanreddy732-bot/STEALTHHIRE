export interface User {
  id: string;
  email: string;
  name: string;
  role: 'job-seeker' | 'admin';
  skills: string[];
  resumeText?: string;
  resumeFileName?: string;
  atsScore?: number;
  profileComplete: number; // 0 to 100
  skillScore: number; // 0 to 100
  createdAt: string;
}

export interface Startup {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string; // Tailwind color class or icon name
  fundingStage: 'Pre-seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C+';
  fundingAmount: string;
  recentFundingSource?: string;
  growthRate: string; // e.g., "+45% YoY"
  industry: string;
  location: string;
  hiringProbability: 'Very High' | 'High' | 'Medium' | 'Low';
  techStack: string[];
  remote: boolean;
  website: string;
  fundingTimeline: { date: string; stage: string; amount: string; investor: string }[];
  problemsIdentified: string[];
  technologyStackDetail: string;
  latestNews: { title: string; source: string; date: string; url?: string; summary: string }[];
  suggestedOutreach: {
    role: string;
    coldEmail: string;
    linkedInMessage: string;
    twitterMessage: string;
  }[];
  recommendedSkills: string[];
  matchScore: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface SystemLog {
  id: string;
  message: string;
  level: 'info' | 'warn' | 'error';
  timestamp: string;
  category: string;
}

export interface SkillRoadmapNode {
  id: string;
  title: string;
  description: string;
  type: 'concept' | 'project' | 'course';
  duration: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  resources: { name: string; url: string }[];
}

export interface SavedOpportunity {
  id: string;
  startupId: string;
  status: 'Interacted' | 'Outreached' | 'Interviewing' | 'Bookmarked';
  notes?: string;
  savedAt: string;
}
