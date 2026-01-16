import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ContactFormData } from '../models';

export interface ContactSubmitResponse {
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly api = inject(ApiService);

  submit(payload: ContactFormData): Observable<ContactSubmitResponse> {
    return this.api.post<ContactSubmitResponse>('/api/public/contact/messages', payload);
  }
}
