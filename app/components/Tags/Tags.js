import React, { PropTypes } from 'react/addons';
import {Link} from 'react-router';

import styles from './Tag.scss';
import withStyles from '../../decorators/withStyles.js';

@withStyles(styles)
class Tags {
  static propTypes = {
    tags: PropTypes.array.isRequired
  };

  render() {
    var tags = this.props.tags;
    var tagList = tags ? tags.map(function (tag) {
      return <Link className="tag dark-gray bg-darken-1 px1 ml1 rounded" to="tags-page" params={{tags: tag}} key={tag}>{tag}</Link>;
    }) : null;
    return (<span className="tags">
          {tagList}
    </span>);
  }
}

export default Tags;
