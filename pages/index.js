import React from "react"
import Link from "next/link"
import Layout from '../components/Layout'
import Champion from '../components/Champion'
import useSWR from "swr"
import fetch from "node-fetch"
import axios from "axios"
// import '../css/tailwind.css'


class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      empty: false,
      isAdvanced: false,
      champion_ids: [],
      value: "",
      active_game: {},
      summoner_names: [],
      champion_data: [],
      patch: "",
      id: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleAdvanced = this.toggleAdvanced.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  toggleAdvanced() {
    this.setState({
      isAdvanced: !this.state.isAdvanced
    });
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
      const { loading, champion_ids, summoner_names, champion_data, value, error, isAdvanced } = this.state
      // const abilities = 
      // const abilityImg = (obj) => obj.spells.filter((spell) => (
      //   <img src={"/assets/10.6.1/img/spell" + spell.image.full} alt={spell.image.full} />
      // ))


      const championList = champion_data.map((obj, key) => (
        <Champion isAdvanced={isAdvanced} data={obj} summoner_name={summoner_names[key]}/>
      ))
    return (
      <div className="">
        <section className="max-w-lg mx-auto flex">

        <form className="" onSubmit={this.handleSubmit}>
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
        <button onClick={this.toggleAdvanced}>
        {isAdvanced ? 'Switch to simple mode' : 'Switch to advanced mode'}
      </button>
      </section>
      <section className="max-w-5xl mx-auto">

        { loading && <p>Loading...</p>}
        <div className="grid-cols-2 grid gap-2">

        { !loading && 
            championList
          }

          </div>
        { error && <p>Summoner is not currently in game</p>}
      </section>
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
      <Layout>
        <NameForm />
      </Layout>
      
    );
  }
}

export default Home;
