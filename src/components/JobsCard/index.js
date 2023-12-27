import {Component} from 'react'
import Cookies from 'js-cookie'
import JobsCardList from '../JobsCardList'
import './index.css'

const apiStatusContent = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class JobsCard extends Component {
  state = {apiStatus: apiStatusContent.initial, jobs: []}

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusContent.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch('https://apis.ccbp.in/jobs', option)
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

  render() {
    const {jobs} = this.state
    return (
      <ul className="jobsList-items">
        {jobs.map(each => (
          <JobsCardList jobsDetails={each} key={each.id} />
        ))}
      </ul>
    )
  }
}

export default JobsCard
