import React, { Component, createRef } from 'react'
import "./SearchUser.css"
import axios from 'axios';

class SearchUser extends Component {
    state = {
        isFollowing: false,
    }

    followButtonRef = createRef();

    sendFollowRequest = (element, value) => {
        let follow_id = element.uid;
        let user_id = this.props.uid;

        console.log(user_id, follow_id);

        if (value == "Follow") {
            axios({
                method: "post",
                url: "https://socio-backe.herokuapp.com/api/request",
                data: {
                    user_id: `${user_id}`,
                    follow_id: `${follow_id}`,
                },
            }).then((obj) => {
                this.followButtonRef.current.value = "Following"
                this.followButtonRef.current.classList.remove("btn-primary")
                this.followButtonRef.current.classList.add("btn-danger")
            }).catch((error) => {
                console.log(error);
            })
        }
        else {
            axios({
                method: "delete",
                url: "https://socio-backe.herokuapp.com/api/request/unfollow",
                data: {
                    user_id: `${user_id}`,
                    unfollow_id: `${follow_id}`,
                },
            }).then((obj) => {
                this.followButtonRef.current.value = "Follow"
                this.followButtonRef.current.classList.remove("btn-danger")
                this.followButtonRef.current.classList.add("btn-primary")
            }).catch((error) => {
                console.log(error);
            })
        }


    }

    componentDidMount() {
        // SET STATE IN COMPONENT DID MOUNT, ELSE IF DONE IN RENDER FUNCTION, INFINITE LOOP AS ON ONE RENDER AGAIN RENDER CALLED

        let element = this.props.element;
        let uid = element.uid;
        let followingsOfUser = this.props.followings;
        // console.log(followingsOfUser);
        for (let i = 0; i < followingsOfUser.length; i++) {
            let following_id = followingsOfUser[i].uid;
            if (following_id == uid) {
                this.setState({
                    isFollowing: true
                })
                break;
            }
        }
    }

    render() {
        let element = this.props.element;

        let handle = element.handle, name = element.name;
        let pImage = element.pImage;
        return (
            <div className="search-user" id={element.uid}>
                <div className="user-image-name-handle">
                    <div className="search-user-image">
                        <img src={pImage} alt="" />
                    </div>
                    <div className="name-handle">
                        <div className="search-user-name">
                            {name}
                        </div>
                        <div className="search-user-handle">
                            {handle}
                        </div>
                    </div>
                </div>
                <div className="buttons">
                    {(() => {
                        // const [isFollowing, setFollowing] = useState(false);
                        // currently isFollowing = false
                        // saying to make a separate component and use its internal state,
                        // https://stackoverflow.com/questions/57012027/how-do-i-change-the-innerhtml-of-an-element-using-react

                        if (element.uid != this.props.uid) {
                            return (<div className="follow-button">
                                <input type="button" className={this.state.isFollowing ? "btn btn-danger" : "btn btn-primary"} ref={this.followButtonRef} onClick={() => { this.sendFollowRequest(element, this.followButtonRef.current.value) }} value={this.state.isFollowing ? "Following" : "Follow"} />
                            </div>);
                        }
                        // all getting same reference thus click any last one got updated only as it was the last referenced

                    })()
                    }
                </div>
            </div>
        )
    }
}

export default SearchUser;