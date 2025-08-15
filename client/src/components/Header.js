import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <table width="100%" cellPadding="5" cellSpacing="0" border="1" bgcolor="#0000FF">
          <tr>
            <td align="center" bgcolor="#FF0000">
              <font face="Arial Black" size="6" color="#FFFF00">
                <blink>*** RETRO BLOG SITE ***</blink>
              </font>
            </td>
          </tr>
          <tr>
            <td bgcolor="#00FF00">
              <center>
                <table cellPadding="3" cellSpacing="0">
                  <tr>
                    <td>
                      <a href="/" className="nav-button">
                        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" width="16" height="16" alt="*"/>
                        HOME
                      </a>
                    </td>
                    <td width="20"></td>
                    
                    {isAuthenticated ? (
                      <>
                        <td>
                          <a href="/dashboard" className="nav-button">
                            <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" width="16" height="16" alt="*"/>
                            DASHBOARD
                          </a>
                        </td>
                        <td width="20"></td>
                        <td>
                          <a href="/create-post" className="nav-button">
                            <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" width="16" height="16" alt="*"/>
                            WRITE NEW POST
                          </a>
                        </td>
                        <td width="20"></td>
                        <td>
                          <font face="Comic Sans MS" size="2" color="#FF0000">
                            <b>Welcome, {user?.firstName}!</b>
                          </font>
                        </td>
                        <td width="10"></td>
                        <td>
                          <a href="/profile" className="nav-button">PROFILE</a>
                        </td>
                        <td width="10"></td>
                        <td>
                          <button onClick={handleLogout} className="nav-button logout-btn">
                            LOGOUT
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <a href="/login" className="nav-button">
                            <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" width="16" height="16" alt="*"/>
                            LOGIN
                          </a>
                        </td>
                        <td width="20"></td>
                        <td>
                          <a href="/register" className="nav-button signup-btn">
                            <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" width="16" height="16" alt="*"/>
                            SIGN UP NOW!
                          </a>
                        </td>
                      </>
                    )}
                  </tr>
                </table>
              </center>
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="#FFFF00">
              <font face="Courier New" size="1">
                <marquee behavior="scroll" direction="left" scrollamount="2">
                  *** Welcome to the World Wide Web! *** Best viewed with Netscape Navigator *** 
                </marquee>
              </font>
            </td>
          </tr>
        </table>
      </div>
    </header>
  );
};

export default Header;
