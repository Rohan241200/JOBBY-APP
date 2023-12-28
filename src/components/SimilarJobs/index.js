import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import './index.css'
import SimilarJobsList from '../SimilarJobsLists'
import SkillsList from '../SkillsList'

const apiStatusContent = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class SimilarJobs extends Component {
  state = {
    similar: [],
    jobDetails: {},
    jobDetailsSkills: [],
    apiStatus: apiStatusContent.initial,
  }

  componentDidMount() {
    this.getSimilarJobs()
  }

  getSimilarJobs = async () => {
    this.setState({apiStatus: apiStatusContent.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, option)

    if (response.ok === true) {
      const data = await response.json()

      const job = data.job_details
      const updateJobDetails = {
        detailTitle: job.title,
        detailCompanyLogoUrl: job.company_logo_url,
        detailCompanyWebsiteUrl: job.company_website_url,
        detailEmploymentType: job.employment_type,
        detailId: job.id,
        detailJobDescription: job.job_description,
        detailLocation: job.location,
        detailPackage: job.package_per_annum,
        detailRating: job.rating,
        lifeAtCompanyDescription: job.life_at_company.description,
        lifeAtCompanyImageUrl: job.life_at_company.image_url,
      }

      const updateSkills = job.skills.map(each => ({
        skillsImageUrl: each.image_url,
        skillsName: each.name,
      }))

      const updateSimilar = data.similar_jobs.map(each => ({
        similarCompanyLogoUrl: each.company_logo_url,
        similarEmploymentType: each.employment_type,
        similarJobDescription: each.job_description,
        similarLocation: each.location,
        similarRating: each.rating,
        similarTitle: each.title,
        similarId: each.id,
      }))

      this.setState({
        apiStatus: apiStatusContent.success,
        similar: updateSimilar,
        jobDetailsSkills: updateSkills,
        jobDetails: updateJobDetails,
      })
    } else {
      this.setState({apiStatus: apiStatusContent.failure})
    }
  }

  onLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={() => this.getSimilarJobs()}>
        Retry
      </button>
    </div>
  )

  renderJobDetails = () => {
    const {jobDetails, jobDetailsSkills, similar} = this.state
    const {
      detailTitle,
      detailCompanyLogoUrl,
      detailCompanyWebsiteUrl,
      detailEmploymentType,
      detailId,
      detailJobDescription,
      detailLocation,
      detailPackage,
      detailRating,
      lifeAtCompanyDescription,
      lifeAtCompanyImageUrl,
    } = jobDetails

    return (
      <>
        <div className={`job-details-card ${detailId}`}>
          <div className="company-head-card">
            <img
              src={detailCompanyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="company-header">
              <h1 className="company-title">{detailTitle}</h1>
              <p className="company-rating">
                <FaStar className="company-rating-icon" />
                {detailRating}
              </p>
            </div>
          </div>
          <div className="company-details-card">
            <div className="company-details">
              <p className="company-location-type">
                <MdLocationOn className="location-type-icon" />
                {detailLocation}
              </p>
              <p className="company-location-type">
                <BsBriefcaseFill className="location-type-icon" />
                {detailEmploymentType}
              </p>
            </div>
            <p className="company-package">{detailPackage}</p>
          </div>
          <hr className="separate" />
          <div className="description-visit">
            <h1 className="company-description-card">Description</h1>
            <a href={detailCompanyWebsiteUrl} className="visit-page">
              Visit <BiLinkExternal className="visit-icon" />
            </a>
          </div>
          <p className="company-description">{detailJobDescription}</p>

          <h1 className="company-title">Skills</h1>
          <ul className="skills-items">
            {jobDetailsSkills.map(each => (
              <SkillsList skillsList={each} key={each.skillsName} />
            ))}
          </ul>
          <h1 className="company-title">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="life-at-company-desc">{lifeAtCompanyDescription}</p>
            <img
              src={lifeAtCompanyImageUrl}
              alt="life at company"
              className="life-at-company-img"
            />
          </div>
        </div>
        <div className="similar-jobs-container">
          <h1 className="company-title">Similar Jobs</h1>
          <ul className="similar-jobs-card">
            {similar.map(each => (
              <SimilarJobsList similarJobsList={each} key={each.similarId} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  getCheckStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusContent.success:
        return this.renderJobDetails()
      case apiStatusContent.inProgress:
        return this.onLoading()
      case apiStatusContent.failure:
        return this.onFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-container">{this.getCheckStatus()}</div>
      </>
    )
  }
}

export default SimilarJobs
