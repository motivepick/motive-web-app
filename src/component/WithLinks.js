import React from 'react'
import Linkify from 'react-linkify'

/**
 * Due to a bug in the library, properties do not propagate to links. Using custom decorator to propagate the target property
 * to make the links open in a new tab.
 */
const componentDecorator = (href, text, key) => (
    <a href={href} key={key} target="_blank" rel="noopener noreferrer">
        {text}
    </a>
)

const WithLinks = ({ children }) => <Linkify componentDecorator={componentDecorator}>{children}</Linkify>

export default WithLinks
