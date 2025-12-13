// API类型定义
export interface TitleItem {
  title: string;
  formula: string;
  seo_score: number;
  baokuan_index: string;
  reason: string;
  recommended?: boolean;
}

export interface QualityResult {
  ai_tone: number;
  naturalness: number;
  sincerity: number;
  verbosity: number;
  repetition: number;
  readability: number;
  human_touch: number;
  emotional_authenticity: number;
  profanity_count: number;
  overall_score: number;
  passed: boolean;
  suggestions: string[];
}

export interface TopicFilterResult {
  category: '核心工具类' | '泛AI话题类';
  score: number;
  avgReads: number;
  recommendation: '推荐写作' | '谨慎考虑' | '不建议写作';
  reasons: string[];
  isHotspot: boolean;
  brandDetected?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T | null;
  error?: {
    code: string;
    message: string;
  };
}
