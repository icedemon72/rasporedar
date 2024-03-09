import { useEffect } from 'react'

const Schedules = () => {
  useEffect(() => {
    document.title = 'Rasporedi | Rasporedar';
  }, []);
  return (
    <div>Schedules</div>
  )
}

export default Schedules;