import React from 'react/addons';

class AsyncElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedComponent: null
    }
  }
  load() {
    if (this.state.loadedComponent) {
      return;
    }

    try {
      this.bundle(component => {
          this.setState({
            loadedComponent: component
          })
      });
    } catch (err) {
      console.log((err))
    }
  }
  componentDidMount() {
    this.load()
  }
  render() {
    var Component = this.state.loadedComponent;
    if (Component) {
      /*this.props.activeRoute = <RouteHandler/>*/
      return <Component {...this.props} />;
    }
    return this.preRender();
  }
  preRender() {
    return <div>Loading</div>;
  }
}

export default AsyncElement;