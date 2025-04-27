
export interface Agent {
  id: string;
  name: string;
  company: string;
  industry: string;
  mainProduct: string;
  strategy: string;
  personality: string;
  objective: string;
  thinkingStyle: string;
  isActive: boolean;
}

export interface AgentFormValues {
  industry: string;
  company: string;
  mainProduct: string;
  strategy: string;
  name: string;
  personality: string;
  objective: string;
  thinkingStyle: string;
}

