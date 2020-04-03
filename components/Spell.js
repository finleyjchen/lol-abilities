import parse from 'html-react-parser'
export default class extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        // this.props.data.effectBurn["1"]
        var regex = /(\{\{.+?\}\})|\<span/
        const { tooltip, description, cooldownBurn, costBurn, name, isAdvanced, image, rangeBurn, effectBurn, vars } = this.props.data

        var split_string = tooltip.split(regex).filter(Boolean);
        var updatedTooltip = ""
        var varsKeys = []
        // first check for vars
        if(vars.length > 0) {
            for(var i in vars)
            varsKeys.push(i.key)
        }
        // then replace with values
        for(var i of split_string) {
            if (i.indexOf("{{") > -1) {
                //get key
                var key = i.substring(3,5)
                updatedTooltip = updatedTooltip + effectBurn[i]
            } 
            if (i.indexOf("color") > -1 ) {
                updatedTooltip = updatedTooltip + i.substring(i.indexOf("r")+1, i.indexOf("r") + 7)
            } else {
                updatedTooltip = updatedTooltip + i
            }
        }
        return(
            <li key={name} className="flex flex-wrap items-center border-t first:border-t-0 border-gray-600 p-1">
                <div className="w-full flex items-center justify-start pb-1">

                    <h3 className="text-base font-serif">{name}</h3>
                    <ul className="font-bold flex text-xs items-baseline justify-left">
                        <li className="px-2">
                            <small className="uppercase tracking-wider">Cooldown: </small><span className="">{cooldownBurn}</span>
                        </li>
                        <li className="px-2">
                            <small className="uppercase tracking-wider">Cost: </small><span className="">{costBurn}</span>
                        </li>
                        <li className="px-2">
                            <small className="uppercase tracking-wider">Range: </small><span className="">{rangeBurn}</span>
                        </li>
                    </ul>
                </div>
                <div className="w-1/12">
                    <img class="w-full" src={"/assets/10.6.1/img/spell/"+ image.full} alt={name} />
                </div>
                <ul className="w-11/12 p-1">
                    <li className="">

                    </li>
                    <li className={`text-xs tracking-tight ${this.props.isAdvanced ? "" : "hidden"}`}>{updatedTooltip}</li>
                    <li className={`text-xs tracking-tight ${this.props.isAdvanced ? "hidden" : ""}`}>{parse(description)}</li>
                </ul>
            </li>
        )
    }
}