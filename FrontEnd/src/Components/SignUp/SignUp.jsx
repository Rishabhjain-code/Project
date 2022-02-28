import React, { Component, createRef } from "react";
import "./SignUp.css"
import validator from "validator";

class SignUp extends Component {
    state = {};

    emailinput = createRef();
    passwordinput = createRef();
    phoneinput = createRef();
    bioinput = createRef();
    nameinput = createRef();
    usernameinput = createRef();
    accessinput = createRef();

    render() {
        return (
            <React.Fragment>
                <div className="signup-page">
                    <div className="signup-left">
                        <div className="signup-logo">
                            <img src="image/6325241.jpg" />
                        </div>

                    </div>
                    <div className="signup-right">
                        <div className="signup-credentials">

                            <div className="signup-name">
                                <div className="signup-name-handle">Name</div>
                                <input
                                    type="name"
                                    className="signup-name-input"
                                    ref={this.nameinput}
                                />
                            </div>
                            <div className="signup-username">
                                <div className="signup-username-handle">Username</div>
                                <input
                                    type="username"
                                    className="signup-username-input"
                                    ref={this.usernameinput}
                                />
                            </div>
                            <div className="signup-phone">
                                <div className="signup-phone-handle">Phone</div>
                                <input
                                    type="tel"
                                    className="signup-phone-input"
                                    ref={this.phoneinput}
                                    pattern="[0-9]{10}"
                                />
                            </div>
                            <div className="signup-email">
                                <div className="signup-email-handle">Email</div>
                                <input
                                    type="email"
                                    className="signup-email-input"
                                    ref={this.emailinput}
                                />
                            </div>
                            <div className="signup-password">
                                <div className="signup-password-handle">Password</div>
                                <input
                                    type="password"
                                    className="signup-password-input"
                                    ref={this.passwordinput}
                                />
                            </div>
                            <div className="signup-bio">
                                <div className="signup-bio-handle">Bio</div>
                                <input
                                    type="bio"
                                    className="signup-bio-input"
                                    ref={this.bioinput}
                                />
                            </div>

                            <div className="signup-access">
                                <div className="signup-access-handle">Access</div>
                                <select name="access" id="access" ref={(input) => this.menu = input}>
                                    <option value="Public">Public</option>
                                    <option value="Private">Private</option>
                                </select>
                            </div>
                        </div>

                        {/* CaptainAmerica@gmail.com , americancaptain  */}
                        <div className="oauth-signup">
                            <button
                                className="btn btn-dark"
                                onClick={() => {
                                    let email = this.emailinput.current.value;
                                    let password = this.passwordinput.current.value;
                                    let name = this.nameinput.current.value;
                                    let phone = this.phoneinput.current.value;
                                    let bio = this.bioinput.current.value;
                                    let username = this.usernameinput.current.value;
                                    let access = this.menu.value;
                                    let isPrivate = access == "Private" ? true : false;

                                    // console.log(name, email, password, phone, bio, username,isPrivate);
                                    if (validator.isEmail(email) && phone.length != 10)
                                        this.props.handleSignup(name, email, password, username, phone, bio, isPrivate);
                                    else {
                                        alert("Kindly check your email/phone number");
                                    }
                                }}
                            >
                                SignUp
                            </button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default SignUp;
