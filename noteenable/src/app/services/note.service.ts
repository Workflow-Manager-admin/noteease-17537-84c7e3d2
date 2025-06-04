import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private notes: Note[] = [];
  private notesSubject = new BehaviorSubject<Note[]>([]);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadNotes();
  }

  private loadNotes(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      const savedNotes = globalThis.window?.localStorage?.getItem('notes');
      if (savedNotes) {
        this.notes = JSON.parse(savedNotes);
        this.notesSubject.next(this.notes);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }

  private saveToLocalStorage(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      globalThis.window?.localStorage?.setItem('notes', JSON.stringify(this.notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }

  getNotes(): Observable<Note[]> {
    return this.notesSubject.asObservable();
  }

  addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.notes = [...this.notes, newNote];
    this.notesSubject.next(this.notes);
    this.saveToLocalStorage();
  }

  updateNote(id: string, note: Partial<Note>): void {
    this.notes = this.notes.map(n => 
      n.id === id ? { ...n, ...note, updatedAt: new Date() } : n
    );
    this.notesSubject.next(this.notes);
    this.saveToLocalStorage();
  }

  deleteNote(id: string): void {
    this.notes = this.notes.filter(n => n.id !== id);
    this.notesSubject.next(this.notes);
    this.saveToLocalStorage();
  }

  searchNotes(query: string): Observable<Note[]> {
    return this.notesSubject.pipe(
      map(notes => notes.filter(note => 
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  getCategories(): string[] {
    const categoriesSet = new Set<string>();
    this.notes.forEach(note => {
      note.categories.forEach(category => categoriesSet.add(category));
    });
    return Array.from(categoriesSet);
  }
}
