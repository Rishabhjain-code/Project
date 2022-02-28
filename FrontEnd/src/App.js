import "./App.css";
import React, { Component, createRef } from "react";
import NavBar from "./Components/NavBar/NavBar.jsx";
import Feeds from "./Components/Feeds/Feeds.jsx";
import ProfileView from "./Components/ProfileView/ProfileView";
import axios from "axios";
import Settings from "./Components/Settings/Settings";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import Profile from "./Components/Profile/Profile";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import SearchBar from "./Components/SearchBar/SearchBar";

class App extends Component {
  state = {
    isAuth: false,
    uid: "f0960504-e33b-48b3-8ecb-e4a1bebca1a2",
    search: false,
    searchBarUsers: [],
    userFollowings: []
  };

  // first time came here
  componentDidMount = async () => {
    let uid = this.state.uid, isAuth = false;
    if (localStorage.getItem("isAuth")) {
      isAuth = localStorage.getItem("isAuth");
      uid = localStorage.getItem("uid");
    } else {
      // if (!this.state.isAuth) {
      //   axios({
      //     url: "/auth/setState",
      //     method: "get",
      //   })
      //     .then((obj) => {
      //       // console.log(obj);
      //       isAuth = obj.data.loggedIn;
      //       uid = obj.data.uid;

      //       localStorage.setItem("isAuth", isAuth);
      //       localStorage.setItem("uid", uid);
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //     });
      // }
    }

    this.setState({
      isAuth, uid, search: false
    })

    let users;
    let followingsArr;
    let search = false;
    let arr = [];
    axios.get("https://socio-backe.herokuapp.com/api/user").then((obj) => {
      users = obj.data.data;
      console.log(users);
      for (let i = 1; i <= Math.min(12, users.length); i++) {
        arr.push(users[i]);
      }
    }).catch(error => {
      console.log(error);
    })

    let user_id = this.state.uid;
    console.log(user_id);
    axios({
      method: "get",
      url: `https://socio-backe.herokuapp.com/api/request/following/${user_id}`
    }).then((obj) => {
      followingsArr = obj.data.following
      // remember that axios is async hence update when promise returned fullfilled if written down it will collapse
      // as by then axios not wokred fully as prmise was pending
      this.setState({
        isAuth, uid, search,
        searchBarUsers: arr,
        userFollowings: followingsArr
      })
    }).catch((error) => {
      console.log(error);
    })

    // WRONG

    // this.setState({
    //     users: arr,
    //     followings: followingsArr
    // })
  };

  handleLogout = () => {
    localStorage.clear();
    axios.get("/auth/destroyCookie").then((obj) => {
      this.setState({
        isAuth: false,
        uid: "f0960504-e33b-48b3-8ecb-e4a1bebca1a2",
        search: false,
        userFollowings: [],
        searchBarUsers: []
      });
    });
  };

  handleLogin = async (email, password) => {
    let obj = await axios({
      url: `https://socio-backe.herokuapp.com/auth/verify/${email}/${password}`,
      method: "get",
    });
    console.log(obj);
    if (obj.data.data) {
      let uid = obj.data.data.uid;
      uid = this.state.uid;
      console.log(uid);
      localStorage.setItem("isAuth", true);
      localStorage.setItem("uid", uid);
      this.setState({
        isAuth: true,
        uid: uid,
      });
    }
  };

  handleSearchClick = () => {
    let isAuth = this.state.isAuth, uid = this.state.uid, search = this.state.search;
    // console.log(this.state.search);
    this.setState({
      isAuth: isAuth,
      uid: uid,
      search: !search
    })
    // console.log(this.state.search);
    try {
      // USELESS WORK

      // if (!search)
      //   this.profileViewRef.current.classList.add("searchbar-profile-view");
      // if (search)
      //   this.profileViewRef.current.classList.remove("searchbar-profile-view");
    } catch {
      this.setState({
        isAuth,
        uid,
        search: false
      })
    }

  }

  handleSignup = async (name, email, password, username, phone, bio, isPrivate) => {
    let formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("username", username);
    formData.append("phone", phone);
    formData.append("bio", bio);
    formData.append("isPrivate", isPrivate);

    axios
      .post(`https://socio-backe.herokuapp.com/api/user`, formData)
      .then((obj) => {
        console.log(obj);
      })
  };

  profileViewRef = createRef();

  render() {
    return (
      <Router>
        <React.Fragment>
          {/* navabar is displayed always others only at the selected Route Path*/}
          <NavBar isAuth={this.state.isAuth} handleLogout={this.handleLogout} handleSearchClick={this.handleSearchClick} />
          {this.state.search && (
            <SearchBar uid={this.state.uid} searchBarUsers={this.state.searchBarUsers} userFollowings={this.state.userFollowings}></SearchBar>
          )}
          <Route path="/" exact>
            {this.state.isAuth ? (
              <div className="home-view">
                <Feeds uid={this.state.uid}></Feeds>
                {/* feeds and profile view componenets flexed view*/}
                <ProfileView uid={this.state.uid} profileViewRef={this.profileViewRef}></ProfileView>
              </div>
            ) : (
              <Redirect to="/login"></Redirect>
            )}
          </Route>

          <Route path="/profile" exact>
            {this.state.isAuth ? (
              <Profile uid={this.state.uid} userFollowings={this.state.userFollowings} />
            ) : (
              <Redirect to="/login"></Redirect>
            )}
          </Route>

          <Route path="/settings" exact>
            {this.state.isAuth ? (
              <Settings uid={this.state.uid} />
            ) : (
              <Redirect to="/login"></Redirect>
            )}
          </Route>

          <Route path="/login" exact>
            {this.state.isAuth ? (
              <Redirect to="/"></Redirect>
            ) : (
              <Login
                handleLogin={(email, password) => {
                  this.handleLogin(email, password);
                }}
              />
            )}
          </Route>

          <Route path="/signup" exact>
            {this.state.isAuth ? (
              <Redirect to="/"></Redirect>
            ) : (
              <SignUp handleSignup={
                (name, email, password, username, phone, bio) => {
                  this.handleSignup(name, email, password, username, phone, bio);
                }
              }></SignUp>
            )}
          </Route>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
