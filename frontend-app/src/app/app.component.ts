import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  selectedFile: File | null = null;
  transcription: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('audio', this.selectedFile);

      this.http.post<any>('http://localhost:3000/api/transcribe', formData).subscribe(
        (response) => {
          this.transcription = response.transcription;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      alert('Please select a file first.');
    }
  }
}
