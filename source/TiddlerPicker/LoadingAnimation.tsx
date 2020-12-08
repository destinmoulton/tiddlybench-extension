import React from "react";

type AnimationProps = {
    loadingText: string;
};

const LoadingAnimation: React.FunctionComponent<AnimationProps> = ({
    loadingText,
}) => {
    return (
        <div className="tb-loading-animation-wrapper">
            <div className="tb-loading-animation">
                <div className="tb-loading-ball1"></div>
                <div className="tb-loading-ball2"></div>
                <div className="tb-loading-ball3"></div>
            </div>
            <div className="tb-loading-text">{{ loadingText }}</div>
        </div>
    );
};

export default LoadingAnimation;
