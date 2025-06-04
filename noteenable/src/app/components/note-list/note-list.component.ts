import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="note-list-container">
      <div class="search-bar">
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          (ngModelChange)="onSearch($event)"
          placeholder="Search notes..."
          class="search-input"
        >
      </div>

      <div class="notes-grid">
        @for (note of filteredNotes; track note.id) {
          <div class="note-card" (click)="onNoteClick(note)">
            <h3>{{ note.title }}</h3>
            <p>{{ note.content | slice:0:100 }}{{ note.content.length > 100 ? '...' : '' }}</p>
            <div class="categories">
              @for (category of note.categories; track category) {
                <span class="category-tag">{{ category }}</span>
              }
            </div>
            <button class="delete-btn" (click)="onDelete(note.id, $event)">Delete</button>
          </div>
        }
      </div>

      <button class="add-note-btn" (click)="onAddNote()">+</button>
    </div>
  `,
  styleUrl: './note-list.component.css'
})
export class NoteListComponent implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  searchQuery: string = '';

  constructor(private noteService: NoteService) {
    this.loadNotes();
  }

  ngOnInit(): void {
    this.loadNotes();
  }

  private loadNotes(): void {
    this.noteService.getNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.filteredNotes = notes;
      },
      error: (error) => {
        console.error('Error loading notes:', error);
      }
    });
  }

  onSearch(query: string): void {
    if (!query.trim()) {
      this.filteredNotes = this.notes;
      return;
    }
    this.noteService.searchNotes(query).subscribe(notes => {
      this.filteredNotes = notes;
    });
  }

  @Output() addNote = new EventEmitter<void>();
  @Output() editNote = new EventEmitter<Note>();

  onAddNote(): void {
    this.addNote.emit();
  }

  onNoteClick(note: Note): void {
    this.editNote.emit(note);
  }

  onDelete(id: string, event: Event): void {
    event.stopPropagation();
    this.noteService.deleteNote(id);
  }
}
