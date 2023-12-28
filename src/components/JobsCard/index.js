import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import JobsCardList from '../JobsCardList'

import './index.css'

const apiStatusContent = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class JobsCard extends Component {
  state = {apiStatus: apiStatusContent.initial, jobs: [], userSearch: ''}

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusContent.inProgress})

    const {userSearch} = this.state

    const jwtToken = Cookies.get('jwt_token')
    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const url = `https://apis.ccbp.in/jobs?employment_type=${''}&minimum_package=${''}&search=${userSearch}`

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

      this.setState({apiStatus: apiStatusContent.success, jobs: updateData})
    } else {
      this.setState({apiStatus: apiStatusContent.failure})
    }
  }

  getLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getFailure = () => (
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
        onClick={() => this.getJobs()}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  getSucces = () => {
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
      case apiStatusContent.success:
        return this.getSucces()
      case apiStatusContent.failure:
        return this.getFailure()
      case apiStatusContent.inProgress:
        return this.getLoading()
      default:
        return null
    }
  }

  clickSearch = () => {
    this.getJobs()
  }

  onSearchUserInput = event => {
    this.setState({userSearch: event.target.value})
  }

  render() {
    const {userSearch} = this.state
    return (
      <>
        <div className="search-card desktop">
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
            onClick={this.clickSearch}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        {this.getRender()}
      </>
    )
  }
}

export default JobsCard
