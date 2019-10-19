import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

class Footer extends PureComponent {

    render() {
        return (
            <div style={{ marginBottom: '10px' }}/>
        )
    }
}

export default translate('translations')(Footer)
