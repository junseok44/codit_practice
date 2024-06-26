// import React from "react";
// import { FallbackProps } from "react-error-boundary";

// interface ErrorBoundaryProps {
//   children: React.ReactNode;
//   fallbackComponent: React.ComponentType<FallbackProps>;
// }

// interface ErrorBoundaryState {
//   hasError: boolean;
// }

// class ErrorBoundary extends React.Component<
//   ErrorBoundaryProps,
//   ErrorBoundaryState
// > {
//   constructor(props: ErrorBoundaryProps) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(): ErrorBoundaryState {
//     return { hasError: true };
//   }

//   render(): React.ReactNode {
//     const { hasError } = this.state;
//     const { children, fallbackComponent: FallbackComponent } = this.props;

//     if (hasError) {
//       return <FallbackComponent />;
//     }

//     return children;
//   }
// }

// export default ErrorBoundary;
