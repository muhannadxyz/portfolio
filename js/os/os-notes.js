// Notes App - Quick Note-Taking Application
const NotesApp = (function() {
  let notes = [];
  let currentNoteId = null;
  
  // Load notes from localStorage
  function loadNotes() {
    const saved = localStorage.getItem('notes_app_data');
    if (saved) {
      try {
        notes = JSON.parse(saved);
      } catch (e) {
        console.error('Error loading notes:', e);
        notes = [];
      }
    }
    if (notes.length === 0) {
      // Create default note
      createNewNote();
    }
  }
  
  // Save notes to localStorage
  function saveNotes() {
    localStorage.setItem('notes_app_data', JSON.stringify(notes));
  }
  
  // Create a new note
  function createNewNote() {
    const note = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: '',
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
    notes.unshift(note);
    currentNoteId = note.id;
    saveNotes();
    return note;
  }
  
  // Get note by ID
  function getNote(id) {
    return notes.find(n => n.id === id);
  }
  
  // Update note
  function updateNote(id, updates) {
    const note = getNote(id);
    if (note) {
      Object.assign(note, updates);
      note.modified = new Date().toISOString();
      saveNotes();
      return note;
    }
    return null;
  }
  
  // Delete note
  function deleteNote(id) {
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes.splice(index, 1);
      saveNotes();
      if (currentNoteId === id) {
        currentNoteId = notes.length > 0 ? notes[0].id : null;
        if (notes.length === 0) {
          createNewNote();
        }
      }
      return true;
    }
    return false;
  }
  
  // Search notes
  function searchNotes(query) {
    if (!query || query.trim() === '') return notes;
    const lowerQuery = query.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery)
    );
  }
  
  function createNotesContent() {
    loadNotes();
    
    const container = document.createElement('div');
    container.className = 'notes-container';
    container.style.cssText = 'height: 100%; display: flex; font-family: -apple-system, sans-serif;';
    
    // Sidebar with note list
    const sidebar = document.createElement('div');
    sidebar.className = 'notes-sidebar';
    sidebar.style.cssText = 'width: 250px; background: rgba(20, 20, 20, 0.9); border-right: 1px solid rgba(0, 255, 225, 0.1); display: flex; flex-direction: column;';
    
    // Search bar
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = 'padding: 12px; border-bottom: 1px solid rgba(0, 255, 225, 0.1);';
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search notes...';
    searchInput.style.cssText = 'width: 100%; padding: 8px 12px; background: rgba(0, 255, 225, 0.05); border: 1px solid rgba(0, 255, 225, 0.2); border-radius: 6px; color: #e6e6e6; font-size: 13px; outline: none;';
    searchContainer.appendChild(searchInput);
    
    // New note button
    const newNoteBtn = document.createElement('button');
    newNoteBtn.textContent = '+ New Note';
    newNoteBtn.style.cssText = 'width: 100%; padding: 10px; margin-top: 8px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 6px; color: #00ffe1; cursor: pointer; font-size: 13px; font-weight: 600;';
    newNoteBtn.addEventListener('click', () => {
      const note = createNewNote();
      renderNotesList(sidebar, editorContainer, searchInput.value);
      selectNote(note.id, sidebar, editorContainer);
    });
    searchContainer.appendChild(newNoteBtn);
    sidebar.appendChild(searchContainer);
    
    // Notes list
    const notesList = document.createElement('div');
    notesList.className = 'notes-list';
    notesList.style.cssText = 'flex: 1; overflow-y: auto;';
    sidebar.appendChild(notesList);
    
    // Editor area
    const editorContainer = document.createElement('div');
    editorContainer.className = 'notes-editor';
    editorContainer.style.cssText = 'flex: 1; display: flex; flex-direction: column; background: rgba(13, 13, 13, 0.8);';
    
    // Editor toolbar
    const toolbar = document.createElement('div');
    toolbar.style.cssText = 'padding: 12px 16px; border-bottom: 1px solid rgba(0, 255, 225, 0.1); display: flex; justify-content: space-between; align-items: center;';
    
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Note title...';
    titleInput.style.cssText = 'flex: 1; padding: 8px 12px; background: rgba(0, 255, 225, 0.05); border: 1px solid rgba(0, 255, 225, 0.2); border-radius: 6px; color: #e6e6e6; font-size: 14px; font-weight: 600; outline: none; margin-right: 12px;';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️ Delete';
    deleteBtn.style.cssText = 'padding: 8px 16px; background: rgba(255, 95, 87, 0.1); border: 1px solid rgba(255, 95, 87, 0.3); border-radius: 6px; color: #ff5f57; cursor: pointer; font-size: 12px;';
    deleteBtn.addEventListener('click', () => {
      if (currentNoteId && confirm('Delete this note?')) {
        deleteNote(currentNoteId);
        renderNotesList(sidebar, editorContainer, searchInput.value);
        if (notes.length > 0) {
          selectNote(notes[0].id, sidebar, editorContainer);
        }
      }
    });
    
    toolbar.appendChild(titleInput);
    toolbar.appendChild(deleteBtn);
    editorContainer.appendChild(toolbar);
    
    // Editor textarea
    const editor = document.createElement('textarea');
    editor.className = 'notes-editor-textarea';
    editor.style.cssText = 'flex: 1; padding: 16px; background: transparent; border: none; color: #e6e6e6; font-size: 14px; line-height: 1.6; font-family: -apple-system, sans-serif; resize: none; outline: none;';
    editor.placeholder = 'Start typing your note...';
    editorContainer.appendChild(editor);
    
    // Auto-save on input
    let saveTimeout;
    editor.addEventListener('input', () => {
      if (currentNoteId) {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          updateNote(currentNoteId, {
            content: editor.value,
            title: titleInput.value || 'Untitled Note'
          });
          renderNotesList(sidebar, editorContainer, searchInput.value);
        }, 500);
      }
    });
    
    titleInput.addEventListener('input', () => {
      if (currentNoteId) {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          updateNote(currentNoteId, {
            title: titleInput.value || 'Untitled Note',
            content: editor.value
          });
          renderNotesList(sidebar, editorContainer, searchInput.value);
        }, 500);
      }
    });
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
      renderNotesList(sidebar, editorContainer, e.target.value);
    });
    
    container.appendChild(sidebar);
    container.appendChild(editorContainer);
    
    // Render initial list and select first note
    renderNotesList(sidebar, editorContainer, '');
    if (notes.length > 0) {
      selectNote(notes[0].id, sidebar, editorContainer);
    }
    
    return container;
  }
  
  function renderNotesList(sidebar, editorContainer, searchQuery) {
    const notesList = sidebar.querySelector('.notes-list');
    const filteredNotes = searchQuery ? searchNotes(searchQuery) : notes;
    
    notesList.innerHTML = '';
    
    if (filteredNotes.length === 0) {
      notesList.innerHTML = '<div style="padding: 20px; text-align: center; color: #666; font-size: 13px;">No notes found</div>';
      return;
    }
    
    filteredNotes.forEach(note => {
      const noteItem = document.createElement('div');
      noteItem.className = 'note-item';
      noteItem.dataset.noteId = note.id;
      noteItem.style.cssText = `
        padding: 12px;
        border-bottom: 1px solid rgba(0, 255, 225, 0.05);
        cursor: pointer;
        transition: background 0.2s;
        ${currentNoteId === note.id ? 'background: rgba(0, 255, 225, 0.1);' : ''}
      `;
      
      const title = document.createElement('div');
      title.style.cssText = 'color: #e6e6e6; font-weight: 600; font-size: 13px; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
      title.textContent = note.title;
      
      const preview = document.createElement('div');
      preview.style.cssText = 'color: #999; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
      preview.textContent = note.content.substring(0, 50) || 'Empty note';
      
      const date = document.createElement('div');
      date.style.cssText = 'color: #666; font-size: 10px; margin-top: 4px;';
      date.textContent = new Date(note.modified).toLocaleDateString();
      
      noteItem.appendChild(title);
      noteItem.appendChild(preview);
      noteItem.appendChild(date);
      
      noteItem.addEventListener('click', () => {
        selectNote(note.id, sidebar, editorContainer);
      });
      
      noteItem.addEventListener('mouseenter', () => {
        if (currentNoteId !== note.id) {
          noteItem.style.background = 'rgba(0, 255, 225, 0.05)';
        }
      });
      
      noteItem.addEventListener('mouseleave', () => {
        if (currentNoteId !== note.id) {
          noteItem.style.background = '';
        }
      });
      
      notesList.appendChild(noteItem);
    });
  }
  
  function selectNote(noteId, sidebar, editorContainer) {
    currentNoteId = noteId;
    const note = getNote(noteId);
    if (!note) return;
    
    const titleInput = editorContainer.querySelector('input[type="text"]');
    const editor = editorContainer.querySelector('.notes-editor-textarea');
    
    titleInput.value = note.title;
    editor.value = note.content;
    
    renderNotesList(sidebar, editorContainer, sidebar.querySelector('input[type="text"]').value);
  }
  
  function open() {
    const existing = WindowManager.getWindowByApp('notes');
    if (existing) {
      WindowManager.focusWindow(existing.id);
      return;
    }
    
    const content = createNotesContent();
    WindowManager.createWindow('notes', 'Notes', content, {
      width: 900,
      height: 700
    });
  }
  
  return {
    open
  };
})();

window.NotesApp = NotesApp;

