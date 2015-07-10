import React from 'react/addons';
import {Link} from 'react-router';
/*import styles from './Navigation.scss';
import withStyles from '../../decorators/withStyles.js';*/


/*<li className="nav-item"><Link to="data" params={{id: 'projects'}}>Projects</Link></li>*/
/*<li className="mx-auto fc-border-top border-bottom md-no-border md-fc-no-border"><Link className="block p1 md-p0 md-inline" to="data" params={{id: 'about'}}>About</Link></li>*/

/*@withStyles(styles)*/
class Navigation extends React.Component {
  render() {
    return (<nav><ul className="list-reset">
      <li className="mx-auto fc-border-top border-bottom md-no-border md-fc-no-border"><Link className="block p1 md-p0 md-inline" to="index">Home</Link></li>
    </ul></nav>)
  }
}

export default Navigation;