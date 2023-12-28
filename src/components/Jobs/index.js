import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobsCardList from '../JobsCardList'
import './index.css'

const apiStatusContent = {
  initial: 'INITIAL',
  successP: 'SUCCESS',
  failureP: 'FAILURE',
  successJ: 'SUCCESS',
  failureJ: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class Jobs extends Component {
  state = {
    userSearch: '',
    userSalary: '',
    jobs: [],
    userEType: [],
    apiStatus: apiStatusContent.initial,
    profileCard: {},
  }

  componentDidMount() {
    this.getJobs()
    this.getProfile()
  }

  // GET PROFILE CARD
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
        apiStatus: apiStatusContent.successP,
        profileCard: {
          name: data.profile_details.name,
          shortBio: data.profile_details.short_bio,
          profileImageUrl: data.profile_details.profile_image_url,
        },
      })
    } else {
      this.setState({apiStatus: apiStatusContent.failureP})
    }
  }

  // GET JOBS CARD
  getJobs = async () => {
    this.setState({apiStatus: apiStatusContent.inProgress})

    const {userSearch, userSalary, userEType} = this.state

    const jwtToken = Cookies.get('jwt_token')
    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const url = `https://apis.ccbp.in/jobs?employment_type=${userEType}&minimum_package=${userSalary}&search=${userSearch}`

    const response = await fetch(url, option)
    const data = await response.json()

    if (response.ok === true) {
      const updateData = data.jobs.map(each => ({
        title: each.title,
        rating: each.rating,
        location: each.location,
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        annualPackage: each.package_per_annum,
      }))

      this.setState({apiStatus: apiStatusContent.successJ, jobs: updateData})
    } else {
      this.setState({apiStatus: apiStatusContent.failureJ})
    }
  }

  // PROFILE API

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

  getProfileRerender = () => {
    this.getProfile()
  }

  getProfileFailure = () => (
    <div className="profile-fail-card">
      <button
        type="button"
        className="retry-button"
        onClick={this.getProfileRerender}
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
      case apiStatusContent.successP:
        return this.getProfileDetails()
      case apiStatusContent.failureP:
        return this.getProfileFailure()
      case apiStatusContent.inProgress:
        return this.getLoading()
      default:
        return null
    }
  }

  // GET SEARCH API
  onPressEnter = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  clickSearch = () => {
    this.getJobs()
  }

  onSearchUserInput = event => {
    this.setState({userSearch: event.target.value})
  }

  // GET FILTER API
  onChangeType = event => {
    const {userEType} = this.state
    const getFilter = userEType.filter(each => each === event.target.value)

    if (getFilter.length === 0) {
      this.setState(
        prevState => ({
          userEType: [...prevState.userEType, event.target.value],
        }),
        this.getJobs,
      )
    } else {
      const getCheck = userEType.filter(each => each !== event.target.value)
      this.setState({userEType: getCheck}, this.getJobs)
    }
  }

  renderTypeofEmployment = () => {
    const {employmentTypesList} = this.props
    return (
      <>
        <h1 className="filter-heading">Type of Employments</h1>
        <ul className="employment-type-card">
          {employmentTypesList.map(each => (
            <li className="employment-type-lists" key={each.label}>
              <input
                type="checkbox"
                id={each.employmentTypeId}
                value={each.employmentTypeId}
                onChange={this.onChangeType}
              />
              <label
                htmlFor={each.employmentTypeId}
                className="employment-type-label"
              >
                {each.label}
              </label>
            </li>
          ))}
        </ul>
      </>
    )
  }

  onChangeSalary = event => {
    this.setState({userSalary: event.target.value}, this.getJobs)
  }

  renderSalaryRangesList = () => {
    const {salaryRangesList} = this.props
    return (
      <>
        <h1 className="filter-heading">Salary Range</h1>
        <ul className="employment-type-card">
          {salaryRangesList.map(each => (
            <li className="employment-type-lists" key={each.label}>
              <input
                type="radio"
                id={each.salaryRangeId}
                name="salary"
                value={each.salaryRangeId}
                onChange={this.onChangeSalary}
              />
              <label
                htmlFor={each.salaryRangeId}
                className="employment-type-label"
              >
                {each.label}
              </label>
            </li>
          ))}
        </ul>
      </>
    )
  }

  // GET JOBS API
  getJobsRerender = () => {
    this.getJobs()
  }

  getJobsFailure = () => (
    <div className="empty-jobs-list">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="empty-jobs-img"
      />
      <h1 className="company-title">Oops! Something Went Wrong</h1>
      <p className="company-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        onClick={this.getJobsRerender}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  getJobsSuccess = () => {
    const {jobs} = this.state
    const jobsLength = jobs.length > 0
    return jobsLength ? (
      <ul className="jobsList-items">
        {jobs.map(each => (
          <JobsCardList jobsDetails={each} key={each.id} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-card">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-img"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-desc">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  getRender = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusContent.successJ:
        return this.getJobsSuccess()
      case apiStatusContent.failureJ:
        return this.getJobsFailure()
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
                  onKeyDown={this.onPressEnter}
                />
                <button
                  type="button"
                  aria-label="search"
                  className="search-button"
                  data-testid="searchButton"
                  onClick={this.clickSearch}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
              {this.getCheckStatus()}
              <hr className="separate" />
              {this.renderTypeofEmployment()}
              <hr className="separate" />
              {this.renderSalaryRangesList()}
            </div>
            <div className="job-list-container">
              <div className="search-card desktop">
                <input
                  type="search"
                  value={userSearch}
                  onChange={this.onSearchUserInput}
                  className="mobile-search-input"
                  placeholder="Search"
                  onKeyDown={this.onPressEnter}
                />
                <button
                  type="button"
                  aria-label="search"
                  className="search-button"
                  data-testid="searchButton"
                  onClick={this.clickSearch}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
              {this.getRender()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
