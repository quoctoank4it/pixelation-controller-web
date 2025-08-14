import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Reload page after error
    setTimeout(() => {
      window.location.reload();
    }, 0);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info here if needed
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, color: "red", background: "#fff0f0" }}>
          <h2>Something went wrong.</h2>
          {/* <pre>{this.state.error && this.state.error.toString()}</pre> */}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
