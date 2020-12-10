// @flow

import { openDialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import { IconMenuThumb } from '../../../base/icons';
import { connect } from '../../../base/redux';
import { AbstractButton, type AbstractButtonProps } from '../../../base/toolbox/components';
import { toggleCameraFacingMode } from '../../../base/media';
import OverflowMenu from './OverflowMenu';
import { NativeEventEmitter, NativeModules } from 'react-native';

const { ConferenceActionModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(ConferenceActionModule);

/**
 * The type of the React {@code Component} props of {@link OverflowMenuButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * An implementation of a button for showing the {@code OverflowMenu}.
 */
class OverflowMenuButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.moreActions';
    icon = IconMenuThumb;
    label = 'toolbar.moreActions';

    /**
     * Initializes a new {@code ToggleCameraButton} instance.
     *
     * @param {Props} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this.handleToggleCamera = this.handleToggleCamera.bind(this);
    }

    /**
     * Registers the event that toggles the camera.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        this.subscription = eventEmitter.addListener('handleToggleCamera', this.handleToggleCamera);
    }

    /**
     * Unregisters the event that toggles the camera.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        this.subscription.remove();
    }

    handleToggleCamera() {
        this.props.dispatch(toggleCameraFacingMode());
    };

    /**
     * Handles clicking / pressing this {@code OverflowMenuButton}.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        this.props.dispatch(openDialog(OverflowMenu));
    }
}

export default translate(connect()(OverflowMenuButton));
