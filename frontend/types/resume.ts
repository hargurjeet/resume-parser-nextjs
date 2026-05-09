export interface Skill {
  name: string
  category?: 'technical' | 'soft' | 'language' | 'tool' | 'framework' | 'other'
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface WorkExperience {
  job_title: string
  company: string
  location?: string
  start_date?: string
  end_date?: string
  duration?: string
  responsibilities: string[]
}

export interface Education {
  degree: string
  institution: string
  field_of_study?: string
  graduation_year?: number
  gpa?: number
  location?: string
}

export interface Certification {
  name: string
  issuing_organization?: string
  issue_date?: string
  expiry_date?: string
  credential_id?: string
}

export interface Project {
  title: string
  description?: string
  technologies: string[]
  url?: string
  date?: string
}

export interface ParsedResume {
  full_name: string
  email?: string
  phone?: string
  location?: string
  linkedin_url?: string
  github_url?: string
  portfolio_url?: string
  summary?: string
  current_job_title?: string
  years_of_experience?: number
  work_experience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  certifications: Certification[]
  projects: Project[]
  languages: string[]
}
