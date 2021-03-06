import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Platform from 'Platform';
import HTML from '../../utils/html-helper';
import Icon from '../../components/icon';
import Lang from '../../lang';
import User from '../../core/profile/user';
import {UserListItem} from '../common/user-list-item';
import replaceViews from '../replace-views';

/**
 * SwapUser 组件 ，显示切换用户界面
 * @class SwapUser
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example @lang jsx
 * import SwapUser from './swap-user';
 * <SwapUser />
 */
export default class SwapUser extends Component {
    /**
     * 获取 SwapUser 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<SwapUser>}
     * @readonly
     * @static
     * @memberof SwapUser
     * @example <caption>可替换组件类调用方式</caption> @lang jsx
     * import {SwapUser} from './swap-user';
     * <SwapUser />
     */
    static get SwapUser() {
        return replaceViews('login/swap-user', SwapUser);
    }

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof SwapUser
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
        identify: PropTypes.string,
        onSelectUser: PropTypes.func,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof SwapUser
     * @static
     */
    static defaultProps = {
        className: null,
        identify: null,
        onSelectUser: null,
    };

    /**
     * React 组件构造函数，创建一个 SwapUser 组件实例，会在装配之前被调用。
     * @see https://react.docschina.org/docs/react-component.html#constructor
     * @param {Object?} props 组件属性对象
     * @constructor
     */
    constructor(props) {
        super(props);

        /**
         * React 组件状态对象
         * @see https://react.docschina.org/docs/state-and-lifecycle.html
         * @type {object}
         */
        this.state = {
            hover: ''
        };
    }

    /**
     * 处理鼠标进入事件
     * @param {string} identify 用户标识
     * @memberof SwapUser
     * @private
     * @return {void}
     */
    handleMouseEnter(identify) {
        this.setState({hover: identify});
    }

    /**
     * 处理鼠标离开事件
     * @memberof SwapUser
     * @private
     * @return {void}
     */
    handleMouseLeave = () => {
        this.setState({hover: ''});
    }

    /**
     * 处理点击删除按钮事件
     * @param {Object} user 删除的用户
     * @param {Event} e 事件对象
     * @memberof SwapUser
     * @private
     * @return {void}
     */
    handleDeleteBtnClick(user, e) {
        Platform.config.removeUser(user);
        this.forceUpdate();
        e.stopPropagation();
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof SwapUser
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            identify,
            className,
            onSelectUser,
            ...other
        } = this.props;

        const userList = Platform.config.userList();

        return (<div
            {...other}
            className={HTML.classes('app-swap-user list has-padding-v', className)}
        >
            {
                userList.map(user => {
                    user = User.create(user);
                    const userIdentify = user.identify;
                    const isHover = this.state.hover === userIdentify;
                    const isActive = userIdentify === identify;
                    return (<UserListItem
                        key={user.identify}
                        user={user}
                        onMouseEnter={this.handleMouseEnter.bind(this, userIdentify)}
                        onMouseLeave={this.handleMouseLeave}
                        className={isActive ? 'primary-pale' : ''}
                        onClick={onSelectUser.bind(null, user)}
                    >
                        {
                            isHover ? <div style={{zIndex: 10}} className="hint--top" data-hint={Lang.string('common.remove')}><button onClick={this.handleDeleteBtnClick.bind(this, user)} type="button" className="btn iconbutton rounded"><Icon name="delete text-danger" /></button></div> : isActive ? <Icon name="check text-success" /> : null
                        }
                    </UserListItem>);
                })
            }
        </div>);
    }
}
