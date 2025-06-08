export interface CorrectionResult {
  corrected: string;
  confidence: number;
  changes: {
    total: number;
    types: string[];
  };
}

export interface Submission {
  id: string;
  input_type: string;
  input_content: string;
  status: string;
  created_at: string;
}

export interface Correction {
  id: string;
  submission_id: string;
  corrected_content: string;
  verified: boolean;
  created_at: string;
}