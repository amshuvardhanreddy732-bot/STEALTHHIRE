import { Startup } from './types';

export const INITIAL_STARTUPS: Startup[] = [
  {
    id: '1',
    name: 'CognitiveOS',
    tagline: 'Autonomous AI agents for software test engineering',
    description: 'CognitiveOS is building specialized LLM-native agents that run inside secure sandboxes to write, debug, and execute end-to-end web and mobile application tests. They have raised a secret Series A led by top-tier SV venture firms after a 400% surge in enterprise beta signups.',
    logo: 'bg-indigo-600',
    fundingStage: 'Series A',
    fundingAmount: '$14.2M',
    recentFundingSource: 'Sequoia Capital, Founders Fund',
    growthRate: '+320% YoY',
    industry: 'DevTools & AI',
    location: 'San Francisco, CA',
    hiringProbability: 'Very High',
    techStack: ['React', 'TypeScript', 'Node.js', 'Python', 'FastAPI', 'Kubernetes', 'LLMs'],
    remote: true,
    website: 'https://cognitiveos.ai',
    fundingTimeline: [
      { date: 'June 2026', stage: 'Series A', amount: '$14.2M', investor: 'Sequoia Capital' },
      { date: 'October 2025', stage: 'Seed', amount: '$2.5M', investor: 'Founders Fund, Y Combinator' }
    ],
    problemsIdentified: [
      'Scaling automated testing across complex multi-platform web applications',
      'Minimizing test script brittleness due to DOM structure updates',
      'Reducing latency of AI-driven agent regression pipelines'
    ],
    technologyStackDetail: 'Frontend engineered with React 19, Tailwind CSS, and Framer Motion. Backend relies on Python / FastAPI for low-latency agent task queues, orchestrating Node.js environments via Docker and Kubernetes.',
    latestNews: [
      {
        title: 'CognitiveOS launches public beta for agentic software testers',
        source: 'TechCrunch',
        date: 'July 10, 2026',
        summary: 'CognitiveOS releases sandbox test agents to over 5,000 developers, showing a 10x reduction in manual QA configuration.'
      },
      {
        title: 'Sequoia leads $14.2M round in CognitiveOS to replace legacy QA pipelines',
        source: 'VentureBeat',
        date: 'June 18, 2026',
        summary: 'Silicon Valley investors double down on agentic AI DevTools as CognitiveOS hits $2M ARR in record time.'
      }
    ],
    suggestedOutreach: [
      {
        role: 'Head of Engineering (Sarah Jenkins)',
        coldEmail: `Subject: Solving agent regression latencies at CognitiveOS

Hi Sarah,

I read about CognitiveOS's recent $14.2M Series A led by Sequoia. Congratulations on the massive milestone!

I saw that one of your major engineering focuses is lowering the latency of your agentic testing sandboxes, particularly when running regression suites in parallel. In my previous work, I optimized heavy Docker-based worker nodes to reduce container setup time by 42%.

Given your projected hiring surge, I would love to share how I could apply similar low-latency optimizations to your Python/FastAPI backend as a Senior Backend Engineer. 

Do you have 10 minutes next Tuesday for a quick chat?

Best regards,
[Your Name]`,
        linkedInMessage: 'Hi Sarah, congrats on CognitiveOS’s $14.2M Series A! I’ve been following your progress in agentic software testing. I specialize in optimizing parallel FastAPI/Docker worker systems. Would love to connect and keep in touch as you scale your team!',
        twitterMessage: '@SarahJenkins congrats on the CognitiveOS Sequoia round! Your vision of autonomous QA sandboxes is game-changing. 🚀 Let me know if you need low-latency backend hands!'
      }
    ],
    recommendedSkills: ['Python', 'FastAPI', 'Docker', 'Kubernetes', 'Test Automation', 'LLM Agent Architectures'],
    matchScore: 94
  },
  {
    id: '2',
    name: 'Helios Climate',
    tagline: 'Decentralized smart-grid coordination networks',
    description: 'Helios Climate is designing real-time, peer-to-peer energy trading systems for microgrids. Utilizing advanced edge computing and machine learning, Helios allows solar-powered residential grids to dynamically distribute and sell excess power directly to commercial sites.',
    logo: 'bg-emerald-600',
    fundingStage: 'Seed',
    fundingAmount: '$4.8M',
    recentFundingSource: 'Union Square Ventures, Lowercarbon Capital',
    growthRate: '+180% YoY',
    industry: 'Climate Tech & Web3',
    location: 'Brooklyn, NY',
    hiringProbability: 'High',
    techStack: ['Rust', 'WebAssembly', 'Go', 'React', 'Tailwind CSS', 'InfluxDB', 'gRPC'],
    remote: false,
    website: 'https://heliosgrid.network',
    fundingTimeline: [
      { date: 'January 2026', stage: 'Seed', amount: '$4.8M', investor: 'Union Square Ventures, Lowercarbon' },
      { date: 'May 2025', stage: 'Pre-seed', amount: '$750K', investor: 'Collaborative Fund' }
    ],
    problemsIdentified: [
      'Managing sub-second smart contract grid settlements with low network fees',
      'Scaling edge hardware telemetry ingests to handle millions of devices',
      'Optimizing machine learning power dispatch predictors on low-power IoT microchips'
    ],
    technologyStackDetail: 'System engine written completely in Rust, compiled to WebAssembly for edge devices. High-throughput telemetry ingested via Go microservices into InfluxDB, with a stunning real-time React analytics dashboard.',
    latestNews: [
      {
        title: 'Helios Climate partners with Brooklyn Microgrid to pilot P2P solar trading',
        source: 'Bloomberg Green',
        date: 'May 22, 2026',
        summary: 'Over 200 homes in Brooklyn begin trading excess solar generation directly with local warehouses using Helios protocol.'
      }
    ],
    suggestedOutreach: [
      {
        role: 'Co-Founder & CTO (Marcus Vance)',
        coldEmail: `Subject: High-throughput Rust telemetry for Helios grid nodes

Hi Marcus,

Fascinating work with the Brooklyn Microgrid pilot! Seeing residential solar panels trade energy in real-time is the kind of climate solution we need.

I saw you recently raised $4.8M from USV and Lowercarbon. I know scaling edge telemetry to ingest millions of discrete IoT signals is a monumental challenge, particularly when coordinating microsecond grid settlements in Rust.

I am a Rust engineer with extensive experience writing lock-free ring buffers and optimizing gRPC services for high-throughput sensor telemetry. I would love to hear if Helios is looking for engineers to fortify your edge coordinator nodes.

Are you open to a brief call this week?

Best,
[Your Name]`,
        linkedInMessage: 'Marcus, loving the Helios Climate pilot in Brooklyn! If you’re looking to scale your Rust edge grid telemetry systems, I’d love to connect. I specialize in high-concurrency Rust and WebAssembly.',
        twitterMessage: 'Huge fans of @HeliosClimate’s P2P solar network! Marcus Vance is building the future of distributed grids. ☀️🔋 Rust + Energy = 🌿'
      }
    ],
    recommendedSkills: ['Rust', 'Go', 'WebAssembly', 'Edge Computing', 'Time-series Databases', 'IoT Protocols'],
    matchScore: 82
  },
  {
    id: '3',
    name: 'ScribeBio',
    tagline: 'Generative protein design for target-specific therapeutics',
    description: 'ScribeBio has developed custom deep learning models that generate de novo protein structures targeting aggressive oncology receptors. By analyzing clinical tumor mutational profiles, their platform produces optimized therapeutic candidates ready for synthesis within hours.',
    logo: 'bg-purple-600',
    fundingStage: 'Series B',
    fundingAmount: '$38.0M',
    recentFundingSource: 'ARCH Venture Partners, Casdin Capital',
    growthRate: '+110% YoY',
    industry: 'Biotech & ML',
    location: 'Boston, MA',
    hiringProbability: 'Very High',
    techStack: ['Python', 'PyTorch', 'Next.js', 'PostgreSQL', 'AWS Batch', 'CUDA', 'Docker'],
    remote: false,
    website: 'https://scribebio.com',
    fundingTimeline: [
      { date: 'March 2026', stage: 'Series B', amount: '$38.0M', investor: 'ARCH Venture Partners' },
      { date: 'April 2024', stage: 'Series A', amount: '$12.0M', investor: 'Casdin Capital' }
    ],
    problemsIdentified: [
      'Accelerating high-dimensional protein convolution calculations on distributed GPU clusters',
      'Structuring massive multi-modal genomic and biochemical training datasets',
      'Building responsive 3D interactive molecular visualizers for bio-lab clients'
    ],
    technologyStackDetail: 'The ML models are trained in PyTorch using customized CUDA kernels on AWS. Web dashboards and interactive 3D molecular structures are rendered in Next.js using Three.js and WebGL.',
    latestNews: [
      {
        title: 'ScribeBio raises $38M Series B to fast-track oncology therapeutic candidates',
        source: 'Fierce Biotech',
        date: 'March 14, 2026',
        summary: 'ScribeBio will use the funding to expand its computational biology squad and advance its first three generative proteins into clinical trials.'
      }
    ],
    suggestedOutreach: [
      {
        role: 'Chief Scientific Officer (Dr. Aris Thorne)',
        coldEmail: `Subject: Optimizing CUDA structural convolutions for ScribeBio

Dear Dr. Thorne,

I read ScribeBio's exciting announcement regarding your $38M Series B to advance tumor-targeted generative proteins into trials. It is a monumental step for oncologist-personalized medicine.

I understand that a significant computational bottleneck in generative protein design is running 3D spatial convolutions efficiently. My research and industry experience lie in writing custom CUDA kernels and optimizing distributed PyTorch systems, having achieved a 3x speedup in deep structural prediction models.

I would love to help ScribeBio scale your computational infrastructure as you onboard more clinical oncology partnerships.

Could we schedule a short conversation to discuss your technical bottlenecks?

Sincerely,
[Your Name]`,
        linkedInMessage: 'Dr. Thorne, congratulations on ScribeBio’s Series B! I specialize in PyTorch performance engineering and custom CUDA kernels. I would love to connect to discuss how you are accelerating your generative protein convolutions.',
        twitterMessage: 'Generative oncology is real. @ScribeBio just secured $38M to scale their deep learning protein pipelines. Unbelievable tech. 🧪🤖'
      }
    ],
    recommendedSkills: ['Python', 'PyTorch', 'CUDA / GPU Programming', 'Three.js / WebGL', 'AWS Batch / Cloud HPC', 'Computational Biology'],
    matchScore: 68
  },
  {
    id: '4',
    name: 'RetainLabs',
    tagline: 'Predictive churn prevention for high-growth B2B SaaS',
    description: 'RetainLabs connects directly to corporate communications, ticketing, and product analytics to detect accounts that are showing early signs of user fatigue, executive changes, or budget shrinkage. Their early-warning models give CSM teams up to 90 days notice.',
    logo: 'bg-amber-600',
    fundingStage: 'Seed',
    fundingAmount: '$3.1M',
    recentFundingSource: 'Y Combinator, First Round Capital',
    growthRate: '+240% YoY',
    industry: 'B2B Enterprise SaaS',
    location: 'Remote, US',
    hiringProbability: 'High',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Python', 'OpenAI API'],
    remote: true,
    website: 'https://retainlabs.io',
    fundingTimeline: [
      { date: 'November 2025', stage: 'Seed', amount: '$3.1M', investor: 'First Round Capital, YC' }
    ],
    problemsIdentified: [
      'Ingesting millions of user events per second from external customer CRM connections',
      'Ensuring strict data privacy and isolation between tenant data storage instances',
      'Training multi-tenant transformer models without leaking cross-customer metrics'
    ],
    technologyStackDetail: 'Frontend is written in modern React. The API layer is powered by Node.js/Express, utilizing Redis queues to handle high-frequency webhook streams, and PostgreSQL with row-level security for multi-tenant data safety.',
    latestNews: [
      {
        title: 'YC alum RetainLabs lands $3.1M to tackle customer churn head-on',
        source: 'VentureBeat',
        date: 'November 12, 2025',
        summary: 'RetainLabs secures funding after showing that its LLM sentiment integrations predict B2B SaaS cancellations with 92% accuracy.'
      }
    ],
    suggestedOutreach: [
      {
        role: 'VP of Engineering (Dave Kowalski)',
        coldEmail: `Subject: High-frequency webhook processing & tenant security at RetainLabs

Hi Dave,

Congrats on the $3.1M Seed round led by First Round! Your 92% churn prediction accuracy rate is incredibly impressive.

I understand that processing high-frequency user event webhooks from thousands of connected enterprise CRMs while maintaining strict tenant isolation in PostgreSQL is a central engineering challenge as you scale. In my previous role, I designed a multi-tenant Redis/Node event pipeline that ingested over 20M events per day with zero data cross-leakage.

I would love to help RetainLabs robustify your webhook consumers and PostgreSQL isolation layers as a Senior Full Stack Engineer.

Are you available for a brief conversation next week?

Best,
[Your Name]`,
        linkedInMessage: 'Hi Dave, congrats on RetainLabs’ seed round! I’m a Senior Backend Engineer specializing in high-throughput webhook pipelines and multi-tenant PostgreSQL. Would love to connect and see how you guys are handling CRM event ingests!',
        twitterMessage: 'CSM squads rejoice. @RetainLabs is building the ultimate churn predictor. Dave Kowalski and team are scaling fast. 📈 AI-driven retention is key!'
      }
    ],
    recommendedSkills: ['TypeScript', 'Node.js', 'Redis', 'PostgreSQL RLS', 'Webhooks API', 'Enterprise Security'],
    matchScore: 89
  }
];
