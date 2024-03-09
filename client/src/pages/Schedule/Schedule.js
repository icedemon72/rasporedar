import { useEffect } from 'react'

const Schedule = () => {

  useEffect(() => {
    document.title = 'Raspored | Rasporedar';
  }, []);
  return (
    <div>Schedule</div>
  )
}

export default Schedule;