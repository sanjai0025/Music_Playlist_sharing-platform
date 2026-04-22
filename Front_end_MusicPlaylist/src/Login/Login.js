import React, { useState} from "react";
import { FaUser, FaLock, FaMusic } from "react-icons/fa";
import "./Login.css"; // Import external CSS
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [userName, setUsername] = useState("");
  const [passWord, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Username:", userName);
    console.log("Password:", passWord);
    try{
    const res = await axios.post(`http://localhost:8080/music/login`,{
     userName: userName,
     passWord: passWord,
    });
    console.log(res.status);
    if(res.status === 200){
        console.log("this is the received data from the backend : ",res.data);
        localStorage.setItem("UserName",JSON.stringify(res.data.userName));
        const userId = res.data.user.userId;
        localStorage.setItem("userData", JSON.stringify(userId)); // Store data
        if(res.data.role === "admin"){
        navigate('/homeAdmin');
        }
        else{
        navigate('/homeUser');
        }
    }
    else{
      alert("Incorrect username or password");
    }
  }
  catch(err){
    console.log(err);
  }
  };

    return (
        <div className="login-container">
            <div className="login-box">
                {/* Music Icon */}
                <div className="logo">
                    <FaMusic className="music-icon" />
                </div>

                <h2>Music Playlist Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <FaUser className="icon" />
                        <input
                            type="text"
                            placeholder="Enter Email"
                            value={userName}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <FaLock className="icon" />
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={passWord}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" onClick={handleSubmit} className="login-btn">Login</button>
                </form>

                <p className="register-link">Don't have an account? <a href="/singup">Sign up</a></p>
            </div>
        </div>
    );
};

export default Login;
