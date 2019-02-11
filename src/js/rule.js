import { h, render, Component } from 'preact';

export default class Rule extends Component {
  constructor() {
    super();
    this.state.editing = false;
  }

  edit = e => {
    this.setState({editing: true});
  }

  delete = e => {

  }

  save = e => {
    
  }

  cancel = e =>  {
    this.setState({editing: false});
  }

  render({ rule }, { editing }) {

    var buttons, disabled = 'disabled';
    if(editing){
      buttons = (
        <div>
          <button class="button-clear btn" onClick={this.save}><i class="ti-check"></i></button>
          <button class="button-clear btn" onClick={this.cancel}><i class="ti-close"></i></button>
        </div>
      )
      disabled = '';
    }else{
      buttons = (
          <div>
          <button class="button-clear btn" onClick={this.edit}><i class="ti-pencil"></i></button>
          <button class="button-clear btn" onClick={this.delete}><i class="ti-trash"></i></button>
          </div>
      )
    }

    return (
        <tr>
        <td><input type="text" disabled={disabled} placeholder="matching pattern" name="from" value={rule.from} onChange={this.save}/></td>
        <td class="arrow"><i class="ti-angle-right"></i></td>
        <td><input type="text" disabled={disabled} placeholder="redirect to" name="to" value={rule.to} onChange={this.save} /></td>
        <td class="btn-group">
        {buttons}
        </td>
        </tr>
    );
  }
}
