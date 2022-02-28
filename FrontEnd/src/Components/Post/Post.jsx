import React, { Component } from "react";
import "./Post.css";
import axios from "axios";
import Comment from "../Comments/Comment.jsx";

async function getPostUserDetails(uid) {
  let obj = await axios.get(`https://socio-backe.herokuapp.com/api/user/${uid}`);
  if (obj.data.data) {
    return obj.data.data;
  } else {
    return getPostUserDetails();
  }
}

class Post extends Component {
  state = {
    user: {},
    username: "",
    userImage: "",
    postImage: "",
    caption: "",
    likes: 0,
    followedOrNot: false,
    requestedOrNot: false,
    loggedInId: "",
    comments: [],
  };

  componentDidMount() {
    let user, comments;
    axios
      .get(`https://socio-backe.herokuapp.com/api/user/${this.props.post.uid}`)
      .then((obj) => {
        user = obj.data.data;
        if (!user) {
          user = getPostUserDetails();
        }
      })
      .then(() => {
        return axios.get(`https://socio-backe.herokuapp.com/api/comment/post/${this.props.post.pid}`);
      })
      .then((obj) => {
        // console.log(obj);
        if (obj.data.data) {
          comments = obj.data.data;
        } else {
          comments = [{}];
        }
        // console.log(comments);
        this.setState({
          user: user,
          username: user.name,
          userImage: user.pImage,
          postImage: this.props.post.postImage,
          caption: this.props.post.caption,
          loggedInId: this.props.uid,
          comments: comments,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  sendRequest = (toWhom) => {
    let {
      user,
      username,
      userImage,
      postImage,
      caption,
      likes,
      followedOrNot,
      requestedOrNot,
    } = this.state;

    axios({
      method: "post",
      url: "https://socio-backe.herokuapp.com/api/request",
      data: {
        user_id: this.state.loggedInId,
        follow_id: toWhom,
      },
    }).then((obj) => {
      console.log(obj);
      if (obj.data.message == "Request sent and accepted !!") {
        followedOrNot = true;
      } else {
        requestedOrNot = true;
      }

      this.setState({
        user,
        username,
        userImage,
        postImage,
        caption,
        likes,
        followedOrNot,
        requestedOrNot,
        loggedInId: this.props.uid,
      });
      // console.log(this.state);
    });
  };

  handleDeletePost = (pid) => {
    axios.delete("https://socio-backe.herokuapp.com/api/post/" + pid).then((obj) => {
      console.log(obj);
      this.props.onDeletePostCallBack();
    });
  };

  updateCaptionInput = React.createRef();

  commentInputChangeHandler = (event) => {
  };

  handleCommentClick = (comment) => {
    console.log(this.updateCaptionInput);
    let user_commented_what = this.updateCaptionInput.current.value;
    this.updateCaptionInput.current.value = "";
    let user_who_commented = this.state.loggedInId;
    let post_id = this.props.post.pid;
    console.log(user_commented_what, user_who_commented, post_id);
    let formData = new FormData();
    formData.append("uid", user_who_commented);
    formData.append("pid", post_id);
    formData.append("comment", user_commented_what);

    axios({
      method: "post",
      url: "https://socio-backe.herokuapp.com/api/comment",
      data: {
        uid: user_who_commented,
        pid: post_id,
        comment: user_commented_what,
      },
    })
      .then((obj) => {
        // console.log(obj);
        this.componentDidMount();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleUpdateCaption = () => {
    let newCaption = this.updateCaptionInput.current.value;
    let pid = this.props.post.pid;
    axios({
      method: "patch",
      url: `https://socio-backe.herokuapp.com/api/post/update/${pid}`,
      data: {
        caption: newCaption,
      },
    }).then((obj) => {
      console.log(obj);
      this.onDeletePostCallBack();
    });
  };

  callbackFunction = () => {
    console.log("Inside CallBack");
    this.componentDidMount();
  };

  render() {
    return (
      <div className="post">
        <div className="post-username">
          <div className="post-userimage">
            <img src={this.state.userImage} alt="" />
          </div>
          <div className="username">{this.state.username}</div>

          <div className="button-options">
            {this.state.user.uid != this.state.loggedInId && (
              <div className="follow-post">
                <button
                  className="btn btn-primary follow-post-button"
                  onClick={() => {
                    this.sendRequest(this.props.post.uid);
                  }}
                >
                  {this.state.followedOrNot
                    ? "Following"
                    : this.state.requestedOrNot
                      ? "Requested"
                      : "Follow"}
                </button>
              </div>
            )}

            {this.state.user.uid == this.state.loggedInId && (
              <div className="delete-post">
                <button
                  className="btn btn-danger delete-post-button"
                  onClick={() => {
                    this.handleDeletePost(this.props.post.pid);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="post-image">
          <img src={this.state.postImage} alt="" />
        </div>
        <div className="post-actions-and-like">

          <div className="like-icon">
            <i className="far fa-heart"></i>
          </div>
          <div className="comment-icon">
            <i className="fas fa-comments"></i>
          </div>
          <div className="post-likes-count">{this.state.likes}</div>


        </div>
        {/* post-comments can be staeful component */}
        <div className="user-post">
          <strong className="user-post-name">{this.state.username + " "}</strong>
          {this.state.caption}
        </div>
        <div className="post-comments-section">
          {this.state.comments.map((commentObj) => {
            return (
              <Comment
                commentObj={commentObj}
                uid={this.state.loggedInId}
                // passing the ref to get the typed input later on
                updateCaptionInput={this.updateCaptionInput}
                callbackFunction={() => this.callbackFunction()}
                key={commentObj.comment_id}
              ></Comment>
            );
          })}
        </div>
        <div className="post-add-comment" key={this.props.post.pid}>
          <input
            key={this.props.post.pid}
            className="comment-input"
            type="text"
            placeholder="Add a comment.."
            name=""
            id=""
            ref={this.updateCaptionInput}
          />
          {/* <div contentEditable = "true" id="comment-input">Add a comment..</div> */}
          <button
            className="btn btn-success comment-button"
            onClick={this.handleCommentClick}
          >
            Comment
          </button>
        </div>
      </div>
    );
  }
}
export default Post;
