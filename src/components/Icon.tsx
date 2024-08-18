import React, { CSSProperties, FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

interface Props {
    icon: string,
    style?: CSSProperties
}

const Icon: FC<Props> = (props: Props) => {
    // @ts-ignore, see "Typescript and custom icons" in https://docs.fontawesome.com/web/use-with/react/add-icons
    const icon: IconProp = props.icon
    return <FontAwesomeIcon icon={icon} style={props.style}/>
}

export default Icon
