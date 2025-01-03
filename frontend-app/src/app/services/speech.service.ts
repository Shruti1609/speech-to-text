import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private apiUrl = 'http://localhost:3000/api/transcribe';

  constructor(private http: HttpClient) {}

  transcribeAudio(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('audio', file);
    return this.http.post<any>(this.apiUrl, formData);
  }
}
