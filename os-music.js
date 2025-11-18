// Music Player App
const MusicApp = (function() {
  let library = [];
  let currentTrack = null;
  let currentTrackIndex = -1;
  let isPlaying = false;
  let audio = null;
  let isShuffle = false;
  let isRepeat = false;
  let isMiniMode = false;
  
  // Load library from localStorage
  function loadLibrary() {
    const saved = localStorage.getItem('music_library');
    if (saved) {
      try {
        library = JSON.parse(saved);
      } catch (e) {
        console.error('Error loading library:', e);
      }
    }
  }
  
  function saveLibrary() {
    localStorage.setItem('music_library', JSON.stringify(library));
  }
  
  function createMusicContent() {
    loadLibrary();
    
    const container = document.createElement('div');
    container.className = 'music-container';
    container.style.cssText = 'height: 100%; display: flex; flex-direction: column; background: linear-gradient(135deg, #1a1a2e, #0d0d0d); font-family: -apple-system, sans-serif;';
    
    // Header with add music button
    const header = document.createElement('div');
    header.style.cssText = 'padding: 16px; background: rgba(30, 30, 30, 0.8); border-bottom: 1px solid rgba(0, 255, 225, 0.1); display: flex; justify-content: space-between; align-items: center;';
    header.innerHTML = `
      <h2 style="color: #00ffe1; font-size: 18px; margin: 0;">🎵 Music Library</h2>
      <button class="add-music-btn" style="padding: 8px 16px; background: rgba(0, 255, 225, 0.15); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 6px; color: #00ffe1; cursor: pointer; font-size: 13px; font-weight: 600;">+ Add Music</button>
    `;
    
    // Library view
    const libraryView = document.createElement('div');
    libraryView.className = 'music-library';
    libraryView.style.cssText = 'flex: 1; overflow-y: auto; padding: 16px;';
    
    // Player controls (bottom)
    const playerControls = document.createElement('div');
    playerControls.className = 'music-player';
    playerControls.style.cssText = 'background: rgba(20, 20, 20, 0.95); border-top: 1px solid rgba(0, 255, 225, 0.2); padding: 20px; backdrop-filter: blur(10px);';
    playerControls.innerHTML = `
      <div style="margin-bottom: 16px;">
        <div class="now-playing" style="color: #00ffe1; font-weight: 600; font-size: 16px; margin-bottom: 4px;">No track selected</div>
        <div class="track-artist" style="color: #999; font-size: 13px;">Select a track to play</div>
      </div>
      
      <div style="margin-bottom: 16px;">
        <input type="range" class="progress-bar music-player-progress" min="0" max="100" value="0" style="width: 100%;">
        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #999; margin-top: 4px;">
          <span class="current-time">0:00</span>
          <span class="total-time">0:00</span>
        </div>
      </div>
      
      <div style="display: flex; justify-content: center; align-items: center; gap: 16px; margin-bottom: 16px;">
        <button class="shuffle-btn" style="padding: 8px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 50%; color: #00ffe1; cursor: pointer; font-size: 16px; width: 40px; height: 40px;">🔀</button>
        <button class="prev-btn" style="padding: 8px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 50%; color: #00ffe1; cursor: pointer; font-size: 18px; width: 48px; height: 48px;">⏮</button>
        <button class="play-pause-btn" style="padding: 8px; background: rgba(0, 255, 225, 0.2); border: 1px solid rgba(0, 255, 225, 0.5); border-radius: 50%; color: #00ffe1; cursor: pointer; font-size: 24px; width: 60px; height: 60px;">▶️</button>
        <button class="next-btn" style="padding: 8px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 50%; color: #00ffe1; cursor: pointer; font-size: 18px; width: 48px; height: 48px;">⏭</button>
        <button class="repeat-btn" style="padding: 8px; background: rgba(0, 255, 225, 0.1); border: 1px solid rgba(0, 255, 225, 0.3); border-radius: 50%; color: #00ffe1; cursor: pointer; font-size: 16px; width: 40px; height: 40px;">🔁</button>
      </div>
      
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 16px;">🔊</span>
        <input type="range" class="volume-slider music-player-volume" min="0" max="100" value="50" style="flex: 1;">
        <span class="volume-display" style="color: #00ffe1; font-size: 13px; min-width: 35px;">50%</span>
      </div>
    `;
    
    container.appendChild(header);
    container.appendChild(libraryView);
    container.appendChild(playerControls);
    
    // Setup events
    setTimeout(() => {
      renderLibrary(libraryView);
      setupMusicEvents(container, header, libraryView, playerControls);
    }, 100);
    
    return container;
  }
  
  function renderLibrary(libraryView) {
    if (library.length === 0) {
      libraryView.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #999;">
          <div style="font-size: 64px; margin-bottom: 20px;">🎵</div>
          <div style="font-size: 18px; margin-bottom: 12px;">Your library is empty</div>
          <div style="font-size: 14px;">Click "+ Add Music" to add tracks</div>
        </div>
      `;
      return;
    }
    
    libraryView.innerHTML = '';
    
    library.forEach((track, index) => {
      const trackEl = document.createElement('div');
      trackEl.className = 'track-item';
      trackEl.style.cssText = `display: flex; align-items: center; gap: 16px; padding: 12px; background: rgba(30, 30, 30, 0.5); border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; border: 1px solid ${currentTrackIndex === index ? 'rgba(0, 255, 225, 0.5)' : 'transparent'};`;
      
      trackEl.innerHTML = `
        <div style="font-size: 32px;">${track.isPlaying ? '🔊' : '🎵'}</div>
        <div style="flex: 1; min-width: 0;">
          <div style="color: ${currentTrackIndex === index ? '#00ffe1' : '#e6e6e6'}; font-weight: 600; font-size: 14px; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${track.title}</div>
          <div style="color: #999; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${track.artist || 'Unknown Artist'}</div>
        </div>
        <button class="delete-track-btn" data-index="${index}" style="padding: 6px 12px; background: rgba(255, 95, 87, 0.1); border: 1px solid rgba(255, 95, 87, 0.3); border-radius: 4px; color: #ff5f57; cursor: pointer; font-size: 11px;">Delete</button>
      `;
      
      trackEl.addEventListener('click', (e) => {
        if (!e.target.closest('.delete-track-btn')) {
          playTrack(index);
        }
      });
      
      trackEl.addEventListener('mouseenter', () => {
        trackEl.style.background = 'rgba(30, 30, 30, 0.8)';
        trackEl.style.transform = 'translateX(4px)';
      });
      
      trackEl.addEventListener('mouseleave', () => {
        trackEl.style.background = 'rgba(30, 30, 30, 0.5)';
        trackEl.style.transform = 'translateX(0)';
      });
      
      libraryView.appendChild(trackEl);
    });
    
    // Setup delete buttons
    libraryView.querySelectorAll('.delete-track-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        deleteTrack(index, libraryView);
      });
    });
  }
  
  function setupMusicEvents(container, header, libraryView, playerControls) {
    const addBtn = header.querySelector('.add-music-btn');
    const playPauseBtn = playerControls.querySelector('.play-pause-btn');
    const prevBtn = playerControls.querySelector('.prev-btn');
    const nextBtn = playerControls.querySelector('.next-btn');
    const shuffleBtn = playerControls.querySelector('.shuffle-btn');
    const repeatBtn = playerControls.querySelector('.repeat-btn');
    const progressBar = playerControls.querySelector('.progress-bar');
    const volumeSlider = playerControls.querySelector('.volume-slider');
    const volumeDisplay = playerControls.querySelector('.volume-display');
    
    // Add music
    addBtn.addEventListener('click', () => {
      showAddMusicDialog(libraryView);
    });
    
    addBtn.addEventListener('mouseenter', () => {
      addBtn.style.background = 'rgba(0, 255, 225, 0.25)';
    });
    
    addBtn.addEventListener('mouseleave', () => {
      addBtn.style.background = 'rgba(0, 255, 225, 0.15)';
    });
    
    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
      if (currentTrack) {
        togglePlayPause(playPauseBtn);
      }
    });
    
    // Previous
    prevBtn.addEventListener('click', () => {
      playPreviousTrack();
    });
    
    // Next
    nextBtn.addEventListener('click', () => {
      playNextTrack();
    });
    
    // Shuffle
    shuffleBtn.addEventListener('click', () => {
      isShuffle = !isShuffle;
      shuffleBtn.style.background = isShuffle ? 'rgba(0, 255, 225, 0.25)' : 'rgba(0, 255, 225, 0.1)';
    });
    
    // Repeat
    repeatBtn.addEventListener('click', () => {
      isRepeat = !isRepeat;
      repeatBtn.style.background = isRepeat ? 'rgba(0, 255, 225, 0.25)' : 'rgba(0, 255, 225, 0.1)';
    });
    
    // Progress bar
    progressBar.addEventListener('input', (e) => {
      if (audio) {
        const percent = e.target.value;
        audio.currentTime = (percent / 100) * audio.duration;
      }
    });
    
    // Volume
    volumeSlider.addEventListener('input', (e) => {
      const volume = e.target.value;
      volumeDisplay.textContent = `${volume}%`;
      if (audio) {
        audio.volume = volume / 100;
      }
    });
    
    // Update progress
    setInterval(() => {
      if (audio && isPlaying) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = percent || 0;
        
        const currentTime = formatTime(audio.currentTime);
        const totalTime = formatTime(audio.duration);
        playerControls.querySelector('.current-time').textContent = currentTime;
        playerControls.querySelector('.total-time').textContent = totalTime;
      }
    }, 100);
  }
  
  function showAddMusicDialog(libraryView) {
    const title = prompt('Enter track title:');
    if (!title) return;
    
    const artist = prompt('Enter artist name (optional):');
    const url = prompt('Enter track URL (YouTube, SoundCloud, or direct MP3 link):');
    
    if (!url) {
      alert('URL is required');
      return;
    }
    
    const track = {
      id: Date.now(),
      title,
      artist: artist || 'Unknown Artist',
      url,
      duration: 0,
      isPlaying: false
    };
    
    library.push(track);
    saveLibrary();
    renderLibrary(libraryView);
  }
  
  function playTrack(index) {
    if (index < 0 || index >= library.length) return;
    
    currentTrackIndex = index;
    currentTrack = library[index];
    
    // Note: Due to browser restrictions, we can't actually play external audio URLs
    // In a real implementation, you would use the Web Audio API or a player library
    // For this demo, we'll simulate playback
    
    isPlaying = true;
    
    // Update UI
    const nowPlaying = document.querySelector('.now-playing');
    const trackArtist = document.querySelector('.track-artist');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    
    if (nowPlaying) nowPlaying.textContent = currentTrack.title;
    if (trackArtist) trackArtist.textContent = currentTrack.artist;
    if (playPauseBtn) playPauseBtn.textContent = '⏸️';
    
    // Rerender library to show active track
    const libraryView = document.querySelector('.music-library');
    if (libraryView) renderLibrary(libraryView);
    
    // Simulate playback
    if (!audio) {
      audio = {
        currentTime: 0,
        duration: 180, // 3 minutes default
        volume: 0.5
      };
    }
    
    console.log(`Playing: ${currentTrack.title} by ${currentTrack.artist}`);
    console.log(`URL: ${currentTrack.url}`);
  }
  
  function togglePlayPause(playPauseBtn) {
    isPlaying = !isPlaying;
    playPauseBtn.textContent = isPlaying ? '⏸️' : '▶️';
  }
  
  function playNextTrack() {
    if (library.length === 0) return;
    
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * library.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % library.length;
    }
    
    playTrack(nextIndex);
  }
  
  function playPreviousTrack() {
    if (library.length === 0) return;
    
    let prevIndex;
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * library.length);
    } else {
      prevIndex = currentTrackIndex - 1;
      if (prevIndex < 0) prevIndex = library.length - 1;
    }
    
    playTrack(prevIndex);
  }
  
  function deleteTrack(index, libraryView) {
    if (confirm(`Delete "${library[index].title}"?`)) {
      library.splice(index, 1);
      
      if (currentTrackIndex === index) {
        currentTrack = null;
        currentTrackIndex = -1;
        isPlaying = false;
        
        const nowPlaying = document.querySelector('.now-playing');
        const trackArtist = document.querySelector('.track-artist');
        const playPauseBtn = document.querySelector('.play-pause-btn');
        
        if (nowPlaying) nowPlaying.textContent = 'No track selected';
        if (trackArtist) trackArtist.textContent = 'Select a track to play';
        if (playPauseBtn) playPauseBtn.textContent = '▶️';
      } else if (currentTrackIndex > index) {
        currentTrackIndex--;
      }
      
      saveLibrary();
      renderLibrary(libraryView);
    }
  }
  
  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  function open() {
    const existing = WindowManager.getWindowByApp('music');
    if (existing) {
      WindowManager.focusWindow(existing.id);
      return;
    }
    
    const content = createMusicContent();
    WindowManager.createWindow('music', 'Music Player', content, {
      width: 500,
      height: 600,
      left: 350,
      top: 150
    });
  }
  
  return {
    open
  };
})();

window.MusicApp = MusicApp;

