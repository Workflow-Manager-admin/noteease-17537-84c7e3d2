import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NoteListComponent } from './components/note-list/note-list.component';
import { NoteEditorComponent } from './components/note-editor/note-editor.component';
import { Note } from './models/note.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NoteListComponent, NoteEditorComponent],
  template: `
    <div class="app-container">
      <header>
        <h1>NoteEase</h1>
      </header>
      
      <main>
        <app-note-list
          (addNote)="showEditor()"
          (editNote)="showEditor($event)"
        ></app-note-list>
        
        @if (showNoteEditor) {
          <div class="overlay" (click)="closeEditor()">
            <app-note-editor
              [note]="selectedNote"
              (close)="closeEditor()"
            ></app-note-editor>
          </div>
        }
      </main>
    </div>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  showNoteEditor = false;
  selectedNote: Note | null = null;

  showEditor(note?: Note): void {
    this.selectedNote = note || null;
    this.showNoteEditor = true;
  }

  closeEditor(): void {
    this.showNoteEditor = false;
    this.selectedNote = null;
  }
}
