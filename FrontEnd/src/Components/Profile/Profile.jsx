// Navbar par jo profile h yeh voh h

import axios from "axios";
import React, { Component } from "react";
// import SelfPost from "../SelfPost/SelfPost";
import Post from "../Post/Post";
import "./Profile.css";

class Profile extends Component {
  state = {
    posts: [],
    user: {},
    followers: [],
    followings: [],
    pendingRequests: [],
    viewSelected: "posts",
    removedFollower: false,
    removedFollowing: false,
  };

  componentDidMount = () => {
    let posts = [],
      user = {},
      followers = [],
      followings = [],
      pendingRequests = [],
      viewSelected = "posts",
      removedFollower = false,
      removedFollowing = false;

    axios
      .get(`https://socio-backe.herokuapp.com/api/post/${this.props.uid}`)
      .then((obj) => {
        // console.log(obj);

        if (obj.data.data) {
          posts = obj.data.data;
        }
        // console.log(posts);
        return axios.get(`https://socio-backe.herokuapp.com/api/user/${this.props.uid}`);
        // this.state.posts.map((post) => {
        //   console.log(post);
        //   return <Post key={post.pid} post={post} />;
        // });
      })
      .then((obj) => {
        // obj is the user
        // console.log(posts);
        // console.log(obj.data.data);
        if (obj.data.data) user = obj.data.data;
        return axios.get(`https://socio-backe.herokuapp.com/api/request/followers/${this.props.uid}`);
      })
      .then((obj) => {
        // console.log("followers", obj);


        if (obj.data.followers) followers = obj.data.followers;
        return axios.get(`https://socio-backe.herokuapp.com/api/request/following/${this.props.uid}`);
      })
      .then((obj) => {
        // console.log("following", following);

        // NOW DONE AT APP
        // if (obj.data.following) followings = obj.data.following;

        return axios.get(`https://socio-backe.herokuapp.com/api/request/pendingusers/${this.props.uid}`);
      })
      .then((obj) => {
        // console.log(obj);
        if (obj.data.requests) {
          pendingRequests = obj.data.requests;
        }
        this.setState({
          posts,
          user,
          followers,
          followings: this.props.userFollowings,
          pendingRequests,
          viewSelected,
          removedFollower,
          removedFollowing,
        });
      });
  };

  changeViewHandler = (viewName) => {
    let {
      posts,
      user,
      followers,
      followings,
      pendingRequests,
      viewSelected,
      removedFollower,
      removedFollowing,
    } = this.state;

    this.setState({
      posts: posts,
      user: user,
      followers: followers,
      followings: followings,
      pendingRequests: pendingRequests,
      viewSelected: viewName,
      removedFollower: removedFollower,
      removedFollowing: removedFollowing,
    });
  };

  removeRequest = (what, uid, oid) => {
    // console.log(what, uid, oid);
    if (what == "following") {
      axios({
        method: "delete",
        url: "https://socio-backe.herokuapp.com/api/request/unfollow",
        data: {
          user_id: `${uid}`,
          unfollow_id: `${oid}`,
        },
      }).then((obj) => {
        if (obj.data.message == "Unfollowed succesfully !") {
          this.toggleAlert(`removed-${what}`);
          this.componentDidMount();
        }
      });
    } else if (what == "follower") {
      // b ka a follower, removing means b - a remove from followerTable and a-b remove from following table
      //unfollow written from a side thus
      axios({
        method: "delete",
        url: "https://socio-backe.herokuapp.com/api/request/unfollow",
        data: { user_id: oid, unfollow_id: uid },
      }).then((obj) => {
        if (obj.data.message == "Unfollowed succesfully !") {
          this.toggleAlert(`removed-${what}`);
          this.componentDidMount(); //to update the Ui;
        }
      });
    }
  };

  toggleAlert = (whichAlert) => {
    let {
      posts,
      user,
      followers,
      followings,
      viewSelected,
      removedFollower,
      removedFollowing,
    } = this.state;
    if (whichAlert == "removed-follower") {
      removedFollower = !removedFollower;
    } else {
      removedFollowing = !removedFollowing;
    }

    this.setState({
      posts,
      user,
      followers,
      followings,
      viewSelected,
      removedFollower,
      removedFollowing,
    });
  };

  acceptRequest = (ofWhom) => {
    axios({
      method: "patch",
      url: "https://socio-backe.herokuapp.com/api/request/accept",
      data: {
        user_id: this.props.uid,
        accept_id: ofWhom,
      },
    }).then((obj) => {
      alert(obj.data.message);
      if (!obj.data.error) {
        this.componentDidMount();
      }
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="messages">
          {/* using toggleAlert here to removeThe alert on clicking close*/}

          {this.state.removedFollower && (
            <div className="message removed-follower">
              <strong>Removed Follower Successfully</strong>
              <button
                className="close"
                onClick={() => {
                  this.toggleAlert("removed-follower");
                }}
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          )}

          {this.state.removedFollowing && (
            <div className="message removed-following">
              <strong>Successfully Unfollowed selected User</strong>
              <button
                className="close"
                onClick={() => {
                  this.toggleAlert("removed-following");
                }}
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          )}

        </div>
        <div className="profile">
          <div className="profile-top">
            <div className="profile-info">
              <div className="profile-user-image-div">
                <img
                  className="profile-user-image"
                  src={this.state.user.pImage}
                  alt=""
                />
              </div>
              <div className="profile-user-details">
                <div className="profile-name">
                  <strong>Name:</strong>
                  {this.state.user.name}
                </div>
                <div className="profile-username">
                  <strong>Username:</strong>
                  {this.state.user.handle}
                </div>
                <div className="profile-user-bio">
                  <strong>Handle:</strong>
                  {this.state.user.bio}
                </div>
              </div>
            </div>
            <div className="profile-stats">
              <div
                className="profile-posts-count"
                onClick={() => {
                  this.changeViewHandler("posts");
                }}
              >
                {/* {console.log(this.state.posts)} */}
                <div className="profile-count">{this.state.posts.length}</div>
                POSTS
              </div>

              <div
                className="profile-followers-count"
                onClick={() => {
                  this.changeViewHandler("followers");
                }}
              >
                <div className="profile-count">
                  {this.state.followers.length}
                </div>
                FOLLOWERS
              </div>

              <div
                className="profile-followings-count"
                onClick={() => {
                  this.changeViewHandler("followings");
                }}
              >
                <div className="profile-count">
                  {this.state.followings.length}
                </div>
                FOLLOWING
              </div>

              <div
                className="profile-pendingRequests-count"
                onClick={() => {
                  this.changeViewHandler("pending-requests");
                }}
              >
                <div className="profile-count">
                  {this.state.pendingRequests.length}
                </div>
                REQUESTS
              </div>
            </div>
          </div>

          {/* conditional viewing */}
          {this.state.viewSelected == "posts" && (
            <div className="profile-feeds">
              {this.state.posts.map((post) => {
                // console.log(post);

                // return <SelfPost key={post.pid} post={post}></SelfPost>;
                return <Post key={post.pid} post={post} uid={this.state.user.uid}></Post>;

              })}
            </div>
          )}

          {/* {this.state.viewSelected == "followers" && (
            <div className="profile-followers">ALL FOLLOWERS</div>
          )} */}

          <div className="followers">
            {this.state.viewSelected == "followers" && (
              <div className="followers-list">
                {this.state.followers.map((followerUser) => {
                  // console.log(followerUser);

                  // a follower user component

                  if (followerUser) {
                    return (
                      <React.Fragment>
                        <div className="follower-user" key={followerUser.uid}>
                          <div className="follower-user-image">
                            <img
                              src={followerUser.pImage}
                              alt="follower User Image"
                            />
                          </div>
                          <div className="follower-user-details">
                            <div className="follower-user-name">
                              {followerUser.name}
                            </div>
                            <div className="follower-user-handle">
                              {followerUser.handle}
                            </div>
                          </div>
                          <div
                            className="follower-remove-button"
                            // using to show the alert now
                            onClick={() => {
                              this.removeRequest(
                                "follower",
                                this.state.user.uid,
                                followerUser.uid
                              );
                            }}
                          >
                            <button className="btn btn-danger">Remove</button>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  }
                })}
              </div>
            )}
          </div>

          <div className="followings">
            {this.state.viewSelected == "followings" && (
              <div className="followings-list">
                {this.state.followings.map((followingUser) => {
                  // console.log(followingUser);

                  // a following user component
                  return (
                    <div className="following-user" key={followingUser.uid}>
                      <div className="following-user-image">
                        <img
                          src={followingUser.pImage}
                          alt="following User Image"
                        />
                      </div>
                      <div className="following-user-details">
                        <div className="following-user-name">
                          {followingUser.name}
                        </div>
                        <div className="following-user-handle">
                          {followingUser.handle}
                        </div>
                      </div>
                      <div
                        className="following-remove-button"
                        // using to show the alert now
                        onClick={() => {
                          this.removeRequest(
                            "following",
                            this.state.user.uid,
                            followingUser.uid
                          );
                        }}
                      >
                        <button className="btn btn-danger">Remove</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="requests">
            {this.state.viewSelected == "pending-requests" && (
              <div className="pending-requests-list">
                {this.state.pendingRequests.map((PendingRequest) => {
                  // logging an array on the console.
                  PendingRequest = PendingRequest[0];
                  console.log(PendingRequest);
                  return (
                    <div className="request-user">
                      <div className="request-user-image">
                        <img
                          src={PendingRequest.pImage}
                          alt="Request User Image"
                        />
                      </div>
                      <div className="request-user-details">
                        <div className="request-user-name">
                          {PendingRequest.name}
                        </div>
                        <div className="request-user-handle">
                          {PendingRequest.handle}
                        </div>
                      </div>
                      <div className="accept-request-button">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            this.acceptRequest(PendingRequest.uid);
                          }}
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Profile;
