import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { ChatRequest, ChatResponse } from '../../domains/chat domain/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiBaseUrl}/api/chatbot/chat`;

  constructor(private http: HttpClient) { }

  /**
   * Send a message to the chatbot API
   * @param message User message to send to the chatbot
   * @returns Observable of ChatResponse from the API
   */
  sendMessage(message: string): Observable<ChatResponse> {
    const request: ChatRequest = {
      userMessage: message
    };
    
    // Log the request URL for debugging
    console.log('Sending request to:', this.apiUrl);
    
    return this.http.post<ChatResponse>(this.apiUrl, request);
  }
}