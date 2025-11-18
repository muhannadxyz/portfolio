// Music Player App - Real Playback with HTML5 Audio API
const MusicApp = (function() {
  let audio = null; // HTML5 Audio object
  let currentTrackIndex = -1;
  let isPlaying = false;
  let isShuffle = false;
  let isRepeat = false;
  
  // Pre-loaded library with royalty-free music
  // Using Free Music Archive and public domain tracks
  const library = [
    {
      id: 1,
      title: "Chill Lofi Beats",
      artist: "Ambient Music",
      url: "https://www.bensound.com/bensound-music/bensound-slowmotion.mp3"
    },
    {
      id: 2,
      title: "Creative Minds",
      artist: "Bensound",
      url: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3"
    },
    {
      id: 3,
      title: "Acoustic Breeze",
      artist: "Bensound",
      url: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3"
    },
    {
      id: 4,
      title: "Summer",
      artist: "Bensound",
      url: "https://www.bensound.com/bensound-music/bensound-summer.mp3"
    }
  ];
  
  function createMusicContent() {
    const container = document.createElement('div');
    container.className = 'music-container';
    container.style.cssText = 'height: 100%; display: flex; flex-direction: column; background: linear-gradient(135deg, #1a1a2e, #0d0d0d); font-family: -apple-system, sans-serif;';
    
    // Header
    const header = document.createElement('div');
    header.style.cssText = 'padding: 16px; background: rgba(30, 30, 30, 0.8); border-bottom: 1px solid rgba(0, 255, 225, 0.1); display: flex; justify-content: space-between; align-items: center;';
    header.innerHTML = `
      <h2 style="color: #00ffe1; font-size: 18px; margin: 0;">🎵 Music Library</h2>
      <div style="color: #999; font-size: 12px;">${library.length} tracks</div>
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
      setupMusicEvents(playerControls);
      initializeAudio();
    }, 100);
    
    return container;
  }
  
  function initializeAudio() {
    // Create HTML5 Audio object
    audio = new Audio();
    audio.volume = 0.5;
    
    // Add event listeners
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleTrackEnd);
    audio.addEventListener('error', handleAudioError);
    audio.addEventListener('play', () => {
      isPlaying = true;
      updatePlayButton();
    });
    audio.addEventListener('pause', () => {
      isPlaying = false;
      updatePlayButton();
    });
  }
  
  function updateProgress() {
    if (!audio || !audio.duration) return;
    
    const progressBar = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('.current-time');
    
    if (progressBar && !progressBar.dataset.seeking) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressBar.value = percent;
    }
    
    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  }
  
  function updateDuration() {
    if (!audio) return;
    
    const totalTimeEl = document.querySelector('.total-time');
    if (totalTimeEl) {
      totalTimeEl.textContent = formatTime(audio.duration);
    }
  }
  
  function handleTrackEnd() {
    console.log('Track ended');
    
    if (isRepeat) {
      // Replay current track
      audio.currentTime = 0;
      audio.play().catch(err => console.error('Play error:', err));
    } else {
      // Play next track
      playNextTrack();
    }
  }
  
  function handleAudioError(e) {
    console.error('Audio error:', e);
    const nowPlaying = document.querySelector('.now-playing');
    if (nowPlaying) {
      nowPlaying.textContent = 'Error loading track';
      nowPlaying.style.color = '#ff5f57';
      
      setTimeout(() => {
        nowPlaying.style.color = '#00ffe1';
      }, 3000);
    }
  }
  
  function renderLibrary(libraryView) {
    libraryView.innerHTML = '';
    
    library.forEach((track, index) => {
      const trackEl = document.createElement('div');
      trackEl.className = 'track-item';
      trackEl.style.cssText = `display: flex; align-items: center; gap: 16px; padding: 12px; background: rgba(30, 30, 30, 0.5); border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; border: 1px solid ${currentTrackIndex === index ? 'rgba(0, 255, 225, 0.5)' : 'transparent'};`;
      
      trackEl.innerHTML = `
        <div style="font-size: 32px;">${currentTrackIndex === index && isPlaying ? '🔊' : '🎵'}</div>
        <div style="flex: 1; min-width: 0;">
          <div style="color: ${currentTrackIndex === index ? '#00ffe1' : '#e6e6e6'}; font-weight: 600; font-size: 14px; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${track.title}</div>
          <div style="color: #999; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${track.artist}</div>
        </div>
        <div style="color: #00ffe1; font-size: 20px;">${currentTrackIndex === index && isPlaying ? '⏸️' : '▶️'}</div>
      `;
      
      trackEl.addEventListener('click', () => {
        if (currentTrackIndex === index) {
          // Toggle play/pause on same track
          togglePlayPause();
        } else {
          // Play new track
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
  }
  
  function setupMusicEvents(playerControls) {
    const playPauseBtn = playerControls.querySelector('.play-pause-btn');
    const prevBtn = playerControls.querySelector('.prev-btn');
    const nextBtn = playerControls.querySelector('.next-btn');
    const shuffleBtn = playerControls.querySelector('.shuffle-btn');
    const repeatBtn = playerControls.querySelector('.repeat-btn');
    const progressBar = playerControls.querySelector('.progress-bar');
    const volumeSlider = playerControls.querySelector('.volume-slider');
    const volumeDisplay = playerControls.querySelector('.volume-display');
    
    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
      if (currentTrackIndex === -1 && library.length > 0) {
        // If no track selected, play first track
        playTrack(0);
      } else {
        togglePlayPause();
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
    
    // Progress bar seeking
    progressBar.addEventListener('mousedown', () => {
      progressBar.dataset.seeking = 'true';
    });
    
    progressBar.addEventListener('mouseup', () => {
      delete progressBar.dataset.seeking;
    });
    
    progressBar.addEventListener('input', (e) => {
      if (audio && audio.duration) {
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
  }
  
  function playTrack(index) {
    if (index < 0 || index >= library.length) return;
    
    currentTrackIndex = index;
    const track = library[index];
    
    // Load and play the track
    if (audio) {
      audio.src = track.url;
      audio.load();
      audio.play().then(() => {
        console.log(`Now playing: ${track.title} by ${track.artist}`);
      }).catch(err => {
        console.error('Play error:', err);
        // Some browsers require user interaction before playing
        alert('Click OK to allow audio playback');
      });
    }
    
    // Update UI
    updateNowPlaying(track);
    renderLibraryUI();
  }
  
  function togglePlayPause() {
    if (!audio || currentTrackIndex === -1) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.error('Play error:', err));
    }
  }
  
  function updatePlayButton() {
    const playPauseBtn = document.querySelector('.play-pause-btn');
    if (playPauseBtn) {
      playPauseBtn.textContent = isPlaying ? '⏸️' : '▶️';
    }
  }
  
  function updateNowPlaying(track) {
    const nowPlaying = document.querySelector('.now-playing');
    const trackArtist = document.querySelector('.track-artist');
    
    if (nowPlaying) nowPlaying.textContent = track.title;
    if (trackArtist) trackArtist.textContent = track.artist;
  }
  
  function renderLibraryUI() {
    const libraryView = document.querySelector('.music-library');
    if (libraryView) renderLibrary(libraryView);
  }
  
  function playNextTrack() {
    if (library.length === 0) return;
    
    let nextIndex;
    if (isShuffle) {
      // Random track
      nextIndex = Math.floor(Math.random() * library.length);
    } else {
      // Next track in order
      nextIndex = (currentTrackIndex + 1) % library.length;
    }
    
    playTrack(nextIndex);
  }
  
  function playPreviousTrack() {
    if (library.length === 0) return;
    
    let prevIndex;
    if (isShuffle) {
      // Random track
      prevIndex = Math.floor(Math.random() * library.length);
    } else {
      // Previous track
      prevIndex = currentTrackIndex - 1;
      if (prevIndex < 0) prevIndex = library.length - 1;
    }
    
    playTrack(prevIndex);
  }
  
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';
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
  
  function stop() {
    // Stop audio playback and cleanup
    if (audio) {
      audio.pause();
      audio.src = '';
      isPlaying = false;
    }
    currentTrackIndex = -1;
  }
  
  return {
    open,
    stop
  };
})();

window.MusicApp = MusicApp;
