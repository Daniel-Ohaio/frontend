import '@angular/compiler';
import { Component, inject, signal, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClient, provideHttpClient } from '@angular/common/http';
const API_URL = 'http://localhost:3000/api/data';
@Component({
  selector: 'app-root',
  template: `
    <h1>Frontend - версия 1.0</h1>
    <label for="msg">Введите текст:</label>
    <input id="msg" #msg type="text" />
    <button (click)="send(msg)">Отправить</button>
    <p class="status">{{ status() }}</p>
  `,
})
class AppComponent {
  private http = inject(HttpClient);
  status = signal('');
  send(input: HTMLInputElement) {
    const text = input.value.trim();
    if (!text) {
      this.status.set('Введите текст перед отправкой');
      return;
    }
    this.http.post(API_URL, { text }).subscribe({
      next: () => {
        this.status.set('Данные отправлены на сервер');
        input.value = '';
      },
      error: () => this.status.set('Ошибка: бэкенд недоступен'),
    });
  }
}
bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection(), provideHttpClient()],
}).catch((err) => console.error(err));



