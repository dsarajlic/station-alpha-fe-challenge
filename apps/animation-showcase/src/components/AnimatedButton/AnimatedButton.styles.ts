import styled, { css, keyframes } from "styled-components";
import { ButtonWrapperProps, TextProps, IconWrapperProps, sizes } from "./AnimatedButton.types";

export const clickBounce = keyframes`
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.95);
  }
  75% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
`;

export const checkmarkAppear = keyframes`
  0% {
    opacity: 0;
    transform: scale(0) rotate(-45deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
`;

export const expandButton = keyframes`
  0% {
    min-width: 50px;
    width: 50px;
    padding: 0;
  }
  100% {
    min-width: var(--target-width);
    width: auto;
    padding: var(--target-padding);
  }
`;

export const textSlideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const ButtonWrapper = styled.button<ButtonWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: ${({ $size }) => sizes[$size].fontSize}px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  position: relative;
  overflow: hidden;
  height: ${({ $size }) => sizes[$size].height}px;
  padding: ${({ $size }) => sizes[$size].padding};
  min-width: ${({ $size }) => sizes[$size].minWidth}px;
  box-shadow: 0 4px 6px rgb(37 99 235 / 41%);
  transition: all 0.4s ease;
  --target-width: ${({ $size }) => sizes[$size].minWidth}px;
  --target-padding: ${({ $size }) => sizes[$size].padding};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none !important;
    
    * {
      animation: none !important;
      transition: none !important;
    }
  }

  ${({ $isClicked }) =>
        $isClicked &&
        css`
      animation: ${clickBounce} 0.5s ease-out;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
        transform: scale(0.98);
      }
    `}

  ${({ $loading, $success, $size }) =>
        $loading &&
        !$success &&
        css`
      min-width: ${sizes[$size].collapsedWidth}px;
      width: ${sizes[$size].collapsedWidth - 10}px;
      padding: 0;
      border-radius: 50%;
      gap: 0;

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    `}

  ${({ $success, $showExpansion, $size }) =>
        $success &&
        !$showExpansion &&
        css`
      min-width: ${sizes[$size].collapsedWidth}px;
      width: ${sizes[$size].collapsedWidth}px;
      padding: 0;
      border-radius: 50%;
      gap: 0;

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    `}

  ${({ $success, $showExpansion }) =>
        $success &&
        $showExpansion &&
        css`
      animation: ${expandButton} 0.6s ease-out forwards;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
        min-width: var(--target-width);
        width: auto;
        padding: var(--target-padding);
      }
    `}
`;

export const Text = styled.span<TextProps>`
  white-space: nowrap;
  
  ${({ $hidden }) =>
        $hidden &&
        css`
      display: none;
    `}

    ${({ $hidden }) =>
        !$hidden &&
        css`
      opacity: 1;
      transition: opacity 0.3s ease;

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    `}
  
  ${({ $isSuccess }) =>
        $isSuccess &&
        css`
      animation: ${textSlideIn} 0.4s ease-out 0.2s both;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
        opacity: 1;
        transform: none;
      }
    `}
`;

export const IconWrapper = styled.div<IconWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${({ $isCheckmark }) =>
        $isCheckmark &&
        css`
      animation: ${checkmarkAppear} 0.5s ease-out both;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    `}
`;