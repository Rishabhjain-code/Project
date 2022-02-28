import React, { Component, createRef } from "react";
import Post from "../Post/Post.jsx";
import "./Feeds.css";
import axios from "axios";

class Feeds extends Component {
  state = {
    posts: [],
    caption: "",
    uid: "",
  };

  // runs only once
  componentDidMount() {
    axios.get("https://socio-backe.herokuapp.com/api/post").then((obj) => {
      // console.log(obj);
      let posts = obj.data.data;
      // console.log(posts);

      // reverse order sorting latest one comes first
      posts.sort((a, b) => {
        return new Date(b.created_on) - new Date(a.created_on);
      });
      this.setState({
        posts: posts,
        caption: "",
        uid: this.props.uid,
      });
    });
  }

  onChangeHandler = (e) => {
    this.setState({
      caption: e.target.value,
    });
  };

  onPostClickHandler = () => {
    if (this.feedsFileInput.current.files) {
      console.log(this.state);
      let file = this.feedsFileInput.current.files[0];
      let formData = new FormData();
      formData.append("post", file);
      formData.append("caption", this.state.caption);
      formData.append("uid", this.state.uid);

      axios.post("https://socio-backe.herokuapp.com/api/post", formData).then((obj) => {
        this.componentDidMount();
      });
    }
  };

  onDeletePostCallBack = () => {
    this.componentDidMount();
  };

  feedsFileInput = createRef();
  // feedstextInput = createRef();

  render() {
    let uid;
    return (
      <React.Fragment>
        <div className="feeds">
          <div className="feeds-upload-post">

            <label className="custom-file-upload">
              <input id="file-upload" type="file" name="file-input"
                className="feeds-file-input"
                ref={this.feedsFileInput} />
              Choose File
            </label>

            <input
              type="text"
              name="caption-input"
              className="feeds-caption-input"
              onChange={(e) => {
                this.onChangeHandler(e);
              }}
            // ref={this.feedstextInput}  
            />
            <button
              className="btn btn-primary feeds-post-button"
              onClick={this.onPostClickHandler}
            >
              Post
            </button>
          </div>

          <div className="feeds-all-posts">
            {/* {uid = this.state.uid} */}
            {this.state.posts.map((post) => {
              // console.log(this.state);
              return (
                <Post
                  key={post.pid}
                  post={post}
                  uid={this.state.uid}
                  onDeletePostCallBack={this.onDeletePostCallBack}
                />
              );
            })}
          </div>

        </div>
      </React.Fragment>
    );
  }
}

export default Feeds;
