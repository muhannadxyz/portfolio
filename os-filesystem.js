// Virtual File System using IndexedDB
const FileSystem = (function() {
  const DB_NAME = 'PortfolioOS_FileSystem';
  const DB_VERSION = 1;
  const STORE_NAME = 'files';
  
  let db = null;
  
  // Initialize IndexedDB
  function initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        db = request.result;
        resolve(db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'path' });
          objectStore.createIndex('type', 'type', { unique: false });
          objectStore.createIndex('parent', 'parent', { unique: false });
        }
      };
    });
  }
  
  // File/Folder structure
  class FileNode {
    constructor(name, type, content = '', parent = '/') {
      this.name = name;
      this.type = type; // 'file' or 'folder'
      this.content = content;
      this.parent = parent;
      this.path = parent === '/' ? `/${name}` : `${parent}/${name}`;
      this.created = new Date().toISOString();
      this.modified = new Date().toISOString();
      this.size = type === 'file' ? content.length : 0;
    }
  }
  
  // CRUD Operations
  async function createFile(name, content, parent = '/Home/Documents') {
    if (!db) await initDB();
    
    const file = new FileNode(name, 'file', content, parent);
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(file);
      
      request.onsuccess = () => resolve(file);
      request.onerror = () => reject(request.error);
    });
  }
  
  async function createFolder(name, parent = '/Home') {
    if (!db) await initDB();
    
    const folder = new FileNode(name, 'folder', '', parent);
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(folder);
      
      request.onsuccess = () => resolve(folder);
      request.onerror = () => reject(request.error);
    });
  }
  
  async function readFile(path) {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(path);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async function updateFile(path, newContent) {
    if (!db) await initDB();
    
    const file = await readFile(path);
    if (!file) throw new Error('File not found');
    
    file.content = newContent;
    file.modified = new Date().toISOString();
    file.size = newContent.length;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(file);
      
      request.onsuccess = () => resolve(file);
      request.onerror = () => reject(request.error);
    });
  }
  
  async function deleteFile(path) {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(path);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
  
  async function listDirectory(path) {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('parent');
      const request = index.getAll(path);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async function getAllFiles() {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async function searchFiles(query) {
    const allFiles = await getAllFiles();
    const lowerQuery = query.toLowerCase();
    return allFiles.filter(file => 
      file.name.toLowerCase().includes(lowerQuery) ||
      (file.type === 'file' && file.content.toLowerCase().includes(lowerQuery))
    );
  }
  
  // Check if filesystem is empty (first time setup)
  async function isEmpty() {
    const files = await getAllFiles();
    return files.length === 0;
  }
  
  // Initialize with default structure
  async function initializeFileSystem() {
    if (!db) await initDB();
    
    const empty = await isEmpty();
    if (!empty) return; // Already initialized
    
    console.log('Initializing file system...');
    
    // Create folder structure
    await createFolder('Home', '/');
    await createFolder('Documents', '/Home');
    await createFolder('Projects', '/Home');
    await createFolder('Pictures', '/Home');
    
    console.log('File system initialized');
  }
  
  // Public API
  return {
    init: initializeFileSystem,
    createFile,
    createFolder,
    readFile,
    updateFile,
    deleteFile,
    listDirectory,
    getAllFiles,
    searchFiles,
    isEmpty
  };
})();

// Initialize on load
window.FileSystem = FileSystem;

