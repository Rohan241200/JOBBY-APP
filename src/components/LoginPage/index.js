import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginPage extends Component {
  state = {errorMessage: '', errorTrue: false, username: '', password: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  getLogin = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  getFailure = errorMessage => {
    this.setState({errorTrue: true, errorMessage})
  }

  onSubmitLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}

    const loginUrl = 'https://apis.ccbp.in/login'
    const option = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(loginUrl, option)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.getLogin(data.jwt_token)
    } else {
      this.getFailure(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    const {errorMessage, errorTrue, username, password} = this.state

    return (
      <div className="bg-container">
        <div className="bg-login-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <form onSubmit={this.onSubmitLogin} className="form-card">
            <div className="user-input-card">
              <label htmlFor="username" className="label">
                USERNAME
              </label>
              <input
                type="text"
                placeholder="Username"
                id="username"
                className="user-input"
                value={username}
                onChange={this.onChangeUsername}
              />
            </div>
            <div className="user-input-card">
              <label htmlFor="password" className="label">
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                className="user-input"
                value={password}
                onChange={this.onChangePassword}
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {errorTrue && <p className="error-message">*{errorMessage}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginPage
