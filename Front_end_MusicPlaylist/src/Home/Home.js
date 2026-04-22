import React, { useEffect, useState, useRef } from "react";
import { FaComment,FaFacebookMessenger, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaMusic, FaHeart, FaShareAlt, FaEllipsisH, FaList } from "react-icons/fa";
import { IoAddCircle,IoHome  } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import "./Home.css";
import axios from "axios"

const Home = () => {
  const [data, setData] = useState([]);
  const [commentData,setCommentData] = useState([]);
  const [songComments,setSongComments] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const [comment, setComment] = useState([]);
  const [commentingSongId, setCommentingSongId] = useState(null);//it can be used for repoting which song is commented 
  const [loading, setLoading] = useState(true);// it can be seted for loading a web page while fetching data from the backend
  const userData = JSON.parse(localStorage.getItem("userData"));// it can be passed from the home page 
  const [userInfo,setUserInfo] = useState([]);
  const userName = JSON.parse(localStorage.getItem("UserName"));

  //this code is for fetching image and song data from backend
  useEffect(() => {
    fetch(`http://localhost:8080/music/songs`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data:", data);
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Fetch Error:", err);
        setLoading(false);
      });
  }, []);
  //this is main code for the home page


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/music/get-details-login?userName=${userName}`);
        const data = await res.json();
  
        if (data?.user?.userId) {
          localStorage.setItem("userData", data.user.userId);
          console.log("User ID stored:", data.user.userId);
        }
  
        // 👇 Put the remaining code here — it will run **after** fetch completes
        // runRemainingCode();
  
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
  
    fetchUserData(); // call async function
  }, []); // <-- add dependencies if needed (e.g. [userName])

  //this is for fetching the user details from backend
  useEffect(()=>{
    if(userData){
    fetch(`http://localhost:8080/user/get-userDetails/${userData}`)
    .then((response) => response.json())
    .then((userData)=>{
      console.log("userInfo",userData)
      setUserInfo(userData);
      localStorage.setItem("userId", userData.userId);
      sessionStorage.setItem("userId", userData.userId);
      console.log("userId", userData.userId)
    })
    .catch((err)=>{
      console.log("Error in userInfo:",err);
    })
  }
  },[userData])

  //here the userdata is retrived successfull

  const handlePlayPause = (song) => {
    if (currentSong && currentSong.id === song.id) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 100);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const filteredData = data.filter((e) =>
    searchQuery.trim() ? e.songName?.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="record"></div>
        <h2>Music Playlist</h2>
        <div className="music-loader">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <span className="loading-text">Loading your music</span>
      </div>
    );
  }
  

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  //this code is for fetching the comments from the backend and database
  const toggleCommentBox = (songId) => {
    if (commentingSongId === songId) {
      setCommentingSongId(null);
      setSongComments([]); // Clear comments when closing
    } else {
      setCommentingSongId(songId);
  
      fetch(`http://localhost:8080/music/song-comments/${songId}`)
        .then((res) => res.json()) 
        .then((data) => {
          console.log("Fetched Data:", data);
  
          
          if (Array.isArray(data)) {
            setSongComments(data);
          } else {
            setSongComments([]); // Set to empty array if data is invalid
            console.error("Expected array but received:", data);
          }
        })
        .catch((err) => {
          console.error("Error fetching comments:", err);
          setSongComments([]); // Ensure UI doesn't break
        });
    }
  };
  //here retrivel of song comments are ends \/

  //this is the original addcomment section must check before it use ||--> Submit comment <--|| 

const handleSubmitcomment = async (e) => {
  e.preventDefault();
  if (!userInfo) {
    alert("Please log in to submit a comment.");
    return;
  }

  if (!comment.trim()) {
    alert("Please enter a comment.");
    return;
  }

  try {
    const res = await axios.post(`http://localhost:8080/music/comment`, {
      comments: comment,
      music: {
        id: commentingSongId
      },
      user: {
        userId: userInfo.userId
      }
    });

    if (res.status === 200 || res.status === 201) {
      alert("Comment submitted!");
      setComment("");
      // Refresh the comments list for the song
      toggleCommentBox(commentingSongId);
    } else {
      alert("Failed to submit comment");
    }
  } catch (err) {
    console.error("Error submitting comment:", err);
    alert("An error occurred while submitting your comment.");
  }
};

  //here that comment section will end
  
  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = () => {
    alert(`Comment Submitted: ${comment}`);
    setComment("");
    setCommentingSongId(null);
  };

  // Handle playlist navigation
  const handlePlaylistClick = () => {
    window.location.href = '/home/playlist';
  };

  // Handle user button click
  const handleUserButtonClick = () => {
    if (!userInfo?.userName) {
      window.location.href = '/verify';
    } else {
      console.log("User profile clicked");
    }
  };

return (
<div className="home-container">
{/* Header */}
<header className="header">
  <div className="logo">
    <FaMusic className="logo-icon" />
    <span>Music Playlist</span>
  </div>
  <div className="overall-search">
    <input
      type="text"
      value={searchQuery}
      placeholder="Search the song..."
      className="search-box"
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
  <nav>
    <ul>
      <li><a href="/home" className="active"><IoHome/> Home</a></li>
      <li><a href="#" onClick={handlePlaylistClick}><FaList/> Playlist</a></li>
      <li><a href="#">Upload</a></li>
      <li className="notification"><a href="#"><IoIosNotifications/></a></li>
      <li>
        <button 
          onClick={handleUserButtonClick}
          className="user-button"
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            font: 'inherit',
            cursor: 'pointer',
            padding: '0',
            fontSize: '1.2rem'
          }}
        >
          {userInfo?.userName || "verify"}
        </button>
      </li>
    </ul>
  </nav>
</header>

{/* Music Gallery */}
<section className="music-gallery">
<h2 className="trending-title">Trending Music</h2>
<div className="song-grid">
{filteredData.map((song) => {
  const imageSrc = song.imageData ? `data:image/png;base64,${song.imageData}` : "";
  return (
  <div key={song.id} className="song-card">
  <div className="song-image-container">
  <img src={imageSrc} className="song-image" alt={song.songName || "Song"} />
  <div className="play-overlay" onClick={() => handlePlayPause(song)}>
  {currentSong && currentSong.id === song.id && isPlaying ? (
      <FaPause className="play-icon" />
      ) : (
      <FaPlay className="play-icon" />
      )}
    </div>
    </div>
    <div className="song-info">
    <h3 className="song-title">{song.songName || "Unknown"}</h3>
    <p className="song-artist">{song.artist || "Unknown Artist"}</p>
    <div className="song-actions">
    {commentingSongId === song.id && (
    <div className="comment-popup">
    <div className="comment-input-container">
    <input 
    type="text" 
    placeholder="Add a comment..." 
    value={comment} 
    onChange={handleChange} 
    className="comment-input" />
    <button 
    onClick={handleSubmitcomment} 
    className="comment-submit"><FaFacebookMessenger /></button>
    </div>
    <div className="comments-section">
    <div className="comments-header">Comments ({songComments.length})</div>
    <div className="comments-list">
    {songComments.length === 0 ? (
      <div className="no-comments">No comments yet. Be the first to comment!</div>
    ) : (
      songComments.map((songcomment) => (
      <div key={songcomment.commentId} className="comment-item">
        <div className="comment-user">@{songcomment.user.userId}</div>
        <div className="comment-text">{songcomment.comments}</div>
      </div>
      ))
    )}
    </div>
    </div>
    </div>
  )}
  <div className="button-icons">
  <button className="action-btn"><FaHeart /></button>
  <button className="action-btn" onClick={() => toggleCommentBox(song.id)}><FaComment /></button>
  <button className="action-btn"><IoAddCircle /></button>
  <button className="action-btn"><FaShareAlt /></button>
  <button className="action-btn"><FaEllipsisH /></button>
  </div>
  </div>
</div>
</div>
);
})}
</div>
</section>

{/* Audio Player */}
{currentSong && (
  <div className="audio-player">
    <img src={currentSong.imageData ? `data:image/png;base64,${currentSong.imageData}` : ""} 
    className="player-image" 
    alt={currentSong.songName || "Song"} />
    <div className="player-info">
      <h4>{currentSong.songName || "Unknown"}</h4>
      <p>{currentSong.artist || "Unknown Artist"}</p>
    </div>
    <div className="player-controls">
      <button className="control-btn play-btn" 
      onClick={() => handlePlayPause(currentSong)}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <div className="time-display">
        {formatTime(currentTime)}
        </div>
      <input 
      type="range" 
      min="0" 
      max={duration} 
      value={currentTime} 
      className="progress-bar" 
      onChange={handleProgressChange} 
      ref={progressBarRef} />
      <div className="time-display">
        {formatTime(duration)}
        </div>
    </div>
    <div className="volume-controls">
      <button 
      className="control-btn">
        {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>
      <input 
      type="range" 
      min="0" 
      max="1" 
      step="0.01" 
      value={volume} 
      className="volume-bar" 
      onChange={handleVolumeChange} />
    </div>
    <audio 
    ref={audioRef} 
    src={currentSong.songData ? `data:audio/mp3;base64,${currentSong.songData}` : ""} 
    onTimeUpdate={handleTimeUpdate} 
    onLoadedMetadata={handleLoadedMetadata} 
    onEnded={() => setIsPlaying(false)} />
  </div>
)}
</div>
  );
};

export default Home;