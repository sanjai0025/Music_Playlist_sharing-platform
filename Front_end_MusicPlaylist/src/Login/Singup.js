import React, { useState } from 'react'
import './Singup.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Singup = () => {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPass,setConfirmPass] = useState("");
    const [role,setRole] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const handleCheck =(e)=>{
        setConfirmPass(e.target.value);
    };

    
    const handlesubmit =async(e)=>{
        e.preventDefault();
       console.log("Password:", password, typeof password); // Debugging
       console.log("Confirm Password:", confirmPass, typeof confirmPass);
        if (password !== confirmPass) {
            alert("Please check the password");
        } else {
            try{
                const res = await axios.post(`http://localhost:8080/music/add-details`,{
                 userName: username,
                 passWord: password,
                 role: role,
                });
                console.log(res.status);
                setShowPopup(true);
              }
              catch(err){
                console.log(err);
              }
        }
    }

  return (
    <div className='whole'>
        <h1>Welcome to SignUP Page!!!!</h1><br/>
        <form className='format' onSubmit={handlesubmit}>
            <label className='label'>username:</label>
            <input type='text' className='input' placeholder='enter the username' onChange={(e)=>setUsername(e.target.value)}></input>
            <label className='label'>password:</label>
            <input type='password' className='input' placeholder='enter the password' value={password} onChange={(e)=>setPassword(e.target.value)}></input>
            <label className='label'>Confirm password:</label>
            <input type='password' className='input' placeholder='Re-enter the password' value={confirmPass}  onChange={handleCheck}></input>
            <label className='label'>Role:</label>
            <select className='input' value={role} onChange={(e)=>setRole(e.target.value)} required>
                <option value=''>Select Role</option>
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
            </select>
            <button type='submit' className='button'>Singup</button>
        </form>
        
        {showPopup && (
          <div className='popup-overlay'>
            <div className='popup-content'>
              <h3>Account Created Successfully!</h3>
              <p>Would you like to verify your information now?</p>
              <div className='popup-buttons'>
                <button 
                  className='verify-btn'
                  onClick={() => navigate('/verify')}
                >
                  Verify
                </button>
                <button 
                  className='not-now-btn'
                  onClick={() => navigate('/')}
                >
                  Not Now
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default Singup