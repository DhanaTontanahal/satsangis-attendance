import logo from './logo.svg';
import './App.css';
import SearchBar from './search_bar/search';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          "Satsangis_Attendance": "Satsangis Attendance",
          "Choose_date":"Choose date",
          "Choose_event":"Choose Event",
          "Choose_user":"Choose User",
          "Submit_Attendance":"Submit Attendance",
          "submit_message":"Radhasoami, Your attendance is marked!"
        }
      },
      hi: {
        translation: {
          "Satsangis_Attendance": "सत्संगियों की उपस्थिति",
          "Choose_date":"तिथि चुनें",
          "Choose_event":"ईवेंट चुनें",
          "Choose_user":"सत्संगियों का नाम चुनें",
          "Submit_Attendance":"उपस्थिति दर्ज करें",
          "submit_message":"राधास्वामी, आपकी attendance लग गई है।"
        }
      }
    },
    lng: "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false
    }
  });



function App() {
  const l = localStorage.getItem("currentLanguage")
  i18n.changeLanguage(l)
  return (
    <div className="App">
        <SearchBar/>
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