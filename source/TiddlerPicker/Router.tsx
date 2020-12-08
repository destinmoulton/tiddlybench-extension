import React from "react";

type RouterState = {
    previousRoute: string;
    currentRoute: string;
};
class Router extends React.Component<{}, RouterState> {
    render() {
        switch (this.state.currentRoute) {
            default:
                return <div>No valid route.</div>;
        }
    }
}

export default Router;
