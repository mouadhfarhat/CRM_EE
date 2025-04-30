import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat/chat.service';
import { ChatMessage } from '../../../domains/chat/chat';
import { CommonModule, DatePipe } from '@angular/common';
import { LinkyModule } from 'ngx-linky';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [HttpClientModule,CommonModule, ReactiveFormsModule, LinkyModule, DatePipe],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  chatForm!: FormGroup;
  messages: ChatMessage[] = [];
  isLoading = false;
  isChatOpen = false;
  
  constructor(
    private fb: FormBuilder,
    private chatService: ChatService
  ) { }
  
  ngOnInit(): void {
    this.initForm();
    this.addWelcomeMessage();
  }

  ngAfterViewInit(): void {
    if (this.scrollContainer) {
      this.scrollToBottom();
    }
  }
  
  private initForm(): void {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required]]
    });
  }
  
  private addWelcomeMessage(): void {
    this.messages.push({
      content: 'Hello! How can I help you today?',
      timestamp: new Date().toISOString(),
      isUser: false
    });
  }
  
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 100); // Small delay to ensure DOM is updated
    }
  }
  
  sendMessage(): void {
    if (this.chatForm.invalid || this.isLoading) {
      return;
    }
    
    const message = this.chatForm.value.message.trim();
    if (!message) return;
    
    // Add user message to the chat
    this.messages.push({
      content: message,
      timestamp: new Date().toISOString(),
      isUser: true
    });
    
    // Reset the form
    this.chatForm.reset();
    
    // Scroll to bottom
    this.scrollToBottom();
    
    // Set loading state
    this.isLoading = true;
    
    // Call the service
    this.chatService.sendMessage(message).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          this.messages.push({
            content: response.response,
            timestamp: response.timestamp || new Date().toISOString(),
            isUser: false
          });
        } else {
          this.messages.push({
            content: 'Sorry, I encountered an error. Please try again later.',
            timestamp: new Date().toISOString(),
            isUser: false
          });
        }
        
        // Scroll to bottom
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Chat error:', error);
        this.isLoading = false;
        
        this.messages.push({
          content: 'Sorry, I couldn\'t connect to the server. Please try again later.',
          timestamp: new Date().toISOString(),
          isUser: false
        });
        
        // Scroll to bottom
        this.scrollToBottom();
      }
    });
  }
  
  scrollToBottom(): void {
    try {
      if (this.scrollContainer?.nativeElement) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
  
  // Handle Enter key press to send message
  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}