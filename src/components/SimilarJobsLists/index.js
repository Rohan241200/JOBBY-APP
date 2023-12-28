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
      <div className="company-head-card">
        <img
          src={similarCompanyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div className="company-header">
          <h1 className="company-title">{similarTitle}</h1>
          <p className="company-rating">
            <FaStar className="company-rating-icon" />
            {similarRating}
          </p>
        </div>
      </div>
      <h1 className="company-title">Description</h1>
      <p className="company-description">{similarJobDescription}</p>
      <div className="company-details">
        <p className="company-location-type">
          <MdLocationOn className="location-type-icon" />
          {similarLocation}
        </p>
        <p className="company-location-type">
          <BsBriefcaseFill className="location-type-icon" />
          {similarEmploymentType}
        </p>
      </div>
    </li>
  )
}

export default SimilarJobsList
