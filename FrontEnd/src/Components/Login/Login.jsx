import React, { Component, createRef } from "react";
import "./Login.css";

import validator from 'validator';

class Login extends Component {
  state = {};

  emailinput = createRef();
  passwordinput = createRef();

  render() {
    return (
      <React.Fragment>
        <div className="login-page">
          <div className="login-left">
            <div className="login-logo">
              <img src="image/4860253.jpg" alt="" />
            </div>
          </div>

          <div className="login-right">
            <form className="credentials-form" action="/action_page.php">
              <label htmlFor="email">
                Email
              </label>
              <input
                name="email"
                id="email"
                type="email"
                className="login-email-input"
                value="rishabh@gmail.com"
                ref={this.emailinput}
              />

              <label htmlFor="password" >Password</label>
              <input
                name="password"
                type="password"
                value="admin"
                className="login-password-input"
                ref={this.passwordinput}
              />
            </form>

            {/* CaptainAmerica@gmail.com , americancaptain  */}
            <div className="login-button">
              <input
                type="submit"
                className="btn btn-dark"
                value="Login"
                onClick={() => {
                  let email = this.emailinput.current.value;
                  let password = this.passwordinput.current.value;
                  if (validator.isEmail(email))
                    this.props.handleLogin(email, password);
                  else {
                    alert("Enter Valid Email");
                  }
                }}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
