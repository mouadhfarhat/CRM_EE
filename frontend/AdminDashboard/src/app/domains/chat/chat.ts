export interface ChatRequest {
    userMessage: string;
  }
  
  export interface ChatResponse {
    response: string;
    timestamp: string;
    success: boolean;
  }
  
  export interface ChatMessage {
    content: string;
    timestamp: string;
    isUser: boolean;
  }