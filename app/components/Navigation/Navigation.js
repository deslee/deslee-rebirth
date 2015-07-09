import React from 'react/addons';
import {Link} from 'react-router';
import styles from './Navigation.scss';
import withStyles from '../../decorators/withStyles.js';


/*<li className="nav-item"><Link to="data" params={{id: 'projects'}}>Projects</Link></li>*/

@withStyles(styles)
class Navigation extends React.Component {
  render() {
    return (<ul className="navigation p0">
      <li className="nav-item"><Link to="index">Home</Link></li>
      <li className="nav-item"><Link to="data" params={{id: 'about'}}>About</Link></li>
    </ul>)
  }
}

export default Navigation;