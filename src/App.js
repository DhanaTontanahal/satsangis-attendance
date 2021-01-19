import logo from './logo.svg';
import './App.css';
import SearchBar from './search_bar/search';
import SignIn from './sign_in/sign_in';

function App() {
  
  return (
    <div className="App">
        <SignIn/>
    </div>
  );

  


  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <cohde>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
