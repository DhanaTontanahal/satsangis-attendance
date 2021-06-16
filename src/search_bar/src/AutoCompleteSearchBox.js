import React, { Component } from 'react'
import styled from 'styled-components';
//import Chip from '@material-ui/core/Chip';
// import { makeStyles } from '@material-ui/core/styles';
import Chip from '../Chips'

const StyledNoSuggsDiv = styled.div`
    color: #999;
    padding: 0.5rem;
`;

const StyledContainer = styled.div`
 
 position: relative;

 input{
  width:100%;
  height:45px;
  border:0px solid black;
  border-radius: 0px;
  padding:0px 5px 0 10px;
  font-size: 0.75rem;
  background: #f6f6f6;
  margin:5px 5px 5px 5px;
}

 input:focus{
  outline: none !important;
}

 button{
  position:absolute;
  right:-5px;
  top:15px;
  border: none;
  background: none;
}
 img{
  border-style: none;
  vertical-align: middle;
}



`;
const StyledUl = styled.ul`

  border: 1px solid #999;
  border-top-width: 0;
  list-style: none;
  margin-top: 0;
  width:100%;
  overflow-y: auto;
  padding-left: 0;
  color:${props => props.fontColor};


li {
  padding: 0.5rem;
  list-style-type: none;
  list-style: none;
}

.suggestion-active,li:hover 
{
  cursor: pointer;
  font-weight: 700;
  background-color: aliceblue;
  border:0px solid gray;
  padding:4px 4px 4px 4px;
  margin:5px 5px 5px 5px;
  font-weight: bold;
  background-color: coral;


}

li:not(:last-of-type) {
  border-bottom: 1px solid #999;
}

`;


const defaultProps = {
    placeHolderSearchLabel:"Search",
    showSearchBtn:false,
    styles: {
        ulDiv:{
            color:"blue"
        },
        searchImage: {
            width: "24",
            height: "24",
            alt: "Search"
        },
        container: {
            width: "400px",
            margin: "0 auto"
        },
    }
}


class AutoCompleteSearchBox extends Component {
    constructor(props) {
        super(props)

        this.state = {
            filteredSuggestions: [],
            activeSuggestions: 0,
            showSuggestions: false,
            userInput: "",
            selectedUsers: []
        }

        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClick = this.onClick.bind(this);
        // this.onDelete = this.onDelete.bind(this);
    }


    onChange(e){
        // console.log(e)
        const { suggestions, primaryIndex } = this.props;
        const userSearchInput = e.target.value;

        const filteredSuggestions = suggestions.filter((suggestion) => {
            return (suggestion[primaryIndex].toLowerCase().indexOf(userSearchInput.toLowerCase()) > -1);
        });

        // console.log(filteredSuggestions);

        this.setState({
            filteredSuggestions: filteredSuggestions,
            activeSuggestions: 0,
            showSuggestions: true,
            userInput: userSearchInput
        })

    }

    onKeyDown(e) {

        const { activeSuggestions, filteredSuggestions } = this.state;

        if (e.keyCode === 13) {
            this.state.selectedUsers.push(filteredSuggestions[activeSuggestions])
            this.setState({
                showSuggestions: false,
                userInput: ""
            })

            this.props.onClick(this.state.selectedUsers);
        }
        //user has clicked down arrow
        else if (e.keyCode == 40) {

            if (activeSuggestions - 1 === filteredSuggestions.length) {
                return;
            }

            this.setState({ activeSuggestions: activeSuggestions + 1 });
        }
        //user has clicked up arrow
        else if (e.keyCode == 38) {
            if (activeSuggestions === 0) {
                return;
            }
            this.setState({ activeSuggestions: activeSuggestions - 1 });
        }



    }

    onClick(e) {
        if(this.state.selectedUsers.indexOf(this.state.filteredSuggestions[e.currentTarget.dataset.id]) === -1) {
            this.state.selectedUsers.push(this.state.filteredSuggestions[e.currentTarget.dataset.id])
        }
        // console.log('user input list')
        // console.log(this.state.selectedUsers)
        this.setState({
            userInput: ""
        })
        this.props.onClick(this.state.selectedUsers);
    }

    // onDelete(user) {
    //     const index = this.state.selectedUsers.indexOf(user);
    //     if (index > -1) {
    //         this.state.selectedUsers.splice(index, 1)
    //         // console.log('after delete')
    //         // console.log(this.state.selectedUsers)
    //         this.setState({
    //             userInput: ""
    //         })
    //       }
    //     this.props.onClick(this.state.selectedUsers);
    // }

    render() {

        const {
            state: {
                filteredSuggestions,
                activeSuggestions,
                showSuggestions,
                userInput
            }
        } = this;

        const { primaryIndex, secondaryIndex, tertiaryIndex, styles } = this.props;

        let autoCompleteSuggestions;

        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
                autoCompleteSuggestions = (
                    <StyledUl fontColor={styles.ulDiv.color}>
                        {
                            filteredSuggestions.map((suggestion, index) => {

                                let className;

                                if (index === activeSuggestions) {
                                    className = "suggestion-active";
                                }

                                return (
                                    <li
                                        className={className}
                                        key={index}
                                        onClick={this.onClick}
                                        data-id={index}
                                        >
                                        {suggestion[primaryIndex]}
                                        
                                        
                                        <br />
                                        <span>
                                            {
                                                this.props.showSecondarySearchCriterion ?
                                                    <small>{suggestion[secondaryIndex]}</small> :
                                                    null
                                            }
                                            {/* {
                                                this.props.showTertiarySearchCriterion ?
                                                    <small className={this.props.tertiarySearchClassName}>{suggestion[tertiaryIndex]}</small> :
                                                    null
                                            } */}
                                        </span>

                                    </li>
                                )
                            })

                        }
                    </StyledUl>
                )
            }
            else
            {
               
                    autoCompleteSuggestions = (
                        <StyledNoSuggsDiv>
                          <em>No suggestions, you're on your own!</em>
                        </StyledNoSuggsDiv>
                      );
                
            }
        }
        return (

            <div style={styles.container}>
                <StyledContainer>
                {/* <div>
                    {this.state.selectedUsers.map((user, index) => (
                        <Chip 
                            label={user.nameSatsangi}
                            onDelete={() => this.onDelete(user)}
                        />
                    ))}          
                    </div> */}
                    <input
                        placeholder={this.props.placeHolderSearchLabel}
                        type="text"
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown}
                        value={userInput}
                    />

                    
                </StyledContainer>
                {autoCompleteSuggestions}
            </div>
        )
    }
}

AutoCompleteSearchBox.defaultProps = defaultProps;
export default AutoCompleteSearchBox
