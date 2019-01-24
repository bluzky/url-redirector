import { h, render, Component } from 'preact';

export default class MappingTable extends Component {
  constructor() {
    super();
    this.state = {
      from: null,
      to: null
    };
    this.handleChange = this.handleChange.bind(this);
  }

 
  addRule() {
    console.log("abc")
  };

  handleChange(e) {
    if(e.target.id === 'from') {
      this.setState({from: e.target.value});
    } else if(e.target.id === 'to') {
      this.setState({to: e.target.value});
    }
  };

  render(props, {from, to}) {
    return (<table>
            <thead>
            <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Height</th>
            <th>Location</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td>Stephen Curry</td>
            <td>27</td>
            <td>1,91</td>
            <td>Akron, OH</td>
            </tr>
            <tr>
            <td>Klay Thompson</td>
            <td>25</td>
            <td>2,01</td>
            <td>Los Angeles, CA</td>
            </tr>

            <tr>
            <td><input type="text" placeholder="matching pattern" value={from} onChange={this.handleChange}/></td>
            <td>></td>
            <td><input type="text" placeholder="redirect to" value={to} onChange={this.handleChange} /></td>
            <td>
            <span onClick={this.addRule}>save</span>
            </td>
            </tr>

            </tbody>
            </table>);
  }
}
