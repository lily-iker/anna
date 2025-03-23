import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage"
import { BrowserRouter } from 'react-router-dom'
import Loading from "./components/loading";


function App() {
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 0.5 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (<Loading/>);
  }

  return (
    <BrowserRouter>
      <HomePage/>
    </BrowserRouter>
  )
}

export default App
