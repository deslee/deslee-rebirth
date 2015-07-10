import React, { PropTypes } from 'react/addons';
import {Link} from 'react-router';

/*import styles from './Tag.scss';
import withStyles from '../../decorators/withStyles.js';

@withStyles(styles)*/
class Tags {
  static propTypes = {
    tags: PropTypes.array.isRequired
  };

  render() {
    var tags = this.props.tags;
    var tagList = tags ? tags.map(function (tag) {
      return <li className="inline" key={tag}><Link className="tag silver navy bg-darken-1 px1 mr1 rounded" to="tags-page" params={{tags: tag}}>{tag}</Link></li>;
    }) : null;
    return (<ul className="tags p0 inline">
          {tagList}
    </ul>);
  }
}

export default Tags;
