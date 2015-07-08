import React, { PropTypes } from 'react';
import {Link} from 'react-router';

class Tags {
  static propTypes = {
    tags: PropTypes.array.isRequired
  };

  render() {
    var tags = this.props.tags;
    var tagList = tags ? tags.map(function (tag) {
      return <Link to="tags-page" params={{tags: tag}} key={tag}>{tag}</Link>;
    }) : null;
    return (<span className="tags">
          {tagList}
    </span>);
  }
}

export default Tags;
