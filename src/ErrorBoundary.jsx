import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20 }}>
          <h2>Произошла ошибка в приложении</h2>
          <pre style={{ whiteSpace: "pre-wrap", color: "#900" }}>
            {String(this.state.error && this.state.error.toString())}
            {this.state.info && this.state.info.componentStack}
          </pre>
          <p>Откройте DevTools (Console) для подробностей.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
