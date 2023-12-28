import './index.css'

const SkillsList = props => {
  const {skillsList} = props
  const {skillsImageUrl, skillsName} = skillsList

  return (
    <li className="skills-lists" key={skillsName}>
      <img src={skillsImageUrl} alt={skillsName} className="skills-img" />
      <p className="skills-name">{skillsName}</p>
    </li>
  )
}

export default SkillsList
