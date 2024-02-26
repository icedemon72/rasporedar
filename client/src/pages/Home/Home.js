import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    document.title = 'Rasporedar';
  })

  return (
    <div>Home</div>
  )
}

export default Home;