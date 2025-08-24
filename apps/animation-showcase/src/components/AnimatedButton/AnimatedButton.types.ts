export interface AnimatedButtonProps {
    initialText?: React.ReactNode;
    successText?: React.ReactNode;
    loadingIcon?: React.ReactNode;
    successIcon?: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
}

export interface ButtonWrapperProps {
    $loading: boolean;
    $success: boolean;
    $showExpansion: boolean;
    $isClicked: boolean;
    $size: 'small' | 'medium' | 'large';
}

export interface TextProps {
    $hidden: boolean;
    $isSuccess?: boolean;
}

export interface IconWrapperProps {
    $isCheckmark?: boolean;
}

export const sizes = {
    small: {
        height: 38,
        fontSize: 14,
        minWidth: 120,
        collapsedWidth: 40,
        iconSize: 16,
        padding: '0 18px'
    },
    medium: {
        height: 45,
        fontSize: 16,
        minWidth: 160,
        collapsedWidth: 45,
        iconSize: 20,
        padding: '0 20px'
    },
    large: {
        height: 50,
        fontSize: 18,
        minWidth: 170,
        collapsedWidth: 53,
        iconSize: 24,
        padding: '0 22px'
    }
};