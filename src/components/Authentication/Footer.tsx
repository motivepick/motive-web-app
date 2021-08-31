import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import './styles.css'

const Footer: React.FC = () => {
    const { t } = useTranslation()
    return (
        <div className="footer">
            <span className="text-muted">
                 <a href="mailto:motivepick@yahoo.com">
                     {t('contactUs')}
                 </a>
            </span>
            <span className="text-muted">  |  <Link to="/privacy">{t('privacyPolicy')}</Link></span>
        </div>
    )
}

export default Footer
