import React, { Component, Fragment } from "react";

class Autocomplete extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // The active selection's index
            activeSuggestion: 0,
            // The suggestions that match the user's input
            filteredSuggestions: props.suggestions,
            // Whether or not the suggestion list is shown
            showSuggestions: true,
            // What the user has entered
            userInput: props.inputVal
        };
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.youtubeSearch = this.youtubeSearch.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ filteredSuggestions: nextProps.suggestions })
    }

    async youtubeSearch() {
        
        if (this.state.userInput){
            try {
                const result = await fetch('/api/youtubeSearch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: localStorage.getItem('token'),
                        query: this.state.userInput
                    })
                }).then((res) => res.json())
                this.props.addSong(this.state.userInput.split(';'),result.videoId,result.duration);


            } catch (e) {
                console.log(e);
            }
        }else{
        }
    
    }

    onChange = e => {
        const { suggestions } = this.props;
        const userInput = e.currentTarget.value;
        this.props.updateSuggest(userInput);

        const filteredSuggestions = suggestions

        this.setState({
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: true,
            userInput: e.currentTarget.value
        });
    };

    onClick = e => {
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.currentTarget.innerText
        });
    };

    onKeyDown = e => {
        const { activeSuggestion, filteredSuggestions } = this.state;

        // User pressed the enter key
        if (e.keyCode === 13) {
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions[activeSuggestion]
            });


        }
        // User pressed the up arrow
        else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion - 1 });
        }
        // User pressed the down arrow
        else if (e.keyCode === 40) {
            if (activeSuggestion - 1 === filteredSuggestions.length) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion + 1 });
        }
    };

    render() {

        const {
            onChange,
            onClick,
            onKeyDown,
            state: {
                activeSuggestion,
                filteredSuggestions,
                showSuggestions,
                userInput
            }
        } = this;

        let suggestionsListComponent;

        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {

                suggestionsListComponent = (
                    <ul class="suggestions">
                        {filteredSuggestions.map((suggestion, index) => {
                            let className;

                            // Flag the active suggestion with a class
                            if (index === activeSuggestion) {
                                className = "suggestion-active";
                            }

                            return (
                                <li className={className} key={suggestion} onClick={onClick}>
                                    {suggestion}
                                </li>
                            );
                        })}
                    </ul>
                );
            } else {
                suggestionsListComponent = (
                    <div class="no-suggestions">
                        <em>No suggestions, you're on your own!</em>
                    </div>
                );
            }
        }

        return (
            <div id="autocomplete">
                <input
                    type="text"
                    placeholder='Add a Song!'
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={userInput}
                />
                <button onClick={() => this.youtubeSearch()}>Add Song</button>
                {suggestionsListComponent}
            </div>
        );
    }
}

export default Autocomplete;
