import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './loayout/Navbar';
import Home from './pages/Home';
function App() {
  return (
    <div className="App">
      <Navbar/>
      <Home/>
    </div>
  );
}

export default App;
