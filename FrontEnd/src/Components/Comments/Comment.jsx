import axios from "axios";
import React, { Component } from "react";
import "./Comment.css";

class Comment extends Component {
  state = {
    comment_id: "",
    uid: "",
    post_id: "",
    comment: "",
    user: { name: "" },
    loggedInId: "",
  };

  handleUpdateCaptionComment = (comment_id) => {
    let updatedComment = this.props.updateCaptionInput.current.value;
    console.log("new comment", updatedComment);

    axios({
      method: "patch",
      url: `https://socio-backe.herokuapp.com/api/comment/${comment_id}`,
      data: {
        comment: updatedComment,
      },
    }).then((obj) => {
      console.log(obj);
      this.props.callbackFunction();
    });
  };

  componentDidMount() {
    let { comment_id, post_id, comment } = this.props.commentObj;
    let uid = this.props.commentObj.user_who_commented;
    let user;
    axios
      .get(`https://socio-backe.herokuapp.com/api/user/${uid}`)
      .then((obj) => {
        if (obj.data.data) {
          user = obj.data.data;
        } else
          user = {
            name: "",
          };
      })
      .then(() => {
        this.setState({
          comment_id: comment_id,
          uid: uid,
          post_id: post_id,
          comment: comment,
          user: user,
          loggedInId: this.props.uid,
        });
      });
  }

  render() {
    return (
      <div className="comment">
        <div className="comment-data">
          <p>
            <strong>{this.state.user.name + " "}</strong>
            {this.state.comment}
          </p>
        </div>
      </div>
    );
  }
}

export default Comment;
