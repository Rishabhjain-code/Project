import axios from "axios";
import React, { Component, createRef } from "react";
import "./ProfileView.css";

// page for showing names and sugeestions part = right side baar
class ProfileView extends Component {
  state = {
    user: {
      handle: "",
      name: "",
      pImage: "",
    },
    suggestions: [{}],
    uid: "f0960504-e33b-48b3-8ecb-e4a1bebca1a2",
  };

  async getSuggestions() {
    console.log("Hello", this.state.uid);
    let obj = await axios.get(`https://socio-backe.herokuapp.com/api/request/suggestions/${this.state.uid}`);
    if (obj.data.suggestions) {
      return obj;
    } else {
      return this.getSuggestions();
    }
  }

  async getUserDetails() {
    let obj = await axios.get(`https://socio-backe.herokuapp.com/api/user/${this.state.uid}`);
    if (obj.data.data) {
      return obj.data.data;
    } else {
      return this.getUserDetails();
    }
  }

  componentDidMount() {
    let user;
    axios
      .get(`api/user/${this.state.uid}`)
      .then((userData) => {
        if (userData) {
          user = userData.data.data;
        } else {
          user = this.getUserDetails();
        }
      })
      .then(() => {
        return this.getSuggestions();
      })
      .then((obj) => {
        console.log(obj);
        let suggestions = obj.data.suggestions;
        if (suggestions) {
          suggestions.map((suggestion) => {
            if (suggestion)
              suggestion.isFollowed = false;
          });
          this.setState({
            user: user,
            suggestions: suggestions,
            uid: "f0960504-e33b-48b3-8ecb-e4a1bebca1a2",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // as here too if want to change the button value needed a separate component so that can change its state after 
  // performing work on the backend but now just doing work not changing the Follow to Sent etc.
  sendRequest(suggestion) {
    // console.log(suggestion);
    let { uid } = suggestion;
    console.log(this.state.uid, uid);
    axios({
      method: 'post',
      url: 'https://socio-backe.herokuapp.com/api/request',
      data: {
        "user_id": this.state.uid,
        "follow_id": uid
      }
    }).then((obj) => {
      console.log(obj);
    }).catch((error) => {
      console.log(error);
    })
  }

  render() {
    return (
      <div className="profile-view" ref={this.props.profileViewRef}>
        {/*  
        took for making the inner div at center as it needs justify-content:center but that needs display flex if more than 1 div then it will create error thus took 1 more div */}
        <div className="profile-view-div">
          <div
            className="profile-view-user-details"
            key="profile-view-user-details"
          >
            <div
              className="profile-view-user-image"
              key="profile-view-user-image"
            >
              <img src={this.state.user.pImage} alt="" />
            </div>
            <div
              className="profile-view-user-names"
              key="profile-view-user-names"
            >
              <div
                className="profile-view-username"
                key="profile-view-username"
              >
                {this.state.user.handle}
              </div>
              <div
                className="profile-view-fullname"
                key="profile-view-fullname"
              >
                {this.state.user.name}
              </div>
            </div>
          </div>
          <div
            className="profile-view-all-suggestions"
            key="profile-view-all-suggestions"
          >
            <div className="profile-view-heading" key="profile-view-heading">
              <h4>Suggestions</h4>
            </div>

            {this.state.suggestions.map((suggestion) => {
              if (suggestion)
                return (
                  <div
                    className="profile-view-suggestion-user"
                    key="profile-view-suggestion-user"
                  >
                    <div
                      className="suggestion-user-image"
                      key="suggestion-user-image"
                    >
                      <img src={suggestion.pImage} alt="" />
                    </div>

                    <div
                      className="suggestion-user-name"
                      key="suggestion-user-name"
                    >
                      <div
                        className="suggestion-username"
                        key="suggestion-username"
                      >
                        {suggestion.handle}
                      </div>

                      <div
                        className="suggestion-fullname"
                        key="suggestion-fullname"
                      >
                        {suggestion.name}
                      </div>
                    </div>

                    <div
                      className="suggestion-follow-button"
                      key="suggestion-follow-button"
                    >
                      <button className="btn btn-primary" onClick={() => { this.sendRequest(suggestion) }}>Follow</button>
                    </div>
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileView;
