import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

const FeedbackView: FC = () => {
    const { t } = useTranslation()
    const redirectUrl = window.location.origin + '/'
    const [feedback, setFeedback] = useState('')

    return (
        <div className="row">
            <div className="col-12 col-md-6 mx-auto">
                <form method="POST" action="https://submit-form.com/lYd1N6pIw" data-botpoison-public-key="pk_be0e80db-608d-4f34-9113-87618b110d0b">
                    <input type="hidden" name="_redirect" value={redirectUrl}/>
                    <input type="hidden" name="_email.subject" value="Milestone Feedback"/>
                    <div className="mt-3 mb-3">
                        <textarea
                            placeholder={t('feedbackBody')}
                            className="form-control"
                            name="feedback"
                            rows={5}
                            value={feedback}
                            onChange={e => setFeedback(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder={t('feedbackEmail')}
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary mb-3" disabled={!feedback.trim()}>
                            {t('feedbackSubmit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FeedbackView
