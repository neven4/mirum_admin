import Context from './Context';
import React, {Component} from 'react';

class StateProvider extends Component {
    state = {
        editableCards: [],
        uploadedCards: []
    };

    updateState = (newState) => {
        this.setState({editableCards: newState})
    }

    updateUploadedCards = (newState) => {
        this.setState({uploadedCards: newState})
    }

    createNewCard = () => {
        const editState = [...this.state.editableCards]
        editState.push({
            addressCoord: [0, 0],
            addressName: "",
            likes: 0,
            mainText: "",
            metroName: "",
            smallText: "",
            title: "Untiteled",
            instagramLink: "",
            photos: []
        })

        this.setState({
            editableCards: editState
        })
    }

    removeCard = (index) => {
        const editState = [...this.state.editableCards]
        editState.splice(index, 1)

        this.setState({
            editableCards: editState
        })
    }

    render() {
        return (
            <Context.Provider
                value={{
                    state: this.state,
                    update: this.updateState,
                    createNew: this.createNewCard,
                    removeCard: this.removeCard,
                    updateUploadedCards: this.updateUploadedCards
                }}
            >
                {this.props.children}
            </Context.Provider>
        );
    }
}

export default StateProvider;