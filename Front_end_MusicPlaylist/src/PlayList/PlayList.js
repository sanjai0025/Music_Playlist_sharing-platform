import React, { useState, useEffect, useRef } from 'react';
import "./PlayList.css";
import axios from 'axios';

const PlayList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [mySongs, setMySongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null); 
  const [currentIndex, setCurrentIndex] = useState(null);         
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showMyPlaylist, setShowMyPlaylist] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [showAddSongs, setShowAddSongs] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [playlistStatus, setPlaylistStatus] = useState('public');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const audioRef = useRef(null);

  const userId = localStorage.getItem("userId");

  const createPlaylist = async(name, userId, status) => {
    if (!name.trim()) return;
    try{
        const res = await axios.post(`http://localhost:8080/music/create-playlist-name`,
        null,
        {
          params:{
            name: name,
            userid: userId,
            status: status,
          },
        }
      );
      console.log("res", res.data);
    }
    catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const addSongsToPlaylist = async(playlistId, songIds) => {
    try {
      const res = await axios.post(`http://localhost:8080/music/add-songs-to-existing-playlist/${playlistId}`, songIds);
      console.log("Songs added:", res.data);
      setShowAddSongs(false);
      setSelectedSongs([]);
    } catch (error) {
      console.error("Error adding songs:", error.response?.data || error.message);
    }
  };

  const handleAddPlaylistClick = () => {
    setShowPopup(true);
  };

  // Fetch all songs
  useEffect(() => {
    fetch(`http://localhost:8080/music/songs`)
      .then((res) => res.json())
      .then((data) => {
        setAllSongs(data);
      })
      .catch((err) => {
        console.log("Error fetching songs:", err);
      });
  }, []);

  // Fetch user playlists
  useEffect(() => {
    if(userId) {
      fetch(`http://localhost:8080/music/get-playlist/${userId}`)
      .then((res) => res.json())
      .then((data)=>{
        setMySongs(data);
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }, [userId])

  // Fetch all playlists
  useEffect(() => {
    fetch(`http://localhost:8080/music/get-details`)
      .then((res) => res.json())
      .then((data) => {
        setPlaylists(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load playlists");
        setLoading(false);
      });
  }, []);

  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
    setCurrentIndex(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  };

  const handleBack = () => {
    setSelectedPlaylist(null);
    setCurrentIndex(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  };

  const playIndex = (index) => {
    if (!selectedPlaylist || !selectedPlaylist.songs[index]) return;
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const handlePlayAll = () => {
    playIndex(0);
  };

  const handleSongClick = (index) => {
    playIndex(index);
  };

  const handleTogglePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (!selectedPlaylist || currentIndex === null) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < selectedPlaylist.songs.length) {
      playIndex(nextIndex);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (!selectedPlaylist || currentIndex === null) return;
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      playIndex(prevIndex);
    }
  };

  useEffect(() => {
    if (!selectedPlaylist || currentIndex === null) return;
    const song = selectedPlaylist.songs[currentIndex];
    if (!song || !audioRef.current) return;

    audioRef.current.src = song.songData ? `data:audio/mp3;base64,${song.songData}` : "";
    if (isPlaying && audioRef.current.src) {
      audioRef.current.play().catch(() => {});
    }
  }, [selectedPlaylist, currentIndex, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
    };
  }, []);

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = e.target.value;
    setProgress(audioRef.current.currentTime);
  };

  const handleEnded = () => {
    handleNext();
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredPlaylists = playlists.filter(playlist =>
    (playlist.playlistName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isUserPlaylist = selectedPlaylist && selectedPlaylist.user?.userId == userId;
  
  

  const handleSongSelection = (songId) => {
    setSelectedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  if (loading) {
    return (
      <div className="playlist-container">
        <p>Loading playlists...</p>
      </div>
    );
  }

  if (selectedPlaylist) {
    const songs = selectedPlaylist.songs || [];
    const currentSong = (currentIndex !== null && songs[currentIndex]) ? songs[currentIndex] : null;

    return (
      <div className="playlist-container">
        <button className="back-btn" onClick={handleBack}>
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <div className="songs-view-title" style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <div>
            <h2>{selectedPlaylist.playlistName}</h2>
            <span>{songs.length} {songs.length === 1 ? "song" : "songs"}</span>
          </div>
          {isUserPlaylist && (
            <button 
              onClick={() => setShowAddSongs(true)}
              style={{
                backgroundColor: '#1DB954',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Add Songs
            </button>
          )}
        </div>

        <button className="play-all-btn-round" onClick={handlePlayAll}>
          <i className="fas fa-play"></i>
        </button>

        <div className="songs-grid">
          {songs.length === 0 ? (
            <p>No songs in this playlist.</p>
          ) : (
            songs.map((song, idx) => (
              <div 
                key={song.id} 
                className={`song-card ${currentIndex === idx && isPlaying ? "playing" : ""}`}
                onClick={() => handleSongClick(idx)}
              >
                <div className="song-image-container">
                  <img
                    className="song-image"
                    src={song.imageData ? `data:image/png;base64,${song.imageData}` : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' fill='white' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"}
                    alt={song.songName || "Song"}
                  />
                </div>
                <div className="song-info">
                  <h4 className="song-name">{song.songName || "Unknown"}</h4>
                  <p className="song-desc">{song.description || ""}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="songs-player-bar">
          <div className="player-meta">
            {currentSong ? (
              <>
                <div className="player-cover">
                  <img
                    src={currentSong.imageData ? `data:image/png;base64,${currentSong.imageData}` : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect width='56' height='56' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' fill='white' text-anchor='middle' dy='.3em' font-size='8'%3ESong%3C/text%3E%3C/svg%3E"}
                    alt={currentSong.songName || "Song"}
                  />
                </div>
                <div className="player-titles">
                  <strong>{currentSong.songName || "Unknown"}</strong>
                  <span>{`Track ${currentIndex + 1} of ${songs.length}`}</span>
                </div>
              </>
            ) : (
              <span>Select a song to start</span>
            )}
          </div>

          <div className="player-controls">
            <button onClick={handlePrev} disabled={currentIndex === null || currentIndex <= 0}>
              <i className="fas fa-backward"></i>
            </button>
            <button onClick={handleTogglePlayPause} disabled={!currentSong}>
              {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
            </button>
            <button onClick={handleNext} disabled={currentIndex === null || currentIndex >= songs.length - 1}>
              <i className="fas fa-forward"></i>
            </button>
          </div>

          <div className="player-progress">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress}
              onChange={handleSeek}
            />
            <div className="time-display">
              {formatTime(progress)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        <audio ref={audioRef} onEnded={handleEnded} style={{ display: 'none' }} />

        {showAddSongs && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: '#181818',
              borderRadius: '12px',
              padding: '24px',
              width: '500px',
              maxHeight: '600px',
              color: '#fff'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h3>Add Songs to {selectedPlaylist.playlistName}</h3>
                <button 
                  onClick={() => setShowAddSongs(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '20px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{maxHeight: '400px', overflowY: 'auto', marginBottom: '20px'}}>
                {allSongs.map((song) => (
                  <div
                    key={song.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      backgroundColor: selectedSongs.includes(song.id) ? '#1DB954' : '#282828',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSongSelection(song.id)}
                  >
                    <img
                      src={song.imageData ? `data:image/png;base64,${song.imageData}` : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='50' height='50' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' fill='white' text-anchor='middle' dy='.3em' font-size='10'%3ESong%3C/text%3E%3C/svg%3E"}
                      alt={song.songName}
                      style={{width: '50px', height: '50px', borderRadius: '4px', marginRight: '12px', objectFit: 'cover'}}
                    />
                    <div>
                      <h4 style={{margin: '0 0 4px 0', fontSize: '14px'}}>{song.songName}</h4>
                      <p style={{margin: 0, fontSize: '12px', color: '#b3b3b3'}}>{song.artist || 'Unknown Artist'}</p>
                    </div>
                    {selectedSongs.includes(song.id) && (
                      <span style={{marginLeft: 'auto', color: '#fff'}}>✓</span>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => addSongsToPlaylist(selectedPlaylist.playlistId, selectedSongs)}
                disabled={selectedSongs.length === 0}
                style={{
                  width: '100%',
                  backgroundColor: selectedSongs.length > 0 ? '#1DB954' : '#404040',
                  color: '#fff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '25px',
                  cursor: selectedSongs.length > 0 ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Add {selectedSongs.length} Song{selectedSongs.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="playlist-container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          {showMyPlaylist && (
            <button 
              onClick={() => setShowMyPlaylist(false)}
              className="back-btn"
              style={{marginRight: '10px'}}
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>
          )}
          <h1>{showMyPlaylist ? 'My Playlists' : 'All Playlists'}</h1>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <input
            type="text"
            placeholder="Search playlists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{width: '250px', padding: '8px 12px', borderRadius: '20px', border: 'none', backgroundColor: '#282828', color: '#fff'}}
          />
          {!showMyPlaylist && (
            <button 
              onClick={() => setShowMyPlaylist(true)}
              style={{
                backgroundColor: '#282828',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              My Playlist
            </button>
          )}
          <button
            onClick={handleAddPlaylistClick}
            style={{
              backgroundColor: '#282828',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Add playlist
          </button>
        </div>
      </div>
      {error && <p>{error}</p>}

      <div className="playlists-grid">
        {showMyPlaylist ? (
          mySongs.length === 0 ? (
            <p>No songs found</p>
          ) : (
            mySongs.map((playlist) => (
              <div
                key={playlist.playlistId}
                className="playlist-card"
                onClick={() => handlePlaylistClick(playlist)}
              >
                <img
                  src={playlist.songs.length > 0 && playlist.songs[0].imageData
                    ? `data:image/png;base64,${playlist.songs[0].imageData}`
                    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' fill='white' text-anchor='middle' dy='.3em'%3EMy Song%3C/text%3E%3C/svg%3E"}
                  alt={playlist.playlistName}
                />
                <h3>{playlist.playlistName}</h3>
                <p>{playlist.songs.length} songs</p>
              </div>
            ))
          )
        ) : (
          filteredPlaylists.length === 0 ? (
            <p>No playlists found</p>
          ) : (
            filteredPlaylists.map((playlist) => (
              <div
                key={playlist.playlistId}
                className="playlist-card"
                onClick={() => handlePlaylistClick(playlist)}
              >
                <img
                  src={playlist.songs.length > 0 && playlist.songs[0].imageData
                    ? `data:image/png;base64,${playlist.songs[0].imageData}`
                    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' fill='white' text-anchor='middle' dy='.3em'%3EPlaylist%3C/text%3E%3C/svg%3E"}
                  alt={playlist.playlistName}
                />
                <h3>{playlist.playlistName}</h3>
                <p>{playlist.songs.length} songs</p>
              </div>
            ))
          )
        )}
      </div>

      {showPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#181818',
            borderRadius: '12px',
            padding: '24px',
            width: '400px',
            maxHeight: '500px',
            color: '#fff'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h3>My Playlists</h3>
              <button 
                onClick={() => setShowPopup(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{maxHeight: '300px', overflowY: 'auto', marginBottom: '20px'}}>
              {mySongs.length === 0 ? (
                <p style={{color: '#b3b3b3', textAlign: 'center'}}>No playlists found</p>
              ) : (
                mySongs.map((playlist) => (
                  <div
                    key={playlist.playlistId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      backgroundColor: '#282828',
                      cursor: 'pointer'
                    }}
                  >
                    <img
                      src={playlist.songs.length > 0 && playlist.songs[0].imageData
                        ? `data:image/png;base64,${playlist.songs[0].imageData}`
                        : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='50' height='50' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' fill='white' text-anchor='middle' dy='.3em' font-size='8'%3EPlaylist%3C/text%3E%3C/svg%3E"}
                      alt={playlist.playlistName}
                      style={{width: '50px', height: '50px', borderRadius: '4px', marginRight: '12px', objectFit: 'cover'}}
                    />
                    <div>
                      <h4 style={{margin: '0 0 4px 0', fontSize: '14px'}}>{playlist.playlistName}</h4>
                      <p style={{margin: 0, fontSize: '12px', color: '#b3b3b3'}}>{playlist.songs.length} songs</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button
              onClick={() => setShowCreateInput(!showCreateInput)}
              style={{
                width: '100%',
                backgroundColor: '#1DB954',
                color: '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Create New Playlist
            </button>
            {showCreateInput && (
              <div style={{ marginTop: '15px' }}>
                <input
                  type="text"
                  placeholder="Enter playlist name..."
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #404040',
                    backgroundColor: '#282828',
                    color: '#fff',
                    fontSize: '14px',
                    marginBottom: '15px'
                  }}
                />
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>Status:</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setPlaylistStatus('public')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        backgroundColor: playlistStatus === 'public' ? '#1DB954' : '#404040',
                        color: '#fff'
                      }}
                    >
                      ✓ Public
                    </button>
                    <button
                      onClick={() => setPlaylistStatus('private')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        backgroundColor: playlistStatus === 'private' ? '#1DB954' : '#404040',
                        color: '#fff'
                      }}
                    >
                      ✓ Private
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      createPlaylist(newPlaylistName, userId, playlistStatus);
                      setNewPlaylistName('');
                      setShowCreateInput(false);
                      setPlaylistStatus('public');
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#1DB954',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateInput(false);
                      setNewPlaylistName('');
                      setPlaylistStatus('public');
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#404040',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayList;