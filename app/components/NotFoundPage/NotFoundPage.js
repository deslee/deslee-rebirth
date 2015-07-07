import React from 'react/addons';

class NotFoundPage extends React.Component {
  componentWillMount() {
    if (this.props.callbacks && this.props.callbacks.onPageNotFound) {
      this.props.callbacks.onPageNotFound()
    }
  }
  render() {
    return <p className="NotFoundPage">NotFoundPage</p>
  }
}

export default NotFoundPage;