import { h, render, Component } from 'preact';

export default class Rule extends Component {
  edit = e => {

  }

  delete = e => {

  }

  save = e => {
    
  }

  cancel = e =>  {
    
  }

  render({ rule }, { editing }) {
    return (
        <tr>
        <td><input type="text"/></td>
        <td>27</td>
        <td><input type="text" /></td>
        <td>
        <span>edit</span>
        <span>delete</span>
      </td>
        </tr>
    );
  }
}
