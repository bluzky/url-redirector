import { h, render, Component } from 'preact';

import RuleDb from './model.js';

export default class MappingTable extends Component {
  constructor() {
    super();
    this.db = new RuleDb('url-rules', () => this.setState({}) );
    this.state = {
      from: null,
      to: null
    };

    // this.bind();
  }

  addRule = (e) =>{
    if(this.state.from && this.state.to){
      this.db.create(this.state.from, this.state.to)
      this.setState({from: null, to: null
                    });

    }
  };


  edit(item){
    
  }

  update(item){

  }

  delete(item){
    
  }

  save(){
    if(this.state.from && this.state.to){
      this.db.create(this.state.from, this.state.to)
      this.setState({from: null, to: null
                    });

    }
  }


  handleChange = (e) => {
    if(e.target.name === 'from') {
      this.setState({from: e.target.value});
    } else if(e.target.name === 'to') {
      this.setState({to: e.target.value});
    }
  }

  render(props, {from, to}) {

    let {rules} = this.db;

    return (<table class="rule-table">
            <thead>
            <tr>
            <th>From</th>
            <th></th>
            <th>To</th>
            <th></th>
            </tr>
            </thead>
            <tbody>
            {
              rules.map(rule =>{
                  <tr>
                  <td><input type="text" disabled placeholder="matching pattern" name="from" value={rule.from} onChange={this.handleChange}/></td>
                  <td class="arrow"><i class="ti-angle-right"></i></td>
                  <td><input type="text" disabled placeholder="redirect to" name="to" value={rule.to} onChange={this.handleChange} /></td>
                  <td class="btn-group">
                  <button class="button-clear btn" onClick={this.addRule}><i class="ti-check"></i></button>
                  <button class="button-clear btn" onClick={this.addRule}><i class="ti-close"></i></button>
                  </td>
                  </tr>
              })
            }
            

            <tr>
            <td><input type="text" placeholder="matching pattern" name="from" value={from} onChange={this.handleChange}/></td>
            <td class="arrow"><i class="ti-angle-right"></i></td>
            <td><input type="text" placeholder="redirect to" name="to" value={to} onChange={this.handleChange} /></td>
            <td>
            <button class="button-clear btn" onClick={this.addRule}><i class="ti-save"></i></button>
            </td>
            </tr>
            </tbody>
            </table>
           );
  }

  bind() {
		this.binds = {};
		for (let i in this) {
      if(this[i] && this[i].constructor == Function){
			  this.binds[i] = this[i].bind(this);
      }
		}
	}
}
