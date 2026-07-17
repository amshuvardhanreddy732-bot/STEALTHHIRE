import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_STARTUPS } from './src/data';
import { User, Message, SystemLog, SavedOpportunity } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Database for Demo Persistence
let users: User[] = [
  {
    id: 'user-1',
    email: 'amshuvardhanreddy732@gmail.com',
    name: 'Amshu Vardhan',
    role: 'job-seeker',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    profileComplete: 80,
    skillScore: 78,
    createdAt: new Date().toISOString()
  },
  {
    id: 'admin-1',
    email: 'admin@stealthhire.ai',
    name: 'StealthHire Administrator',
    role: 'admin',
    skills: ['Platform Operations', 'Data Intelligence'],
    profileComplete: 100,
    skillScore: 95,
    createdAt: new Date().toISOString()
  }
];

let savedOpportunities: SavedOpportunity[] = [
  {
    id: 'saved-1',
    startupId: '1',
    status: 'Bookmarked',
    notes: 'Incredible Sequoia-backed agent testers. High potential fit.',
    savedAt: new Date().toISOString()
  }
];

let systemLogs: SystemLog[] = [
  {
    id: 'log-1',
    message: 'StealthHire AI core engine initialized successfully.',
    level: 'info',
    timestamp: new Date().toISOString(),
    category: 'System'
  },
  {
    id: 'log-2',
    message: 'Loaded 4 high-growth startup profiles into predictive cache.',
    level: 'info',
    timestamp: new Date().toISOString(),
    category: 'Database'
  }
];

// Helper to append server-side logs
function addLog(message: string, level: 'info' | 'warn' | 'error' = 'info', category: string = 'Server') {
  const newLog: SystemLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    message,
    level,
    timestamp: new Date().toISOString(),
    category
  };
  systemLogs.unshift(newLog);
}

// Lazy Gemini Client initialization (to prevent crashes on boot if key is missing)
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY environment variable is missing. Please add your key in the Settings > Secrets menu in the AI Studio UI.');
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// --- AUTHENTICATION API ---
app.post('/api/auth/register', (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing registration details' });
  }

  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    email: email.toLowerCase(),
    name,
    role: role || 'job-seeker',
    skills: [],
    profileComplete: 20,
    skillScore: 0,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  addLog(`New user registered: ${name} (${email}) as ${role || 'job-seeker'}`, 'info', 'Authentication');
  res.json({ user: newUser, token: `mock-jwt-session-${newUser.id}` });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Handle mock logins
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. Try amshuvardhanreddy732@gmail.com or admin@stealthhire.ai' });
  }

  addLog(`User successfully authenticated: ${user.name} (${user.email})`, 'info', 'Authentication');
  res.json({ user, token: `mock-jwt-session-${user.id}` });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }
  const userId = authHeader.replace('Bearer mock-jwt-session-', '');
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'Session expired' });
  }
  res.json({ user });
});

app.post('/api/auth/verify', (req, res) => {
  const { code, email } = req.body;
  addLog(`Email verified successfully for ${email || 'user'}`, 'info', 'Authentication');
  res.json({ status: 'verified' });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  addLog(`Password reset link dispatched to ${email}`, 'info', 'Authentication');
  res.json({ status: 'reset-dispatched' });
});

app.post('/api/auth/profile/update', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  
  const userId = authHeader.replace('Bearer mock-jwt-session-', '');
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

  const { name, skills, role } = req.body;
  if (name) users[userIndex].name = name;
  if (skills) {
    users[userIndex].skills = skills;
    users[userIndex].skillScore = Math.min(100, Math.max(30, skills.length * 15 + Math.floor(Math.random() * 15)));
  }
  if (role) users[userIndex].role = role;

  users[userIndex].profileComplete = Math.min(100, users[userIndex].profileComplete + 10);
  
  addLog(`Updated profile details for user ${users[userIndex].name}`, 'info', 'User Profile');
  res.json({ user: users[userIndex] });
});

// --- STARTUP DATA API ---
app.get('/api/startups', (req, res) => {
  const { search, fundingStage, industry, location, remote, hiringProbability } = req.query;
  let filtered = [...INITIAL_STARTUPS];

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.tagline.toLowerCase().includes(q) || 
      s.description.toLowerCase().includes(q) ||
      s.techStack.some(t => t.toLowerCase().includes(q))
    );
  }

  if (fundingStage) {
    filtered = filtered.filter(s => s.fundingStage === fundingStage);
  }

  if (industry) {
    filtered = filtered.filter(s => s.industry.toLowerCase().includes((industry as string).toLowerCase()));
  }

  if (location) {
    filtered = filtered.filter(s => s.location.toLowerCase().includes((location as string).toLowerCase()));
  }

  if (remote !== undefined) {
    const isRemote = remote === 'true';
    filtered = filtered.filter(s => s.remote === isRemote);
  }

  if (hiringProbability) {
    filtered = filtered.filter(s => s.hiringProbability === hiringProbability);
  }

  res.json({ startups: filtered });
});

app.get('/api/startups/:id', (req, res) => {
  const startup = INITIAL_STARTUPS.find(s => s.id === req.params.id);
  if (!startup) {
    return res.status(404).json({ error: 'Startup profile not found' });
  }
  res.json({ startup });
});

// --- SAVED OPPORTUNITIES / BOOKMARKS ---
app.get('/api/opportunities', (req, res) => {
  res.json({ opportunities: savedOpportunities });
});

app.post('/api/opportunities', (req, res) => {
  const { startupId, status, notes } = req.body;
  if (!startupId) return res.status(400).json({ error: 'Startup ID is required' });

  const existingIndex = savedOpportunities.findIndex(o => o.startupId === startupId);
  if (existingIndex !== -1) {
    savedOpportunities[existingIndex].status = status || savedOpportunities[existingIndex].status;
    if (notes !== undefined) savedOpportunities[existingIndex].notes = notes;
    res.json({ opportunity: savedOpportunities[existingIndex] });
  } else {
    const newSaved: SavedOpportunity = {
      id: `saved-${Date.now()}`,
      startupId,
      status: status || 'Bookmarked',
      notes: notes || '',
      savedAt: new Date().toISOString()
    };
    savedOpportunities.push(newSaved);
    addLog(`Bookmarked startup opportunity: ${startupId}`, 'info', 'User Bookmarks');
    res.json({ opportunity: newSaved });
  }
});

app.delete('/api/opportunities/:startupId', (req, res) => {
  const { startupId } = req.params;
  savedOpportunities = savedOpportunities.filter(o => o.startupId !== startupId);
  addLog(`Removed bookmark for startup: ${startupId}`, 'info', 'User Bookmarks');
  res.json({ success: true });
});

// --- REAL GEMINI AI INTEGRATION API ---

// 1. Resume Analyzer Endpoint
app.post('/api/resume/analyze', async (req, res) => {
  const { resumeText, githubUrl, linkedinUrl, portfolioUrl } = req.body;
  if (!resumeText) {
    return res.status(400).json({ error: 'Please submit your resume text to trigger AI deep analysis' });
  }

  try {
    const ai = getGeminiClient();
    addLog('Analyzing resume and portfolio profiles via Gemini model...', 'info', 'AI Core');

    const prompt = `
      You are an expert ATS (Applicant Tracking System) parser and silicon valley recruiter. 
      Analyze the following candidate details:
      - Resume text: "${resumeText}"
      - GitHub Link: "${githubUrl || 'N/A'}"
      - LinkedIn Link: "${linkedinUrl || 'N/A'}"
      - Portfolio Link: "${portfolioUrl || 'N/A'}"

      Provide your analysis in clean, structured JSON conforming EXACTLY to this schema:
      {
        "atsScore": number (between 0 and 100),
        "strengths": string[],
        "weaknesses": string[],
        "suggestedImprovements": string[],
        "detectedSkills": string[]
      }
      Do not include any wrapping markdown block tags or explain your reasoning outside the JSON format.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.INTEGER, description: 'ATS Compatibility Score from 0 to 100' },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Top professional strengths' },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Skill gaps or key weaknesses' },
            suggestedImprovements: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Concrete optimization tips' },
            detectedSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Technical skills parsed from the resume' }
          },
          required: ['atsScore', 'strengths', 'weaknesses', 'suggestedImprovements', 'detectedSkills']
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());

    // Update first user's resume in-memory database to simulate a state transition
    if (users.length > 0) {
      users[0].resumeText = resumeText;
      users[0].atsScore = parsedData.atsScore;
      users[0].skills = Array.from(new Set([...users[0].skills, ...parsedData.detectedSkills]));
      users[0].profileComplete = 100;
      users[0].skillScore = Math.min(100, users[0].skills.length * 12);
    }

    addLog(`Successfully parsed resume with ATS score of ${parsedData.atsScore}%`, 'info', 'AI Core');
    res.json(parsedData);

  } catch (error: any) {
    addLog(`Resume analysis failed: ${error.message}`, 'error', 'AI Core');
    res.status(500).json({ error: error.message });
  }
});

// 2. AI Career Mentor Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const { messages, userProfile } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid chat history' });
  }

  try {
    const ai = getGeminiClient();
    
    // Construct conversation flow
    const systemInstruction = `
      You are the StealthHire AI Career Mentor. You help software engineers, product managers, and growth specialists find stealth hiring signals at high-growth startups before jobs are publicly listed.
      You are highly encouraging, pragmatic, data-driven, and sound like a seasoned silicon valley recruiter.
      Use markdown formatting to layout responses neatly (bolding, lists, code sections).
      The candidate's current profile details:
      Name: ${userProfile?.name || 'User'}
      Skills: ${userProfile?.skills?.join(', ') || 'None declared yet'}
      Current Skill Score: ${userProfile?.skillScore || 0}%
      Current Resume parsed: ${userProfile?.resumeText ? 'Yes' : 'No'}
    `;

    // Map messages history to contents structure
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    addLog('Generating mentor advice stream via Gemini...', 'info', 'AI Core');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction
      }
    });

    res.json({ text: response.text });

  } catch (error: any) {
    addLog(`Career mentoring chat failed: ${error.message}`, 'error', 'AI Core');
    res.status(500).json({ error: error.message });
  }
});

// 3. Outreach Generator Endpoint
app.post('/api/outreach/generate', async (req, res) => {
  const { startupId, userProfile, targetRole } = req.body;
  if (!startupId) return res.status(400).json({ error: 'Startup ID is required' });

  const startup = INITIAL_STARTUPS.find(s => s.id === startupId);
  if (!startup) return res.status(404).json({ error: 'Startup not found' });

  try {
    const ai = getGeminiClient();
    addLog(`Creating customized Cold Outreach templates for ${startup.name}...`, 'info', 'AI Core');

    const prompt = `
      Create a hyper-personalized, high-converting cold outreach campaign for a candidate seeking a job at "${startup.name}" (${startup.tagline}).
      
      Candidate profile details:
      - Name: ${userProfile?.name || 'John Doe'}
      - Skills: ${userProfile?.skills?.join(', ') || 'Software development, React, Node.js'}
      - Resume Highlight: ${userProfile?.resumeText ? userProfile.resumeText.substring(0, 1000) : 'N/A'}
      
      Startup Insights:
      - Funding Stage: ${startup.fundingStage} (${startup.fundingAmount} raised from ${startup.recentFundingSource})
      - Recent News summary: ${startup.latestNews[0]?.summary || 'Scaling operations rapidly.'}
      - Tech Stack: ${startup.techStack.join(', ')}
      - Problems we identified they are facing: ${startup.problemsIdentified.join(', ')}

      Targeting Role: ${targetRole || 'Software Engineer'}

      Generate three custom messages:
      1. A short, compelling, response-driven Cold Email (complete with subject line)
      2. A highly personalized LinkedIn connection request message (strictly within 300 characters limits)
      3. An engaging, professional Twitter/X direct message or tweet mention

      Return your output in a valid, parsable JSON schema containing ONLY this exact structure:
      {
        "coldEmail": "The body of the cold email here",
        "linkedInMessage": "The 300 character max message here",
        "twitterMessage": "The DM pitch here"
      }
      Do not wrap it in triple backticks or include other text. Just return the raw JSON object.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coldEmail: { type: Type.STRING, description: 'Complete Cold email template' },
            linkedInMessage: { type: Type.STRING, description: '300-char max LinkedIn message' },
            twitterMessage: { type: Type.STRING, description: 'Short X/Twitter message' }
          },
          required: ['coldEmail', 'linkedInMessage', 'twitterMessage']
        }
      }
    });

    const parsedOutreach = JSON.parse(response.text.trim());
    addLog(`Custom outreach copy generated for ${startup.name}`, 'info', 'AI Core');
    res.json(parsedOutreach);

  } catch (error: any) {
    addLog(`Outreach generation failed: ${error.message}`, 'error', 'AI Core');
    res.status(500).json({ error: error.message });
  }
});

// --- ADMIN API ---
app.get('/api/admin/stats', (req, res) => {
  const totalUsers = users.length;
  const totalStartups = INITIAL_STARTUPS.length;
  const totalOpportunitiesSaved = savedOpportunities.length;
  
  res.json({
    stats: {
      totalUsers,
      totalStartups,
      totalOpportunitiesSaved,
      platformAtsScoreAvg: 81.5,
      apiUptime: '99.98%',
      systemLogsCount: systemLogs.length
    }
  });
});

app.get('/api/admin/logs', (req, res) => {
  res.json({ logs: systemLogs });
});

// --- MAIN SERVER MOUNTING & VITE MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StealthHire AI core running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
}

startServer();
