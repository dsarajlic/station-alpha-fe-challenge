import React, { useState } from "react";
import { AnimatedButtonProps, sizes } from "./AnimatedButton.types";
import { ButtonWrapper, Text, IconWrapper } from "./AnimatedButton.styles";
import PlaneIcon from "./icons/PlaneIcon";
import TickIcon from "./icons/TickIcon";

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    initialText = "Book a flight",
    successText = "Flight booked",
    loadingIcon,
    successIcon,
    size = 'medium'
}) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showExpansion, setShowExpansion] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleClick = () => {
        if (loading || success) return;

        setIsClicked(true);

        const clickDuration = prefersReducedMotion ? 50 : 500;
        const loadingDuration = prefersReducedMotion ? 1000 : 2000;
        const expansionDelay = prefersReducedMotion ? 50 : 400;

        // Start loading after bounce animation completes
        setTimeout(() => {
            setIsClicked(false);
            setLoading(true);

            // Show loading icon for specified duration, then success
            setTimeout(() => {
                setLoading(false);
                setSuccess(true);

                // Start expansion after checkmark animation
                setTimeout(() => {
                    setShowExpansion(true);
                }, expansionDelay);

                // Optional: reset back after 3s
                setTimeout(() => {
                    setSuccess(false);
                    setShowExpansion(false);
                }, 4000);
            }, loadingDuration);
        }, clickDuration);
    };

    const renderIcon = () => {
        const iconSize = sizes[size].iconSize;

        if (success) {
            return (
                <IconWrapper $isCheckmark>
                    {successIcon || <TickIcon size={iconSize} />}
                </IconWrapper>
            );
        }
        return (
            <IconWrapper>
                {loadingIcon || <PlaneIcon size={iconSize} />}
            </IconWrapper>
        );
    };

    return (
        <ButtonWrapper
            onClick={handleClick}
            $loading={loading}
            $success={success}
            $showExpansion={showExpansion}
            $isClicked={isClicked}
            $size={size}
        >
            {renderIcon()}

            {/* Initial label */}
            <Text $hidden={loading || success}>{initialText}</Text>

            {/* Success */}
            <Text $hidden={!success || !showExpansion} $isSuccess={success && showExpansion}>
                {successText}
            </Text>
        </ButtonWrapper>
    );
};

export default AnimatedButton;