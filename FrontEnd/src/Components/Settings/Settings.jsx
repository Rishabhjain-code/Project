import React, { Component } from "react";
import "./Settings.css";
const axios = require("axios");

// function toggleDisabled() {
//   let currDisabled = this.state.disabled;
//   console.log(currDisabled);
//   let user = this.state.user;
//   console.log(user);
//   this.setState({
//     user: user,
//     disabled: !currDisabled,
//   });
// }

class Settings extends Component {
  state = {
    user: {
      uid: "",
      name: "",
      handle: "",
      email: "",
      bio: "",
      phone: "",
      is_public: "",
      is_verified: "",
      pImage: "",
    },
    disabled: true,
    canNotUpdate: false,
  };

  toggleDisabled = () => {
    let currDisabled = this.state.disabled;
    // console.log(currDisabled);
    let user = this.state.user;
    // console.log(user);
    this.setState({
      user: user,
      disabled: !currDisabled,
    });
  };

  //   updating the user and changing the state which calls on the render where it puts the value of input acc to the state at that moment thus updateable input
  onChangeHandler = (e) => {
    let user = this.state.user;
    let whichInput = e.target.id;
    // console.log(user); - user obj
    // console.log(whichInput); - phone
    // console.log(e.target.value); - gives current + typed value set at each type
    // console.log(e.target);//whole html element
    user[whichInput] = e.target.value;
    let currDisabled = this.state.disabled;
    this.setState({
      user: user,
      disabled: currDisabled,
    });
  };

  //   took from db as state may have wrong value
  cancelHandler = () => {
    let user;
    axios
      .get(`https://socio-backe.herokuapp.com/api/user/${this.props.uid}`)
      .then((obj) => {
        //   console.log(obj);
        user = obj.data.data;
        let currDisabled = this.state.disabled;
        this.setState({
          user: user,
          disabled: currDisabled,
        });
      });
  };

  toggleAlert = (what) => {
    if (what == "duplicate-handle") {
      let user = this.state.user;
      let currDisabled = this.state.disabled;
      let canNotUpdate = this.state.canNotUpdate;
      console.log(user, currDisabled, canNotUpdate);
      this.setState({
        user: user,
        disabled: currDisabled,
        canNotUpdate: canNotUpdate ? false : true,
      });
    }
  };

  saveChanges = () => {
    let elem = this.fileInput.current;
    let fileObj = elem.files[0];
    // console.log(fileObj);
    let formData = new FormData();
    if (fileObj) {
      formData.append("user", fileObj);
    }
    formData.append("name", this.state.user.name);
    formData.append("handle", this.state.user.handle);
    formData.append("bio", this.state.user.bio);
    formData.append("email", this.state.user.email);
    formData.append("phone", this.state.user.phone);
    formData.append("is_public", this.state.user.is_public);

    axios
      .patch(`api/user/${this.props.uid}`, formData)
      .then((obj) => {
        console.log(obj);
        console.log(obj.data);
        console.log(obj.data.error);

        if (obj.data.error) {
          if (obj.data.error.code == "ER_DUP_ENTRY")
            this.toggleAlert("duplicate-handle");
        }
        this.componentDidMount();
      })
      .catch(function (error) {
        console.log("Error", error);
      });
  };

  //   on edit disabled set to false thus can edit
  componentDidMount() {
    let user;
    axios
      .get(`https://socio-backe.herokuapp.com/api/user/${this.props.uid}`)
      .then((obj) => {
        //   console.log(obj);
        user = obj.data.data;
        // console.log(user);
        this.setState({
          user: user,
        });
      });
  }

  fileInput = React.createRef();

  render() {
    let {
      name,
      handle,
      bio,
      email,
      phone,
      pImage,
      uid,
      is_public,
    } = this.state.user;
    let disabled = this.state.disabled;
    return (
      <div className="settings">
        {this.state.canNotUpdate && (
          <div className="settings-messages">
            <div className="settings-message">
              Handle must be unique!!!
              <button
                className="close"
                onClick={() => {
                  // to remove the alert
                  this.toggleAlert("duplicate-handle");
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
        <div className="settings-options">
          <div className="left">
            <div className="profile-image">
              {/* <img src="/images/user/default.jpeg" alt="user-image" /> */}
              <img src={pImage} alt="user-image" />
            </div>

            <div className="profile-file-input">
              {!disabled && (
                <input
                  type="file"
                  className="file-input"
                  ref={this.fileInput}
                />
              )}
            </div>

          </div>
          <div className="right">
            <div className="right-details">
              <div className="name settings-input">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  disabled={disabled}
                  onChange={this.onChangeHandler}
                />
              </div>
              <div className="handle settings-input">
                <label htmlFor="">Handle</label>
                <input
                  id="handle"
                  type="text"
                  value={handle}
                  disabled={disabled}
                  onChange={this.onChangeHandler}
                />
              </div>
              <div className="email settings-input">
                <label htmlFor="">Email</label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  disabled={disabled}
                  onChange={this.onChangeHandler}
                />
              </div>
              <div className="phone settings-input">
                <label htmlFor="">Phone</label>
                <input
                  id="phone"
                  type="text"
                  value={
                    this.state.user.phone
                      ? this.state.user.phone
                      : "12345678900"
                  }
                  disabled={disabled}
                  onChange={this.onChangeHandler}
                />
              </div>
              <div className="bio settings-input">
                <label htmlFor="">Bio</label>
                <input
                  id="bio"
                  type="text"
                  value={bio}
                  disabled={disabled}
                  onChange={this.onChangeHandler}
                />
              </div>
              <div className="is-public settings-input">
                <label htmlFor="">Privacy - Account Type</label>
                {this.state.user.is_public == "1" && (
                  <div className="options">
                    <select name="" id="" disabled={disabled}>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                )}
                {console.log(this.state.user)}
                {this.state.user.is_public == "0" && (
                  <div className="options">
                    <select name="" id="" disabled={disabled}>
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="actions">
                {disabled ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      this.toggleDisabled();
                    }}
                  >
                    Edit
                  </button>
                ) : (
                  <React.Fragment>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        this.toggleDisabled();
                        this.cancelHandler();
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        this.toggleDisabled();
                        this.saveChanges();
                      }}
                    >
                      Save
                    </button>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
