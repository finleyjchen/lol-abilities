import React from "react"
import Link from "next/link"
import Spell from "./Spell"
import Passive from "./Passive"
export default class extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
      const spells = this.props.data.spells.map((spell) => ( <Spell isAdvanced={this.props.isAdvanced} data={spell} />))
      const stats = this.props.data.stats
      const statHeaders = Object.keys(stats).map((key) => (<tr><th>{key}</th><td>{stats[key]}</td></tr>))
      return(

        <div key={this.props.data.name} className="flex flex-col p-1 border-solid border-2 border-gray-600 leading-tight">
            <div className="flex items-center pb-1">
              <img src={"/assets/10.6.1/img/champion/" + this.props.data.image.full} alt={this.props.data.id} className="w-10 h-10" />
              <span className="flex flex-col pl-2 font-bold"><small className="text-xs font-light">{this.props.summoner_name}</small>{this.props.data.name}</span>

              <table className={`text-xs tracking-tight ${this.props.isAdvanced ? "" : "hidden"}`}>
                <tbody>
                {statHeaders}
                </tbody>
              </table>
             </div>
            <div className="">
              <ul className="flex flex-col">
                <Passive data={this.props.data.passive}/>
              {spells}
              </ul>
            {/* {abilityImg(obj)} */}
            </div>
  
          </div>
        )
      }
}