import './Dashboard.css'
import './../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function DashCard({ classname, title, value, recent, icons }) {
  return(
    <>
      <div className={`${classname} || ''`}>
        <div className="title">
          <FontAwesomeIcon icon={icons} className='icons'/>
          {title}
        </div>
        <div className="value">{value}</div>
        {/* change recent to progress bar */}
        <div className="recent">{recent}</div>
      </div>
    </>
  )
}
export default DashCard