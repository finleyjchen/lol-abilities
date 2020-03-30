export default class extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <li className="flex items-center flex-wrap border-t first:border-t-0 border-gray-600 p-1">
                <h5 className="w-full">{this.props.data.name}</h5>
                <div className="w-1/12">
                    <img class="w-full" src={"/assets/10.6.1/img/passive/"+ this.props.data.image.full} alt={this.props.data.name} />
                </div>
                <span className="w-11/12 p-1">
                <p className="text-xs tracking-tight">{this.props.data.description}</p>
                </span>
            </li>
        )
    }
}