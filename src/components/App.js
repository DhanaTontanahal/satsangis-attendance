// import logo from '../logo.svg';
import '../styles.css';
// import SearchBar from './search_bar/search';
import TabPage from './search_bar/TabPage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          Satsangis_Attendance: 'Satsangis Attendance',
          Choose_date: 'Date',
          Choose_event: 'Choose Event',
          Choose_user: 'Enter Names',
          Submit_Attendance: 'Submit Attendance',
          submit_message: 'Ra-dha-sva-Aa-mi \nYour request is submitted!',
          Choose_Year_of_Birth: 'Choose Year of Birth',
          Choose_UID: 'Choose UID',
          Login: 'Login',
          Radhasoami: 'Ra-dha-sva-Aa-mi',
          Choose_day_time: 'Choose Daytime',
          Total_attendees: 'Total attendees',
          Example: 'Example',
          no_internet_connection: 'No internet connection',
          Logout: 'Logout',
          Scan: 'Scan QR Code / Barcode',
        },
      },
      hi: {
        translation: {
          Satsangis_Attendance: 'सत्संगियों की उपस्थिति',
          Choose_date: 'तिथि',
          Choose_event: 'ईवेंट चुनें',
          Choose_user: 'सत्संगियों का नाम चुनें',
          Submit_Attendance: 'उपस्थिति दर्ज करें',
          submit_message: 'राधास्वामी \nआपकी attendance लग गई है।',
          Choose_Year_of_Birth: 'जन्म का वर्ष चुनें',
          Choose_UID: 'UID चुनें',
          Login: 'लॉग इन करें',
          Radhasoami: 'राधास्वामी',
          Choose_day_time: 'दिन का समय चुनें',
          Total_attendees: 'कुल उपस्थित सत्संगी',
          Example: 'उदाहरण',
          no_internet_connection: 'कोई इंटरनेट कनेक्शन नहीं',
          Logout: 'लॉग आउट',
          Scan: 'स्कैन क्यूआर कोड / बारकोड',
        },
      },
    },
    lng: 'en',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  });

function App() {
  const l = localStorage.getItem('currentLanguage');
  i18n.changeLanguage(l);
  return (
    <div className="App">
      <TabPage />
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
