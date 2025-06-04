import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor-container">
      <div class="editor-header">
        <h2>{{ isEditing ? 'Edit Note' : 'New Note' }}</h2>
        <button class="close-btn" (click)="onClose()">×</button>
      </div>

      <div class="editor-content">
        <input
          type="text"
          [(ngModel)]="noteData.title"
          placeholder="Note title"
          class="title-input"
        >

        <textarea
          [(ngModel)]="noteData.content"
          placeholder="Note content"
          class="content-input"
        ></textarea>

        <div class="categories-input">
          <input
            type="text"
            [(ngModel)]="categoryInput"
            placeholder="Add categories (comma-separated)"
            (keyup.enter)="addCategory()"
            class="category-input"
          >
          <div class="categories-list">
            @for (category of noteData.categories; track category) {
              <span class="category-tag">
                {{ category }}
                <button class="remove-category" (click)="removeCategory(category)">×</button>
              </span>
            }
          </div>
        </div>

        <div class="editor-actions">
          <button class="save-btn" (click)="onSave()">Save</button>
          <button class="cancel-btn" (click)="onClose()">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './note-editor.component.css'
})
export class NoteEditorComponent implements OnInit {
  @Input() note: Note | null = null;

  isEditing = false;
  noteData: Partial<Note> = {
    title: '',
    content: '',
    categories: []
  };
  categoryInput: string = '';

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    if (this.note) {
      this.isEditing = true;
      this.noteData = { ...this.note };
    }
  }

  addCategory(): void {
    if (!this.categoryInput.trim()) return;

    const newCategories = this.categoryInput
      .split(',')
      .map(cat => cat.trim())
      .filter(cat => cat && !this.noteData.categories?.includes(cat));

    this.noteData.categories = [
      ...(this.noteData.categories || []),
      ...newCategories
    ];
    this.categoryInput = '';
  }

  removeCategory(category: string): void {
    this.noteData.categories = this.noteData.categories?.filter(c => c !== category);
  }

  onSave(): void {
    if (!this.noteData.title || !this.noteData.content) return;

    if (this.isEditing && this.note) {
      this.noteService.updateNote(this.note.id, this.noteData);
    } else {
      this.noteService.addNote(this.noteData as Omit<Note, 'id' | 'createdAt' | 'updatedAt'>);
    }
    this.onClose();
  }

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
