import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobsCardList = props => {
  const {jobsDetails} = props
  const {
    id,
    title,
    location,
    rating,
    companyLogoUrl,
    employmentType,
    jobDescription,
    annualPackage,
  } = jobsDetails

  return (
    <Link to={`/jobs/${id}`} className="job-links">
      <li className="job-lists">
        <div className="company-head-card">
          <img src={companyLogoUrl} alt={title} className="company-logo" />
          <div className="company-header">
            <p className="company-title">{title}</p>
            <p className="company-rating">
              <FaStar className="company-rating-icon" />
              {rating}
            </p>
          </div>
        </div>
        <div className="company-details-card">
          <div className="company-details">
            <p className="company-location-type">
              <MdLocationOn className="location-type-icon" />
              {location}
            </p>
            <p className="company-location-type">
              <BsBriefcaseFill className="location-type-icon" />
              {employmentType}
            </p>
          </div>
          <p className="company-package">{annualPackage}</p>
        </div>
        <br className="separate" />
        <p className="company-description-card">Description</p>
        <p className="company-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobsCardList
