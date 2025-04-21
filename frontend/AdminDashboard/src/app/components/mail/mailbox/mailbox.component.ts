import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Mail {
  id: number;
  from: string;
  subject: string;
  content: string;
  date: string;
  starred: boolean;
  selected: boolean;
  hasAttachment: boolean;
}

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule]
})
export class MailboxComponent {
  // Add these properties
  currentFolder: string = 'inbox';
  selectAll = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 200;

  // Add this method
  changeFolder(folder: string): void {
    this.currentFolder = folder;
    // Add any additional logic for folder change
  }

  mails: Mail[] = [
    {
      id: 1,
      from: 'Alexander Pierce',
      subject: 'AdminLTE 3.0 Issue',
      content: 'Trying to find a solution to this problem...',
      date: '5 mins ago',
      starred: true,
      selected: false,
      hasAttachment: false
    },
    {
      id: 2,
      from: 'Alexander Pierce',
      subject: 'AdminLTE 3.0 Issue',
      content: 'Trying to find a solution to this problem...',
      date: '5 mins ago',
      starred: true,
      selected: false,
      hasAttachment: false
    },
    {
      id: 3,
      from: 'Alexander test',
      subject: 'AdminLTE 3.0 Issue',
      content: 'Trying to find a solution to this problem...',
      date: '5 mins ago',
      starred: true,
      selected: false,
      hasAttachment: false
    },
    {
      id: 4,
      from: 'test Pierce',
      subject: 'AdminLTE 3.0 Issue',
      content: 'Trying to find a solution to this problem...',
      date: '5 mins ago',
      starred: true,
      selected: false,
      hasAttachment: false
    },
    // Add more mail objects as needed
  ];

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.mails = this.mails.map(mail => ({
      ...mail,
      selected: this.selectAll
    }));
  }

  toggleStar(mail: Mail): void {
    mail.starred = !mail.starred;
  }

  deleteSelected(): void {
    this.mails = this.mails.filter(mail => !mail.selected);
  }

  refreshMails(): void {
    // Implement refresh logic here
    this.currentPage = 1;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
    }
  }

  get paginationText(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `${start}-${end}/${this.totalItems}`;
  }
}