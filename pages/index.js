import React from "react"
import Link from "next/link"
import useSWR from "swr"
import fetch from "node-fetch"
import axios from "axios"

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      value: "",
      empty: false,
      champion_ids: [],
      active_game: {},
      champion_data: [],
      patch: "",
      id: "",
      error: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.stopPropagation();
    event.preventDefault();
    this.fetchData();
  }
  fetchData() {
    this.setState({ 
        loading: true,  
        champion_data: []
    }, () => {

    //   axios.get("/api/patch")
    //   .then(response => {
    //       this.setState({ patch: response.data }, () => {
    //           return response.data
    //       })
    //   })
      axios
        .get("/api/search", {
          params: {
            query: this.state.value,
            patch: this.state.patch,
            offset: this.state.page - 1
          }
        })
        .then(response => {
            const { active_game, champion_ids, } = response.data;
          this.setState({
            champion_ids: champion_ids,
            active_game: active_game,
          }, () => {
              var requests = []
              for(var id of this.state.champion_ids) {
                requests.push(axios.get("/api/champion/" + id))
              }
              axios.all(requests).then(axios.spread((...responses) => {
                  for(var key in responses) {
                      var name = Object.keys(responses[key].data)[0]
                      this.setState({
                          champion_data: this.state.champion_data.concat(responses[key].data[name]),
                          loading: false
                        })
                    }
              }))
          });
        })
        .catch(error => {
          this.setState({ loading: false, error: true});
        });
    });
  }

  render() {
      const { loading, champion_ids, champion_data, value, error } = this.state
      const championList = champion_data.map(obj => <li key={obj.name}>{obj.name}</li>)
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <ul>

        { loading && <p>Loading...</p>}
        { !loading && 
            championList
        }
        </ul>

        { error && <p>Summoner is not currently in game</p>}
      </div>
    );
  }
}
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <h1>League of Legends Champion Ability Viewer</h1>
        <p>Current DataDragon version:</p>
        <NameForm />
      </div>
    );
  }
}

export default Home;
