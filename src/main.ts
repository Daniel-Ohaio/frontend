import '@angular/compiler';
import { Component, inject, signal, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClient, provideHttpClient } from '@angular/common/http';
const API_URL = 'http://localhost:3000/api/data';
@Component({
  selector: 'app-root',
  template: `
    <h1>Frontend - версия 2.0</h1>
    <h2>Отправка данных</h2>
    <label for="msg">Введите текст:</label>
    <input id="msg" #msg type="text" />
    <button (click)="send(msg)">Отправить</button>
    <p class="status">{{ status() }}</p>
    <h2>Получение данных</h2>
    <button (click)="loadData()">Получить данные</button>
    <textarea
      readonly
      rows="8"
      placeholder="Здесь появится содержимое data.txt"
      [value]="result()"
    ></textarea>
  `,
})
class AppComponent {
  private http = inject(HttpClient);
  status = signal('');
  result = signal('');
  // Отправка введённого текста на бэкенд
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
  // Запрос содержимого data.txt у бэкенда
  loadData() {
    this.http.get(API_URL, { responseType: 'text' }).subscribe({
      next: (text) => this.result.set(text || '(файл data.txt пока пуст)'),
      error: () => this.result.set('Ошибка: не удалось получить данные от бэкенда'),
    });
  }
}
bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection(), provideHttpClient()],
}).catch((err) => console.error(err));






