export interface StockData {
  symbol: string;
  companyName: string;
  currentPrice: number;
  marketCap: number;
  peRatio: number;
  eps: number;
  dividendYield: number;
  week52High: number;
  week52Low: number;
  volume: number;
  sector: string;
  industry: string;
}

export interface AnalysisResult {
  id: string;
  userId: string | null;
  ticker: string;
  companyName: string;
  stockData: StockData;
  aiAnalysis: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AnalyzeRequest {
  ticker: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}
