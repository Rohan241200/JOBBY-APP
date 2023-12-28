import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobsCard from '../JobsCard'
import './index.css'

const apiStatusContent = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class Jobs extends Component {
  state = {
    userSearch: '',
    apiStatus: apiStatusContent.initial,
    profileCard: {},
  }

  componentDidMount() {
    this.getProfile()
  }

  onSearchUserInput = event => {
    this.setState({userSearch: event.target.value})
  }

  getProfile = async () => {
    this.setState({apiStatus: apiStatusContent.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileUrl, option)
    const data = await response.json()
    if (response.ok === true) {
      this.setState({
        apiStatus: apiStatusContent.success,
        profileCard: {
          name: data.profile_details.name,
          shortBio: data.profile_details.short_bio,
          profileImageUrl: data.profile_details.profile_image_url,
        },
      })
    } else {
      this.setState({apiStatus: apiStatusContent.failure})
    }
  }

  renderTypeofEmployment = () => {
    const {employmentTypesList} = this.props
    console.log(employmentTypesList)
    return <ul>Ok</ul>
  }

  renderSalaryRangesList = () => {
    const {salaryRangesList} = this.props
    console.log(salaryRangesList)
    return <ul>Ok</ul>
  }

  getProfileDetails = () => {
    const {profileCard} = this.state
    const {name, shortBio, profileImageUrl} = profileCard

    return (
      <div className="profile-card">
        <img src={profileImageUrl} alt="profile" className="profile-pic" />
        <h1 className="profile-heading">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  getProfileFailure = () => (
    <div className="profile-fail-card">
      <button
        type="button"
        className="retry-button"
        onClick={() => this.getProfile()}
      >
        Retry
      </button>
    </div>
  )

  getLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getCheckStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusContent.success:
        return this.getProfileDetails()
      case apiStatusContent.failure:
        return this.getProfileFailure()
      case apiStatusContent.inProgress:
        return this.getLoading()
      default:
        return null
    }
  }

  render() {
    const {userSearch} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="jobs-card">
            <div className="profile-container">
              <div className="search-card mobile">
                <input
                  type="search"
                  value={userSearch}
                  onChange={this.onSearchUserInput}
                  className="mobile-search-input"
                  placeholder="Search"
                />
                <button
                  type="button"
                  aria-label="search"
                  className="search-button"
                  data-testid="searchButton"
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
              {this.getCheckStatus()}
              {this.renderTypeofEmployment()}
              {this.renderSalaryRangesList()}
            </div>
            <div className="job-list-container">
              <JobsCard />
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
