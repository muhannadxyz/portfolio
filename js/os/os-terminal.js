// Terminal App - Enhanced Unix-like CLI
const TerminalApp = (function() {
  let commandHistory = [];
  let historyIndex = -1;
  let theme = 'green'; // 'green', 'amber', 'blue'
  let aliases = {};
  
  const themes = {
    green: { bg: '#000', fg: '#00ff00', accent: '#00ffe1' },
    amber: { bg: '#1a1a0d', fg: '#ffb000', accent: '#ffd700' },
    blue: { bg: '#0d1117', fg: '#58a6ff', accent: '#79c0ff' }
  };
  
  // Load history and aliases from localStorage
  function loadPersistentData() {
    const savedHistory = localStorage.getItem('terminal_history');
    if (savedHistory) {
      try {
        commandHistory = JSON.parse(savedHistory);
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
    
    const savedAliases = localStorage.getItem('terminal_aliases');
    if (savedAliases) {
      try {
        aliases = JSON.parse(savedAliases);
      } catch (e) {
        console.error('Error loading aliases:', e);
      }
    }
    
    const savedTheme = localStorage.getItem('terminal_theme');
    if (savedTheme && themes[savedTheme]) {
      theme = savedTheme;
    }
  }
  
  function savePersistentData() {
    localStorage.setItem('terminal_history', JSON.stringify(commandHistory.slice(-100))); // Keep last 100
    localStorage.setItem('terminal_aliases', JSON.stringify(aliases));
    localStorage.setItem('terminal_theme', theme);
  }
  
  function createTerminalContent() {
    loadPersistentData();
    
    const container = document.createElement('div');
    container.className = 'terminal-container';
    const currentTheme = themes[theme];
    container.style.cssText = `height: 100%; display: flex; flex-direction: column; background: ${currentTheme.bg}; color: ${currentTheme.fg}; font-family: "Courier New", monospace; font-size: 14px; padding: 16px;`;
    
    const output = document.createElement('div');
    output.className = 'terminal-output';
    output.style.cssText = 'flex: 1; overflow-y: auto; margin-bottom: 12px;';
    output.innerHTML = `<div style="color: ${currentTheme.accent};">Portfolio OS Terminal v2.0</div><div style="color: #999; margin-bottom: 12px;">Type 'help' for available commands</div>`;
    
    const inputLine = document.createElement('div');
    inputLine.style.cssText = 'display: flex; align-items: center; gap: 8px;';
    
    const prompt = document.createElement('span');
    prompt.className = 'terminal-prompt';
    prompt.style.color = currentTheme.accent;
    prompt.textContent = getPrompt();
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'terminal-input';
    input.style.cssText = `flex: 1; background: transparent; border: none; outline: none; color: ${currentTheme.fg}; font-family: inherit; font-size: inherit;`;
    input.autocomplete = 'off';
    
    inputLine.appendChild(prompt);
    inputLine.appendChild(input);
    
    container.appendChild(output);
    container.appendChild(inputLine);
    
    // Setup events
    setTimeout(() => {
      input.focus();
      setupTerminalEvents(input, output, prompt, container);
    }, 100);
    
    return container;
  }
  
  function getPrompt() {
    const cwd = OSState.getCurrentDirectory();
    return `user@portfolioOS:${cwd}$`;
  }
  
  function setupTerminalEvents(input, output, prompt, container) {
    input.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        await handleCommand(input.value, output, prompt, container);
        input.value = '';
        historyIndex = -1;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0) {
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[commandHistory.length - 1 - historyIndex];
          }
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          input.value = commandHistory[commandHistory.length - 1 - historyIndex];
        } else if (historyIndex === 0) {
          historyIndex = -1;
          input.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        // Tab completion
        const completion = await attemptTabCompletion(input.value);
        if (completion) {
          input.value = completion;
        }
      }
    });
    
    // Copy/paste support
    input.addEventListener('copy', (e) => {
      // Already handled by browser
    });
    
    input.addEventListener('paste', (e) => {
      // Already handled by browser
    });
  }
  
  async function attemptTabCompletion(partial) {
    if (!partial.trim()) return null;
    
    const parts = partial.split(' ');
    const lastPart = parts[parts.length - 1];
    
    if (parts.length === 1) {
      // Complete command name
      const commands = ['help', 'ls', 'cd', 'pwd', 'cat', 'mkdir', 'touch', 'rm', 'open', 'clear', 'mv', 'cp', 'find', 'grep', 'echo', 'theme', 'alias', 'history'];
      const matches = commands.filter(cmd => cmd.startsWith(lastPart));
      if (matches.length === 1) {
        return matches[0];
      }
    } else {
      // Complete file/folder name
      try {
        const cwd = OSState.getCurrentDirectory();
        const files = await FileSystem.listDirectory(cwd);
        const matches = files.filter(f => f.name.startsWith(lastPart)).map(f => f.name);
        if (matches.length === 1) {
          parts[parts.length - 1] = matches[0];
          return parts.join(' ');
        }
      } catch (e) {
        return null;
      }
    }
    
    return null;
  }
  
  async function handleCommand(cmd, output, prompt, container) {
    if (!cmd.trim()) return;
    
    // Add to history
    commandHistory.push(cmd);
    savePersistentData();
    
    // Echo command
    const currentTheme = themes[theme];
    addOutput(output, `${prompt.textContent} ${cmd}`, currentTheme.accent);
    
    // Check for aliases
    const parts = cmd.trim().split(/\s+/);
    let command = parts[0];
    if (aliases[command]) {
      command = aliases[command];
      parts[0] = command;
      cmd = parts.join(' ');
    }
    
    const args = parts.slice(1);
    
    // Execute command
    try {
      await executeCommand(command, args, output, container);
    } catch (error) {
      addOutput(output, `Error: ${error.message}`, '#ff5f57');
    }
    
    // Update prompt
    prompt.textContent = getPrompt();
    
    // Scroll to bottom
    output.scrollTop = output.scrollHeight;
  }
  
  async function executeCommand(cmd, args, output, container) {
    switch (cmd) {
      case 'help':
        addOutput(output, 'Available commands:');
        addOutput(output, '  ls        - List files in current directory');
        addOutput(output, '  cd <dir>  - Change directory');
        addOutput(output, '  pwd       - Print working directory');
        addOutput(output, '  cat <file> - Display file contents');
        addOutput(output, '  mkdir <dir> - Create directory');
        addOutput(output, '  touch <file> - Create empty file');
        addOutput(output, '  rm <file> - Remove file');
        addOutput(output, '  mv <src> <dst> - Move/rename file');
        addOutput(output, '  cp <src> <dst> - Copy file');
        addOutput(output, '  find <name> - Find files by name');
        addOutput(output, '  grep <pattern> <file> - Search in file');
        addOutput(output, '  echo <text> - Print text');
        addOutput(output, '  open <file> - Open file in TextEdit');
        addOutput(output, '  clear     - Clear terminal');
        addOutput(output, '  theme <name> - Change theme (green/amber/blue)');
        addOutput(output, '  alias <name>=<cmd> - Create command alias');
        addOutput(output, '  history   - Show command history');
        break;
      
      case 'pwd':
        addOutput(output, OSState.getCurrentDirectory());
        break;
      
      case 'ls':
        await cmdLs(output);
        break;
      
      case 'cd':
        await cmdCd(args[0], output);
        break;
      
      case 'cat':
        await cmdCat(args[0], output);
        break;
      
      case 'mkdir':
        await cmdMkdir(args[0], output);
        break;
      
      case 'touch':
        await cmdTouch(args[0], output);
        break;
      
      case 'rm':
        await cmdRm(args[0], output);
        break;
      
      case 'mv':
        await cmdMv(args[0], args[1], output);
        break;
      
      case 'cp':
        await cmdCp(args[0], args[1], output);
        break;
      
      case 'find':
        await cmdFind(args[0], output);
        break;
      
      case 'grep':
        await cmdGrep(args[0], args[1], output);
        break;
      
      case 'echo':
        addOutput(output, args.join(' '));
        break;
      
      case 'open':
        await cmdOpen(args[0], output);
        break;
      
      case 'clear':
        output.innerHTML = '';
        break;
      
      case 'theme':
        if (args[0] && themes[args[0]]) {
          theme = args[0];
          savePersistentData();
          addOutput(output, `Theme changed to ${args[0]}. Reopen terminal to see changes.`, themes[theme].accent);
        } else {
          addOutput(output, `Available themes: ${Object.keys(themes).join(', ')}`);
        }
        break;
      
      case 'alias':
        if (args[0]) {
          const [name, cmd] = args.join(' ').split('=');
          if (name && cmd) {
            aliases[name.trim()] = cmd.trim();
            savePersistentData();
            addOutput(output, `Alias created: ${name} = ${cmd}`, themes[theme].accent);
          } else {
            addOutput(output, 'Usage: alias name=command', '#ff5f57');
          }
        } else {
          if (Object.keys(aliases).length === 0) {
            addOutput(output, 'No aliases defined');
          } else {
            Object.entries(aliases).forEach(([name, cmd]) => {
              addOutput(output, `${name} = ${cmd}`);
            });
          }
        }
        break;
      
      case 'history':
        commandHistory.forEach((cmd, i) => {
          addOutput(output, `${i + 1}  ${cmd}`);
        });
        break;
      
      default:
        addOutput(output, `Command not found: ${cmd}`, '#ff5f57');
        addOutput(output, 'Type "help" for available commands', '#999');
    }
  }
  
  async function cmdLs(output) {
    const cwd = OSState.getCurrentDirectory();
    const files = await FileSystem.listDirectory(cwd);
    
    if (files.length === 0) {
      addOutput(output, '(empty)', '#999');
      return;
    }
    
    files.forEach(file => {
      const icon = file.type === 'folder' ? '📁' : '📄';
      const color = file.type === 'folder' ? '#2a82ff' : '#e6e6e6';
      addOutput(output, `${icon} ${file.name}`, color);
    });
  }
  
  async function cmdCd(dir, output) {
    if (!dir) {
      OSState.setCurrentDirectory('/Home');
      return;
    }
    
    const cwd = OSState.getCurrentDirectory();
    let newPath;
    
    if (dir === '..') {
      const parts = cwd.split('/').filter(p => p);
      parts.pop();
      newPath = '/' + parts.join('/');
      if (newPath === '') newPath = '/';
    } else if (dir.startsWith('/')) {
      newPath = dir;
    } else {
      newPath = cwd === '/' ? `/${dir}` : `${cwd}/${dir}`;
    }
    
    try {
      const files = await FileSystem.listDirectory(newPath === '/' ? '' : newPath.substring(0, newPath.lastIndexOf('/')));
      const exists = files.some(f => f.path === newPath && f.type === 'folder');
      
      if (exists || newPath === '/' || newPath === '/Home') {
        OSState.setCurrentDirectory(newPath);
      } else {
        addOutput(output, `cd: no such directory: ${dir}`, '#ff5f57');
      }
    } catch (error) {
      addOutput(output, `cd: no such directory: ${dir}`, '#ff5f57');
    }
  }
  
  async function cmdCat(filename, output) {
    if (!filename) {
      addOutput(output, 'cat: missing filename', '#ff5f57');
      return;
    }
    
    const cwd = OSState.getCurrentDirectory();
    const path = filename.startsWith('/') ? filename : `${cwd}/${filename}`;
    
    const file = await FileSystem.readFile(path);
    if (!file) {
      addOutput(output, `cat: ${filename}: No such file`, '#ff5f57');
      return;
    }
    
    if (file.type === 'folder') {
      addOutput(output, `cat: ${filename}: Is a directory`, '#ff5f57');
      return;
    }
    
    addOutput(output, file.content);
  }
  
  async function cmdMkdir(dirname, output) {
    if (!dirname) {
      addOutput(output, 'mkdir: missing directory name', '#ff5f57');
      return;
    }
    
    const cwd = OSState.getCurrentDirectory();
    try {
      await FileSystem.createFolder(dirname, cwd);
      addOutput(output, `Created directory: ${dirname}`, themes[theme].accent);
    } catch (error) {
      addOutput(output, `mkdir: ${error.message}`, '#ff5f57');
    }
  }
  
  async function cmdTouch(filename, output) {
    if (!filename) {
      addOutput(output, 'touch: missing filename', '#ff5f57');
      return;
    }
    
    const cwd = OSState.getCurrentDirectory();
    try {
      await FileSystem.createFile(filename, '', cwd);
      addOutput(output, `Created file: ${filename}`, themes[theme].accent);
    } catch (error) {
      addOutput(output, `touch: ${error.message}`, '#ff5f57');
    }
  }
  
  async function cmdRm(filename, output) {
    if (!filename) {
      addOutput(output, 'rm: missing filename', '#ff5f57');
      return;
    }
    
    const cwd = OSState.getCurrentDirectory();
    const path = filename.startsWith('/') ? filename : `${cwd}/${filename}`;
    
    try {
      await FileSystem.deleteFile(path);
      addOutput(output, `Removed: ${filename}`, themes[theme].accent);
    } catch (error) {
      addOutput(output, `rm: ${error.message}`, '#ff5f57');
    }
  }
  
  async function cmdMv(src, dst, output) {
    if (!src || !dst) {
      addOutput(output, 'mv: missing source or destination', '#ff5f57');
      return;
    }
    
    const cwd = OSState.getCurrentDirectory();
    const srcPath = src.startsWith('/') ? src : `${cwd}/${src}`;
    
    // Check if source exists
    const srcFile = await FileSystem.readFile(srcPath);
    if (!srcFile) {
      addOutput(output, `mv: ${src}: No such file or directory`, '#ff5f57');
      return;
    }
    
    // Resolve destination path
    let dstPath;
    if (dst.startsWith('/')) {
      dstPath = dst;
    } else {
      // Check if destination is an existing directory
      const dstFile = await FileSystem.readFile(`${cwd}/${dst}`);
      if (dstFile && dstFile.type === 'folder') {
        // Moving into a directory
        dstPath = `${dstFile.path}/${srcFile.name}`;
      } else {
        // Renaming or moving to new location in current directory
        dstPath = `${cwd}/${dst}`;
      }
    }
    
    try {
      await FileSystem.moveFile(srcPath, dstPath);
      addOutput(output, `Moved: ${src} -> ${dstPath}`, themes[theme].accent);
    } catch (error) {
      addOutput(output, `mv: ${error.message}`, '#ff5f57');
    }
  }
  
  async function cmdCp(src, dst, output) {
    if (!src || !dst) {
      addOutput(output, 'cp: missing source or destination', '#ff5f57');
      return;
    }
    
    const cwd = OSState.getCurrentDirectory();
    const srcPath = src.startsWith('/') ? src : `${cwd}/${src}`;
    
    // Check if source exists
    const srcFile = await FileSystem.readFile(srcPath);
    if (!srcFile) {
      addOutput(output, `cp: ${src}: No such file or directory`, '#ff5f57');
      return;
    }
    
    // Resolve destination path
    let dstPath;
    if (dst.startsWith('/')) {
      dstPath = dst;
    } else {
      // Check if destination is an existing directory
      const dstFile = await FileSystem.readFile(`${cwd}/${dst}`);
      if (dstFile && dstFile.type === 'folder') {
        // Copying into a directory
        dstPath = `${dstFile.path}/${srcFile.name}`;
      } else {
        // Copying to new location in current directory
        dstPath = `${cwd}/${dst}`;
      }
    }
    
    try {
      await FileSystem.copyFile(srcPath, dstPath);
      addOutput(output, `Copied: ${src} -> ${dstPath}`, themes[theme].accent);
    } catch (error) {
      addOutput(output, `cp: ${error.message}`, '#ff5f57');
    }
  }
  
  async function cmdFind(pattern, output) {
    if (!pattern) {
      addOutput(output, 'find: missing search pattern', '#ff5f57');
      return;
    }
    
    const cwd = OSState.getCurrentDirectory();
    
    try {
      // Get all files and search recursively from current directory
      const allFiles = await FileSystem.getAllFiles();
      const cwdPath = cwd === '/' ? '' : cwd;
      const matches = allFiles.filter(file => {
        // Check if file is within current directory tree
        if (cwdPath && !file.path.startsWith(cwdPath + '/') && file.path !== cwdPath) {
          return false;
        }
        // Check if filename matches pattern
        return file.name.toLowerCase().includes(pattern.toLowerCase());
      });
      
      if (matches.length === 0) {
        addOutput(output, 'No matches found', '#999');
      } else {
        matches.forEach(file => {
          const relativePath = file.path.startsWith(cwd + '/') 
            ? file.path.substring(cwd.length + 1)
            : file.path;
          addOutput(output, relativePath, themes[theme].accent);
        });
        addOutput(output, `Found ${matches.length} match(es)`, '#999');
      }
    } catch (error) {
      addOutput(output, `find: ${error.message}`, '#ff5f57');
    }
  }
  
  async function cmdGrep(pattern, filename, output) {
    if (!pattern || !filename) {
      addOutput(output, 'grep: missing pattern or filename', '#ff5f57');
      return;
    }
    
    const cwd = OSState.getCurrentDirectory();
    const path = filename.startsWith('/') ? filename : `${cwd}/${filename}`;
    
    const file = await FileSystem.readFile(path);
    if (!file) {
      addOutput(output, `grep: ${filename}: No such file`, '#ff5f57');
      return;
    }
    
    const lines = file.content.split('\n');
    const matches = lines.filter(line => line.includes(pattern));
    
    if (matches.length === 0) {
      addOutput(output, 'No matches found', '#999');
    } else {
      matches.forEach(line => {
        addOutput(output, line, themes[theme].accent);
      });
    }
  }
  
  async function cmdOpen(filename, output) {
    if (!filename) {
      addOutput(output, 'open: missing filename', '#ff5f57');
      return;
    }
    
    const cwd = OSState.getCurrentDirectory();
    const path = filename.startsWith('/') ? filename : `${cwd}/${filename}`;
    
    const file = await FileSystem.readFile(path);
    if (!file) {
      addOutput(output, `open: ${filename}: No such file`, '#ff5f57');
      return;
    }
    
    if (file.type === 'folder') {
      addOutput(output, `open: ${filename}: Is a directory`, '#ff5f57');
      return;
    }
    
    TextEditApp.open(file.name, file.content, file.path);
    addOutput(output, `Opened ${filename} in TextEdit`, themes[theme].accent);
  }
  
  function addOutput(output, text, color) {
    const currentTheme = themes[theme];
    const line = document.createElement('div');
    line.style.color = color || currentTheme.fg;
    line.textContent = text;
    output.appendChild(line);
  }
  
  function open() {
    const existing = WindowManager.getWindowByApp('terminal');
    if (existing) {
      WindowManager.focusWindow(existing.id);
      return;
    }
    
    const content = createTerminalContent();
    WindowManager.createWindow('terminal', 'Terminal', content, {
      width: 700,
      height: 500,
      left: 200,
      top: 150
    });
  }
  
  return {
    open
  };
})();

window.TerminalApp = TerminalApp;

