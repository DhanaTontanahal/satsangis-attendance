import React from 'react';
import search from './search.svg';
import './App.css';
import AutoCompleteSearchBox from './src/AutoCompleteSearchBox';
import {stocksData} from './data/stocks'

function App() {

  const symbols = stocksData.map((stockObj) =>{
    return stockObj["symbol"]
  });

  const onClick = (suggestion) =>{
    alert(suggestion["name"])
  }



  return (
    <div className="App">
      <AutoCompleteSearchBox
        placeHolderSearchLabel={"Search.."} 
        primaryIndex={"symbol"} 
        secondaryIndex={"name"}
        showSecondarySearchCriterion={true}
        secondarySearchClassName="secondarySearchClassName"
        tertiaryIndex={"price"}
        showTertiarySearchCriterion={true}
        tertiarySearchClassName="tertiarySearchClassName"
        suggestions={stocksData}
        onClick={onClick}
        showSearchBtn={true}
        searchImg={search}
        />
      
    </div>
  );
}

export default App;
