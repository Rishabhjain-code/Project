import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import SearchBar from "../SearchBar/SearchBar"

class NavBar extends Component {
  state = {
  }

  render() {
    return (
      <div className="navbar">
        <div className="nav-logo" onClick={() => { location.href = '/' }}>
          <img src="image/InstaCloneColoured.png" alt="" />
        </div>

        {this.props.isAuth ? (
          <React.Fragment>
            <div className="nav-search">
              <input type="text" placeholder="Search User" className="navbar-search" onClick={() => {
                this.props.handleSearchClick();
              }} />
            </div>
            <div className="nav-links">
              <Link to="/">
                <div className="home">Home</div>
              </Link>
              <Link to="/profile">
                <div className="profile">Profile</div>
              </Link>
              <Link to="/settings">
                <div className="setting-options">Settings</div>
              </Link>
              <Link to="/login">
                <div className="logout" onClick={this.props.handleLogout}>
                  Logout
                </div>
              </Link>
            </div>
          </React.Fragment>
        ) : (
          <div className="nav-links">
            <Link to="/login">
              <div className="login">Login</div>
            </Link>
            <Link to="/signup">
              <div className="signup">Sign Up</div>
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default NavBar;
