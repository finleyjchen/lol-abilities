import React from "react"
import Link from "next/link"
import useSWR from "swr"
import fetch from "node-fetch"
import axios from "axios"
// import '../css/tailwind.css'


class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      value: "",
      empty: false,
      champion_ids: [],
      active_game: {},
      summoner_names: [],
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
            const { active_game, champion_ids, summoner_names } = response.data;
          this.setState({
            champion_ids: champion_ids,
            active_game: active_game,
            summoner_names: summoner_names,
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
      const { loading, champion_ids, summoner_names, champion_data, value, error } = this.state
      // const abilities = 
      // const abilityImg = (obj) => obj.spells.filter((spell) => (
      //   <img src={"/assets/10.6.1/img/spell" + spell.image.full} alt={spell.image.full} />
      // ))


      const championList = champion_data.map((obj, key) => (
        <div key={obj.name}>
          <h3><small>{summoner_names[key]}</small>{obj.name}</h3>
          <img src={"/assets/10.6.1/img/champion/" + obj.image.full} alt={obj.id} className="champion-icon" />
          <img src={"/assets/10.6.1/img/passive/"+ obj.passive.image.full} alt={obj.passive.name} />
          <img src={"/assets/10.6.1/img/spell/"+ obj.spells[0].image.full} alt={obj.spells[0].name} />
          <img src={"/assets/10.6.1/img/spell/"+ obj.spells[1].image.full} alt={obj.spells[1].name} />
          <img src={"/assets/10.6.1/img/spell/"+ obj.spells[2].image.full} alt={obj.spells[2].name} />
          <img src={"/assets/10.6.1/img/spell/"+ obj.spells[3].image.full} alt={obj.spells[3].name} />
          {/* {abilityImg(obj)} */}

        </div>
      ))
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

        { loading && <p>Loading...</p>}
        { !loading && 
            championList
        }

        { error && <p>Summoner is not currently in game</p>}
      </div>
    );
  }
}

// export async function getStaticProps() {
//   // Call an external API endpoint to get posts.
//   const res = await axios.get("/api/patch")
//   const patch = await res.json()

//   // By returning { props: posts }, the Blog component
//   // will receive `posts` as a prop at build time
//   return {
//     props: {
//       patch,
//     },
//   }
// }

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
