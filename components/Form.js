import Champion from '../components/Champion'
import fetch from "node-fetch"
import axios from "axios"
import Cookies from "js-cookie"
export default class extends React.Component {
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
        history: [],
        show_history: false,
        id: "",
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.toggleAdvanced = this.toggleAdvanced.bind(this);
      this.fetchData = this.fetchData.bind(this);
      this.updateHistory = this.updateHistory.bind(this);
      this.showHistory = this.showHistory.bind(this);
    }
  
    componentDidMount() {
      if (localStorage.getItem("history") != null) {
        this.setState({
            history: localStorage.getItem("history").split("|")
        })
    }
  
    }
  
  
    toggleAdvanced(event) {
      event.stopPropagation();
      event.preventDefault();
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
  
    showHistory(event) {
      event.stopPropagation();
      event.preventDefault();
      this.setState({
        show_history: !this.state.show_history
      })
    }
  
    updateHistory(query) {
      var history = localStorage.getItem("history")
      if (history != null) {
        // Setting limit at 5. To do
        // if (history.split("|").length > 5) {
        //   var limit = history
        //   limit.split("|").shift()
        //   localStorage.setItem("history", limit.toString() + "|" + query)
        // }
        localStorage.setItem("history", history + "|" + query)
      } else {
        localStorage.setItem("history", query)
      }
      this.setState({
        history: localStorage.getItem("history").split("|"),
        value: query
      })
    }
    
    clearHistory() {
      localStorage.removeItem("history")
      this.setState( {
        history: []
      })
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
              this.updateHistory(this.state.value)
  
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
        const { loading, champion_ids, summoner_names, champion_data, value, error, isAdvanced, history, show_history } = this.state
        // const abilities = 
        // const abilityImg = (obj) => obj.spells.filter((spell) => (
        //   <img src={"/assets/10.6.1/img/spell" + spell.image.full} alt={spell.image.full} />
        // ))
  
          // const historyList = history.map((query) => (
          //   <a onClick={ this.setState({
          //     value: query
          //   }, () => {
          //     this.fetchData()
          //   })}>query</a> 
          //   ))

        const uniqueHistory = [...new Set(history)];
          const historyList = uniqueHistory.map((query) => (
            <a href="#" className="p-1 m-1 bg-lol" onClick={() => {
              this.updateHistory(query)
              this.fetchData()
            }} >{query}</a>
          ))
          const championList = champion_data.map((obj, key) => (
          <Champion key={key} isAdvanced={isAdvanced} data={obj} summoner_name={summoner_names[key]}/>
        ))
      return (
        <div >
          <div className="bg-cover bg-center bg-image h-64"></div>
          <section className=" -mt-16 p-4 bg-white max-w-lg mx-auto flex flex-wrap">
          <form className="w-full justify-center" onSubmit={this.handleSubmit}>
            <div className="flex">
  
              <input
                type="text"
                value={this.state.value}
                onChange={this.handleChange}
                className="w-full p-1 border"
                placeholder="Enter active game summoner name..."
                // onBlur={this.showHistory}
                // onFocus={this.showHistory}
                />
            <input type="submit" value="Submit"  />
                </div>
                <div className={"p-1 flex w-full justify-center flex-wrap" }>
          {historyList}
                </div>
                <button className="p-1 border w-full block" onClick={this.toggleAdvanced}>
          {isAdvanced ? 'Switch to simple mode' : 'Switch to advanced mode'}
        </button>
          </form>
  
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