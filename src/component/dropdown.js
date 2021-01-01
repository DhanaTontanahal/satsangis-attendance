import React, { useState } from "react";
import styled from "styled-components";

const DropDownContainer = styled("div")`
  width: 20em;
  margin: 0 auto;
  align: centre;
`;

const DropDownHeader = styled("div")`
  margin-bottom: 0.8em;
  padding: 0.4em 2em 0.4em 1em;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-weight: 200;
  font-size: 1.3rem;
  color: #000000;
  background: #DCDCDC;
`;

const DropDownListContainer = styled("div")``;

const DropDownList = styled("ul")`
  padding: 0;
  margin: 0;
  padding-left: 1em;
  background: #DCDCDC;
  border: 2px solid #000000;
  box-sizing: border-box;
  color: #000000;
  font-size: 1.3rem;
  font-weight: 200;
  &:first-child {
    padding-top: 0.8em;
  }
`;

const ListItem = styled("li")`
  list-style: none;
  margin-bottom: 0.8em;
`;

const options = ["Morning Satsang", "Evening Satsang"];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = (value) => () => {
    setSelectedOption(value);
    setIsOpen(false);
    console.log(selectedOption);
  };

  return (
    <DropDownContainer>
      <DropDownHeader onClick={toggling}>
        {selectedOption || "Event"}
      </DropDownHeader>
      {isOpen && (
        <DropDownListContainer>
          <DropDownList>
            {options.map((option) => (
              <ListItem onClick={onOptionClicked(option)} key={Math.random()}>
                {option}
              </ListItem>
            ))}
          </DropDownList>
        </DropDownListContainer>
      )}
    </DropDownContainer>
  );
}

// import React, { Component } from "react";
// import { DropdownMultiple, Dropdown } from "reactjs-dropdown-component";

// export default class dropdown extends Component {
//   state = {
//     location: [
//       {
//         id: 0,
//         title: "New York",
//         selected: false,
//         key: "location",
//       },
//       {
//         id: 1,
//         title: "Dublin",
//         selected: false,
//         key: "location",
//       },
//       {
//         id: 2,
//         title: "Istanbul",
//         selected: false,
//         key: "location",
//       },
//     ],
//     fruit: [
//       {
//         id: 0,
//         title: "Apple",
//         selected: false,
//         key: "fruit",
//       },
//       {
//         id: 1,
//         title: "Orange",
//         selected: false,
//         key: "fruit",
//       },
//       {
//         id: 2,
//         title: "Strawberry",
//         selected: false,
//         key: "fruit",
//       },
//     ],
//   };
//   toggleItem = (id, key) => {
//     const temp = JSON.parse(JSON.stringify(this.state[key]));

//     temp[id].selected = !temp[id].selected;

//     this.setState({
//       [key]: temp,
//     });
//   };
//   resetThenSet = (id, key) => {
//     const temp = JSON.parse(JSON.stringify(this.state[key]));

//     temp.forEach((item) => (item.selected = false));
//     temp[id].selected = true;

//     this.setState({
//       [key]: temp,
//     });
//   };
//   render() {
//     return (
//       <Dropdown
//         title="Select fruit"
//         list={this.state.fruit}
//         resetThenSet={this.resetThenSet}
//       />
//     );
//   }
// }
