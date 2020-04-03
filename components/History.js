import React from "react"

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [],
        }
    }
    componentDidMount() {
        if (localStorage.getItem("history") != null) {
            this.setState({
                history: 
            })
        }

    }
}