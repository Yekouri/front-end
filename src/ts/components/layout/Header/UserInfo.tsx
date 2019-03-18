import React from "react";
import { Link } from "react-router-dom";

import { getSVG } from "src/assets/svg";
import { colors, easings, routes } from "src/ts/config";
import { ProducerModel } from "src/ts/models/ProducerModel";
import { UserModel } from "src/ts/models/UserModel";
import { injectStore } from "src/ts/store/injectStore";
import { Chevron } from "../../utils";
import { Dropdown } from "../../utils/Dropdown/Dropdown";

import userInfoLabels from "src/assets/data/userInfo.json";


/**
 * Specification of props required to render <UserInfo />.
 */
type UserInfoProps = {
    /**
     * A reference to the user model describing the currently signed in user.
     */
    user: UserModel;
};

/**
 * Specification of lifecycle state of <UserInfo />.
 */
type UserInfoState = {
    /**
     * Specifies if the profile dropdown should currently be shown.
     */
    showDropdown?: boolean;

    /**
     * Specifies if the userInfo is recognized as in a small state or not at the
     * moment
     */
    isMobile: boolean;
};

/**
 * Component responsible for rendering information related to information about
 * the user
 */
export class UserInfoUnwrapped extends React.PureComponent<UserInfoProps, UserInfoState> {
    /**
     * Set up initial state, so this.state can be safely accessed.
     */
    public readonly state: UserInfoState = {
        isMobile: true,
    };

    /**
     * Will contain a reference to the user name wrapper, so that we can make
     * the dropdown point towards it properly.
     */
    protected readonly wrapperRef: React.RefObject<HTMLDivElement> = React.createRef();

    /**
     * Bind event listener to keep track of screen dimensions
     */
    public componentDidMount(): void {
        this.onResize();
        window.addEventListener("resize", this.onResize);
        window.addEventListener("orientationchange", this.onResize);
    }

    /**
     * Cleanup on unmount
     */
    public componentWillUnMount(): void {
        window.removeEventListener("resize", this.onResize);
        window.removeEventListener("orientationchange", this.onResize);
    }

    /**
     * Primary render method.
     */
    public render(): JSX.Element | undefined {
        return (
            <div
                className={`${ this.state.showDropdown ? "active" : "" } ${ this.props.user ? "hasUser" : "noUser"}`}
                ref={ this.wrapperRef }
                onClick={ this.onUsernameClick }
                role="button"
            >
                <i className="icon">{ getSVG("user", { strokeColor: colors.whiteSmoke }) }</i>
                { !this.props.user && (
                    <>
                        <span className="loginButton">
                            <Link to={routes.login.path}>
                                { userInfoLabels.logIn }
                            </Link>
                            <span className="underline" />
                        </span>
                        <span className="loginButton">
                            <Link to={routes.register.path}>
                                { userInfoLabels.register }
                            </Link>
                            <span className="underline" />
                        </span>
                    </>
                )}
                { this.props.user && (
                    <>
                        <span className="name">{ this.props.user.firstName } { this.props.user.surName }</span>
                        <span className="chevron">
                            <Chevron
                                vertical
                                size={10}
                                inverseDuration={200}
                                inversed={this.state.showDropdown}
                            />
                        </span>

                        { this.state.isMobile && this.renderInformation() }
                        { !this.state.isMobile && this.renderDropdown() }
                        <span className="underline" />

                    </>
                )}

                <style jsx>{`
                    div {
                        /** Position unserinfo to the right */
                        position: absolute;
                        right: 10px;
                        top: 0;

                        /** Position children properly */
                        height: 60px;
                        display: flex;
                        align-items: center;

                        /** Indicate that the element is clickable */
                        cursor: pointer;

                        & .loginButton :global(> a),
                        & .name {
                            /** Override defaults for link */
                            color: ${ colors.whiteSmoke };
                            text-decoration: none;

                            /** Prepare transitions */
                            transition: color 0.1s linear;
                        }

                        & .chevron {
                            border-color: ${ colors.whiteSmoke };
                        }

                        /** Prepare hover effect */
                        &.hasUser:hover .underline::before {
                            right: 0;
                            opacity: 1;
                        }

                        &.hasUser:hover .underline::after {
                            left: 0;
                            opacity: 1;
                        }
                    }

                    .loginButton {
                        position: relative;
                        margin-left: 10px;
                        cursor: pointer;

                        & .underline {
                            bottom: -5px;
                        }

                        /** Prepare hover effect */
                        &:hover > .underline::before {
                            right: 0;
                            opacity: 1;
                        }

                        &:hover > .underline::after {
                            left: 0;
                            opacity: 1;
                        }
                    }

                    .icon {
                        /** Set up sizing of the icon */
                        display: inline-block;
                        height: 22px;
                        width: 24px;
                    }

                    .chevron {
                        /**
                         * Ensure that the wrapper is position to the right
                         * of the button and that the chevron will be contained
                         * within
                         */
                        position: relative;
                        display: inline-block;

                        /** Render chevron properly */
                        width: 14px;
                        height: 30px;
                        border-color: #8f8f8f;

                        /** Setup space between chevron and text */
                        margin-left: 10px;
                    }

                    /**
                     * Render an underline that will be displayed when hovering
                     * the div by expanding form the middle out
                     */
                    .underline {
                        /** Position below the userInfo itself */
                        position: absolute;
                        bottom: 15px;
                        left: 0;
                        right: 0;
                        height: 1px;

                        /** Render the lines that will expand on hover */
                        &::before,
                        &::after {
                            /** Force rendering */
                            content: "";
                            position: absolute;

                            /** Render the lines */
                            height: 100%;
                            background-color: ${ colors.whiteSmoke };
                        }

                        &::before {
                            /** Position line in the middle by default */
                            left: 50%;
                            right: 50%;
                            opacity: 0;

                            /** Prepare transitions */
                            transition: right 0.15s ${ easings.inOutQuart }, opacity 0.1s linear;
                        }

                        &::after {
                            /** Position line in the middle by default */
                            right: 50%;
                            left: 50%;
                            opacity: 0;

                            /** Prepare transitions */
                            transition: left 0.15s ${ easings.inOutQuart }, opacity 0.1s linear;
                        }
                    }

                    @media (max-width: 768px) {
                        div {
                            /** Force all elements to fall below the header itself */
                            position: relative;

                            /** Override normal styles and display content below each other */
                            display: inline-flex;
                            flex-direction: column;
                            right: unset;
                            top: unset;
                            height: unset;

                            /**
                             * Render a separator between userInfo and other
                             * navigation
                             */
                            border-top: 1px solid ${ colors.whiteSmoke };
                            padding-top: 10px;
                            margin-top: 10px;

                            /** Render userName larger than reset */
                            font-size: 18px;

                            /** User isn't clickable */
                            cursor: default;

                            /**
                             * Required to be able to calculate dimensions when
                             * toggling
                             */
                            flex-shrink: 0;

                            /**
                             * Hide items related to dropdown which isn't used
                             * in mobile mode
                             */
                            & .underline,
                            & .chevron {
                                display: none;
                            }

                            &.noUser {
                                padding-bottom: 10px;
                            }

                            &.hasUser .icon {
                                height: 30px;
                            }
                        }

                        .loginButton {
                            margin-left: 0;
                            margin-top: 10px;
                            font-size: 14px;
                        }
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Renders the dropdown that'll become visible when the user clicks his own
     * profile name.
     */
    protected renderDropdown(): JSX.Element {
        return (
            <Dropdown
                active={ this.state.showDropdown }
                pointAt={ this.wrapperRef }
                onClose={ this.onDropdownClose }
            >
                <div className="wrapper">
                    { this.renderInformation() }
                </div>

                <style jsx>{`
                    .wrapper {
                        /** Apply internal padding */
                        padding: 20px 0 10px;

                        /**
                         * Enforce a minimum width on the userInfo making sure
                         * that it always renders nicely
                         */
                        min-width: 175px;

                        /** By default element isn't clickable */
                        cursor: default;
                    }
                `}</style>
            </Dropdown>
        );
    }

    /**
     * Internal helper that renders all information related to the user
     */
    protected renderInformation(): JSX.Element {
        return (
            <React.Fragment>
                { this.renderUserData() }

                <span className="link">
                    <Link to={routes.login.path}>
                        <i className="logIn">{ getSVG("log_in")}</i>
                        { userInfoLabels.profile }
                    </Link>
                </span>
                <span className="link">
                    <Link to={routes.login.path}>
                        <i className="edit">{ getSVG("edit") }</i>
                        { userInfoLabels.edit }
                    </Link>
                </span>
                <button onClick={ this.signOut } role="button">
                    <i>{ getSVG("log_out") }</i>
                    { userInfoLabels.logOut }
                </button>

                <style jsx>{`
                    button,
                    .link {
                        /** Override defaults */
                        background: none;
                        -webkit-appearance: none;
                        border: none;

                        /** Center items within vertically */
                        display: flex;
                        align-items: center;

                        /** Allow button to fill the whole dropdown */
                        width: 100%;

                        /**
                         * Set up basic padding around the element (the 6px top
                         * padding is applied to take into account that the icon
                         * will push text further down, and we want the white-
                         * space to visually align with the text instead of the
                         * icon).
                         */
                        padding: 10px 20px;
                        margin: 0;

                        /**
                         * Indicate that items are clickable
                         */
                        cursor: pointer;

                        /** Prevent line-breaks within the label */
                        white-space: nowrap;

                        /** Set up text styling */
                        font-size: 12px;
                        color: ${ colors.black };
                        line-height: 1em;
                        text-decoration: none;

                        /** Prepare hover transition */
                        transition:
                            background-color 0.1s linear,
                            color 0.1s linear;

                        & i {
                            /** Set up icon sizing */
                            display: inline-block;
                            width: 22px;
                            height: 22px;

                            /** Apply margin between icon and text */
                            margin-right: 10px;

                            & > :global(.svgIcon) > :global(svg) > :global(path) {
                                /** Apply default font color */
                                stroke: ${ colors.black };
                            }
                        }

                        /** Apply highlight color on hover */
                        &:hover {
                            background-color: rgba(69, 50, 102, 0.1);
                            color: ${ colors.primary };

                            & i > :global(.svgIcon) > :global(svg) > :global(path) {
                                stroke: ${ colors.primary };
                            }
                        }
                    }

                    .link {
                        /**
                         * Override width on items in dropdown to ensure they take
                         * padding into account when achieving width of 100%
                         */
                        width: calc(100% - 40px);

                        & :global(> a) {
                            /** Align icon and text within icon properly */
                            display: flex;
                            align-items: center;

                            /** Override default colors */
                            color: ${ colors.black };
                            text-decoration: none;
                        }

                        & .edit {
                            height: 23px;
                            width: 23px;
                        }
                    }

                    @media (max-width: 768px) {
                        /** Force white colors, on mobile the background will be dark */
                        button,
                        .link :global(> a) {
                            color: ${ colors.whiteSmoke } !important;
                        }

                        i > :global(.svgIcon) > :global(svg) > :global(path) {
                            stroke: ${ colors.whiteSmoke } !important;
                        }

                        i {
                            /** We slightly shrink icons as well to fit better */
                            transform: scale(0.75);
                        }
                    }
                `}</style>
            </React.Fragment>
        );
    }

    /**
     * Renderer that'll inject data about the currently signed in user, so that
     * it's available in the dropdown.
     */
    protected renderUserData(): JSX.Element {
        const { user } = this.props;

        return (
            <div className="user">
                <b>{ user.firstName } { user.surName }</b><br />
                { this.renderUserType() }

                <style jsx>{`
                    .user {
                        /** Apply required margins */
                        padding: 0 20px calc(20px - 0.15em);
                        margin: -0.15em 0 10px;

                        /** Add separator */
                        border-bottom: 1px solid ${ colors.whiteSmoke };

                        /** Adjust line-height */
                        line-height: 1.3em;

                        /** Disable text-selection */
                        user-select: none;
                    }

                    @media (max-width: 768px) {
                        .user {
                            color: ${ colors.whiteSmoke };
                            font-size: 14px;
                            margin-top: 5px;

                            & b,
                            & br {
                                display: none;
                            }
                        }
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Renderer that'll inject the user's type into the DOM (this is used, if we
     * were unable to identify the user's institution assoication).
     */
    protected renderUserType(): React.ReactNode {
        // ... Otherwise return label based on user type
        if (this.props.user instanceof ProducerModel) {
            return "Producer";
        } else {
            return "Reciever";
        }
    }

    /**
     * Method that'll be executed once the user wishes to log out in order to
     * process the functionality required to achieve this.
     */
    protected signOut = () => {
        alert("You cannot logout :-))))))");
    }

    /**
     * Listener that's triggered when the user clicks the user info component,
     * and prompts opening of the dropdown.
     */
    protected onUsernameClick = () => {
        if (this.props.user) {
            this.setState({ showDropdown: true });
        }
    }

    /**
     * Listener that's triggered when the user somehow prompts for the user
     * dropdown to be closed.
     */
    protected onDropdownClose = () => {
        this.setState({ showDropdown: false });
    }

    /**
     * Internal listeners that'll get triggered every time the screen is resized
     * in order to keep track of the currently active breakpoint
     */
    protected onResize = () => {
        if (window.innerWidth > 768 && this.state.isMobile) {
            this.setState({
                showDropdown: false,
                isMobile: false,
            });
        } else if (window.innerWidth <= 768 && !this.state.isMobile) {
            this.setState({
                showDropdown: false,
                isMobile: true,
            });
        }
    }
}

// tslint:disable-next-line variable-name
export const UserInfo = injectStore((store) => ({ user: store.user }), UserInfoUnwrapped);