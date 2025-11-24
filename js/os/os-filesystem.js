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
  
  // Move file/folder to new location (also used for rename)
  async function moveFile(oldPath, newPath) {
    if (!db) await initDB();
    
    const file = await readFile(oldPath);
    if (!file) throw new Error('File not found');
    
    // Check if destination already exists
    const existing = await readFile(newPath);
    if (existing) throw new Error('Destination already exists');
    
    // Parse new path to get parent and name
    const pathParts = newPath.split('/').filter(p => p);
    const newName = pathParts[pathParts.length - 1];
    const newParent = pathParts.length > 1 ? '/' + pathParts.slice(0, -1).join('/') : '/';
    
    // If it's a folder, we need to update all children's paths
    if (file.type === 'folder') {
      const allFiles = await getAllFiles();
      const children = allFiles.filter(f => f.path.startsWith(oldPath + '/'));
      
      // Update children paths
      for (const child of children) {
        const newChildPath = child.path.replace(oldPath, newPath);
        const childPathParts = newChildPath.split('/').filter(p => p);
        const childName = childPathParts[childPathParts.length - 1];
        const childParent = childPathParts.length > 1 ? '/' + childPathParts.slice(0, -1).join('/') : '/';
        
        child.name = childName;
        child.parent = childParent;
        child.path = newChildPath;
        
        // Delete old and add new
        await deleteFile(child.path.replace(newPath, oldPath));
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        await new Promise((resolve, reject) => {
          const request = store.put(child);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }
    }
    
    // Update file properties
    file.name = newName;
    file.parent = newParent;
    file.path = newPath;
    file.modified = new Date().toISOString();
    
    // Delete old and add new
    await deleteFile(oldPath);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(file);
      
      request.onsuccess = () => resolve(file);
      request.onerror = () => reject(request.error);
    });
  }
  
  // Copy file/folder to new location
  async function copyFile(srcPath, dstPath) {
    if (!db) await initDB();
    
    const srcFile = await readFile(srcPath);
    if (!srcFile) throw new Error('Source file not found');
    
    // Check if destination already exists
    const existing = await readFile(dstPath);
    if (existing) throw new Error('Destination already exists');
    
    // Parse destination path to get parent and name
    const pathParts = dstPath.split('/').filter(p => p);
    const newName = pathParts[pathParts.length - 1];
    const newParent = pathParts.length > 1 ? '/' + pathParts.slice(0, -1).join('/') : '/';
    
    // Create new file node
    const newFile = new FileNode(newName, srcFile.type, srcFile.content, newParent);
    newFile.created = new Date().toISOString();
    newFile.modified = new Date().toISOString();
    
    // If it's a folder, recursively copy all children
    if (srcFile.type === 'folder') {
      const allFiles = await getAllFiles();
      const children = allFiles.filter(f => f.path.startsWith(srcPath + '/'));
      
      // First create the folder
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      await new Promise((resolve, reject) => {
        const request = store.add(newFile);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
      
      // Then copy all children
      for (const child of children) {
        const relativePath = child.path.substring(srcPath.length);
        const newChildPath = dstPath + relativePath;
        await copyFile(child.path, newChildPath);
      }
      
      return newFile;
    } else {
      // For files, just add the copy
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(newFile);
        
        request.onsuccess = () => resolve(newFile);
        request.onerror = () => reject(request.error);
      });
    }
  }
  
  // Rename file/folder (convenience wrapper for moveFile)
  async function renameFile(path, newName) {
    if (!newName || newName.trim() === '') {
      throw new Error('Invalid name');
    }
    
    const file = await readFile(path);
    if (!file) throw new Error('File not found');
    
    // Build new path
    const newPath = file.parent === '/' ? `/${newName}` : `${file.parent}/${newName}`;
    
    // Check if new name already exists
    const existing = await readFile(newPath);
    if (existing) throw new Error('A file with that name already exists');
    
    return await moveFile(path, newPath);
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
    moveFile,
    copyFile,
    renameFile,
    listDirectory,
    getAllFiles,
    searchFiles,
    isEmpty
  };
})();

// Initialize on load
window.FileSystem = FileSystem;

