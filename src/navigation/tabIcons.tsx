import TabIcon from '../components/TabIcon';
import { IconProps } from '../types';

export const TabIcons = {
    Home: (props: IconProps) => <TabIcon type="home" {...props} />,
    Services: (props: IconProps) => <TabIcon type="services" {...props} />,
    CreateService: (props: IconProps) => <TabIcon type="createService" {...props} />,
    Profile: (props: IconProps) => <TabIcon type="profile" {...props} />,
    Clipboard: (props: IconProps) => <TabIcon type="clipboard" {...props} />,
};
