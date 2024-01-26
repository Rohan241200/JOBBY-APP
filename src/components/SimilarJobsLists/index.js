import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobsList = props => {
  const {similarJobsList} = props
  const {
    id,
    similarCompanyLogoUrl,
    similarTitle,
    similarRating,
    similarJobDescription,
    similarLocation,
    similarEmploymentType,
  } = similarJobsList

  return (
    <li className="similar-jobs-lists" key={id}>
      <div className="similar-jobs-header">
        <img
          src={similarCompanyLogoUrl}
          alt="similar job company logo"
          className="similar-jobs-company-logo"
        />
        <div className="similar-job-company-header">
          <h1 className="similar-job-company-title">{similarTitle}</h1>
          <p className="similar-job-company-rating">
            <FaStar className="similar-job-company-rating-icon" />
            {similarRating}
          </p>
        </div>
      </div>
      <h1 className="similar-job-company-title">Description</h1>
      <p className="similar-job-company-description">{similarJobDescription}</p>
      <div className="similar-job-company-details-location-type">
        <p className="similar-job-company-location-type">
          <MdLocationOn className="similar-job-location-type-icon" />
          {similarLocation}
        </p>
        <p className="similar-job-company-location-type">
          <BsBriefcaseFill className="similar-job-location-type-icon" />
          {similarEmploymentType}
        </p>
      </div>
    </li>
  )
}

export default SimilarJobsList
