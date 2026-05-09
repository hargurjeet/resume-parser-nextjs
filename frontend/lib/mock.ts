import { ParsedResume } from '@/types/resume'

export const MOCK_RESUME: ParsedResume = {
  full_name: 'Hargurjeet Singh Ganger',
  email: 'gurjeet333@gmail.com',
  phone: '+91 9035828125',
  location: 'Bangalore, India',
  linkedin_url: 'https://linkedin.com/in/hargurjeet',
  github_url: 'https://github.com/hargurjeet',
  portfolio_url: undefined,
  current_job_title: 'Senior Data Scientist',
  years_of_experience: 15,
  summary:
    'Experienced IT professional with 15+ years specialising in data science and Generative AI. Proven track record of building production-grade ML pipelines, RAG systems, and agentic workflows.',
  skills: [
    { name: 'Python', category: 'technical', proficiency: 'expert' },
    { name: 'Machine Learning', category: 'technical', proficiency: 'expert' },
    { name: 'FastAPI', category: 'framework', proficiency: 'advanced' },
    { name: 'AWS', category: 'tool', proficiency: 'advanced' },
    { name: 'SQL', category: 'technical', proficiency: 'advanced' },
    { name: 'LangChain', category: 'framework', proficiency: 'advanced' },
    { name: 'Docker', category: 'tool', proficiency: 'intermediate' },
    { name: 'Communication', category: 'soft' },
  ],
  work_experience: [
    {
      job_title: 'Senior Data Scientist',
      company: 'British Telecom (BT)',
      location: 'Bangalore, India',
      start_date: 'May 2022',
      end_date: 'Present',
      responsibilities: [
        'Built a production RAG chatbot reducing support tickets by 30%',
        'Designed end-to-end ML pipelines achieving 90%+ prediction accuracy',
        'Led a team of 4 data scientists delivering quarterly product features',
      ],
    },
    {
      job_title: 'Data Scientist',
      company: 'Infosys',
      location: 'Pune, India',
      start_date: 'Jan 2018',
      end_date: 'Apr 2022',
      responsibilities: [
        'Developed NLP models for customer sentiment analysis',
        'Built automated reporting dashboards used by 200+ stakeholders',
      ],
    },
  ],
  education: [
    {
      degree: 'M.S.',
      institution: 'Liverpool John Moores University',
      field_of_study: 'Machine Learning & Artificial Intelligence',
      graduation_year: 2021,
    },
    {
      degree: 'B.Tech',
      institution: 'Punjab Technical University',
      field_of_study: 'Computer Science',
      graduation_year: 2010,
    },
  ],
  certifications: [
    { name: 'Microsoft Azure Data Scientist Associate', issuing_organization: 'Microsoft', issue_date: '2023' },
    { name: 'Google Professional Data Engineer', issuing_organization: 'Google', issue_date: '2022' },
  ],
  projects: [
    {
      title: 'Agentic Search Platform',
      description: 'MCP-driven agentic search service that retrieves and synthesises answers from multiple knowledge bases.',
      technologies: ['FastAPI', 'LangChain', 'OpenAI', 'Pinecone'],
      url: 'https://github.com/hargurjeet/agentic-search',
    },
    {
      title: 'Blog Generator using Llama2',
      description: undefined,
      technologies: ['Llama2', 'Streamlit'],
    },
    {
      title: 'Resume Parser',
      description: 'PDF resume parsing with structured JSON output using Fireworks AI.',
      technologies: ['FastAPI', 'Fireworks AI', 'Next.js', 'pdfplumber'],
      url: 'https://github.com/hargurjeet/resume-parser-nextjs',
    },
  ],
  languages: ['English', 'Hindi', 'Punjabi'],
}
