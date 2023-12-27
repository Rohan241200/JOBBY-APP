import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {MdWork, MdHome} from 'react-icons/md'
import {RiLogoutBoxRLine} from 'react-icons/ri'
import './index.css'

const Header = props => {
  const logOut = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="link-item">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="websiteLogo"
        />
      </Link>
      <div className="desktop-view">
        <ul className="items">
          <Link to="/" className="link-item">
            <li className="link">Home</li>
          </Link>
          <Link to="/jobs" className="link-item">
            <li className="link">Jobs</li>
          </Link>
        </ul>
        <button type="button" onClick={logOut} className="logout-button">
          Logout
        </button>
      </div>
      <ul className="mobile-view">
        <Link to="/" className="link-item">
          <li className="mobile-icons">
            <MdHome className="header-icons" />
          </li>
        </Link>
        <Link to="/jobs" className="link-item">
          <li className="mobile-icons">
            <MdWork className="header-icons" />
          </li>
        </Link>
        <li className="mobile-icons">
          <RiLogoutBoxRLine onClick={logOut} className="header-icons" />
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
