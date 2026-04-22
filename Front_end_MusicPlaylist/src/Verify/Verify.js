import React, { useState } from 'react';
import './Verify.css';
import axios from 'axios';

const Verify = () => {
  const [formData, setFormData] = useState({
    userName: '',
    emailID: '',
    phoneNum: '',
    gender: '',
    dateOfBirth: ''
  });

  const LoginName = localStorage.getItem("UserName");
  const [phoneData, setPhoneData] = useState({
    countryCode: '+91',
    number: ''
  });

  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  });

  const [otpData, setOtpData] = useState({
    showGetOtp: false,
    showOtpField: false,
    otp: '',
    isVerified: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (e) => {
    setPhoneData({
      ...phoneData,
      [e.target.name]: e.target.value
    });
    
    // Show Get OTP button when phone number is entered
    if (e.target.name === 'number' && e.target.value.length > 0) {
      setOtpData(prev => ({ ...prev, showGetOtp: true }));
    } else if (e.target.name === 'number' && e.target.value.length === 0) {
      setOtpData({ showGetOtp: false, showOtpField: false, otp: '', isVerified: false });
    }
  };

  const handleGetOtp = async () => {
    const fullPhoneNumber = `${phoneData.countryCode}${phoneData.number}`;
    
    try {
      const response = await axios.post('http://localhost:8080/music/send-otp-sms', null, {
        params: { phoneNumber: fullPhoneNumber }
      });
      console.log('OTP sent:', response.data);
      setOtpData(prev => ({ ...prev, showOtpField: true }));
      alert('OTP sent to your phone number!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      console.log(fullPhoneNumber);
      alert('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    const fullPhoneNumber = `${phoneData.countryCode}${phoneData.number}`;
    
    try {
      const response = await axios.post('http://localhost:8080/music/verify-otp-sms', null, {
        params: { 
          phoneNumber: fullPhoneNumber,
          otp: otpData.otp
        }
      });
      console.log('OTP verified:', response.data);
      setOtpData(prev => ({ ...prev, isVerified: true }));
      alert('Phone number verified successfully!');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpData.isVerified) {
      alert('Please verify your phone number with OTP first.');
      return;
    }
    
    // Combine address fields into single address string
    const fullAddress = `${addressData.street}, ${addressData.city}, ${addressData.state}, ${addressData.country} - ${addressData.zipCode}`;
    
    // Combine country code and phone number without encoding for this endpoint
    const fullPhoneNumber = `${phoneData.countryCode}${phoneData.number}`;
    
    const submitData = {
      userName: formData.userName,
      emailID: formData.emailID || '',
      phoneNum: fullPhoneNumber,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      address: fullAddress,
      status: 'verified'
    };
    
    console.log('Submitting data:', submitData);
    
    try {
      const response = await axios.post('http://localhost:8080/user/add-userDetails', submitData,
        {
          params:{
            userName:LoginName.replace(/"/g, "") 
          },
        }
        
      );
      console.log('User verified:', response.data);
      alert('User information verified successfully!');
    } catch (error) {
      console.error('Error verifying user:', error);
      console.error('Error response:', error.response?.data);
      alert('Error verifying user information');
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="verify-container">
      <div className="verify-header">
        <button className="back-button" onClick={handleBack}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <h1 className="verify-title">Verify Your Information</h1>
      </div>

      <div className="verify-form-container">
        <form className="verify-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">User Name</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email ID</label>
            <input
              type="email"
              name="emailID"
              value={formData.emailID}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email (optional)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="phone-container">
              <select
                name="countryCode"
                value={phoneData.countryCode}
                onChange={handlePhoneChange}
                className="country-code-select"
                required
              >
                <option value="+91">🇮🇳 +91 (India)</option>
                <option value="+1">🇺🇸 +1 (USA)</option>
                <option value="+44">🇬🇧 +44 (UK)</option>
                <option value="+86">🇨🇳 +86 (China)</option>
                <option value="+81">🇯🇵 +81 (Japan)</option>
                <option value="+49">🇩🇪 +49 (Germany)</option>
                <option value="+33">🇫🇷 +33 (France)</option>
                <option value="+39">🇮🇹 +39 (Italy)</option>
                <option value="+7">🇷🇺 +7 (Russia)</option>
                <option value="+55">🇧🇷 +55 (Brazil)</option>
                <option value="+61">🇦🇺 +61 (Australia)</option>
                <option value="+82">🇰🇷 +82 (South Korea)</option>
                <option value="+34">🇪🇸 +34 (Spain)</option>
                <option value="+31">🇳🇱 +31 (Netherlands)</option>
                <option value="+46">🇸🇪 +46 (Sweden)</option>
              </select>
              <input
                type="tel"
                name="number"
                value={phoneData.number}
                onChange={handlePhoneChange}
                className="phone-input"
                placeholder="Enter phone number"
                required
              />
            </div>
            {otpData.showGetOtp && (
              <button
                type="button"
                onClick={handleGetOtp}
                className="get-otp-btn"
              >
                Get OTP
              </button>
            )}
            {otpData.showOtpField && (
              <div className="otp-container">
                <input
                  type="text"
                  value={otpData.otp}
                  onChange={(e) => setOtpData(prev => ({ ...prev, otp: e.target.value }))}
                  className="otp-input"
                  placeholder="Enter OTP"
                  maxLength="6"
                  required
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="verify-otp-btn"
                  disabled={otpData.isVerified}
                >
                  {otpData.isVerified ? '✓ Verified' : 'Verify OTP'}
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="street"
              value={addressData.street}
              onChange={handleAddressChange}
              className="form-input"
              placeholder="Street Address"
              required
            />
            <input
              type="text"
              name="city"
              value={addressData.city}
              onChange={handleAddressChange}
              className="form-input"
              placeholder="City"
              required
            />
            <input
              type="text"
              name="state"
              value={addressData.state}
              onChange={handleAddressChange}
              className="form-input"
              placeholder="State/Province"
              required
            />
            <input
              type="text"
              name="country"
              value={addressData.country}
              onChange={handleAddressChange}
              className="form-input"
              placeholder="Country"
              required
            />
            <input
              type="text"
              name="zipCode"
              value={addressData.zipCode}
              onChange={handleAddressChange}
              className="form-input"
              placeholder="ZIP/Postal Code"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Verify Information
            </button>
            <button type="button" className="cancel-button" onClick={handleBack}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verify;