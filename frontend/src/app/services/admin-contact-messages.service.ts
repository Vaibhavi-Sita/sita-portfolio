import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContactMessage } from '../models';

export interface ContactMessagePage {
  content: ContactMessage[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class AdminContactMessagesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl || environment.apiUrl;

  list(page = 0, size = 20): Observable<ContactMessagePage> {
    return this.http.get<ContactMessagePage>(
      `${this.baseUrl}/api/admin/contact/messages?page=${page}&size=${size}`
    );
  }

  updateStatus(
    id: string,
    status: 'new' | 'read' | 'archived'
  ): Observable<ContactMessage> {
    return this.http.patch<ContactMessage>(
      `${this.baseUrl}/api/admin/contact/messages/${id}`,
      { status }
    );
  }
}
