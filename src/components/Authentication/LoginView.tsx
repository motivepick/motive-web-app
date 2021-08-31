import React from 'react'
import Footer from './Footer'

import './styles.css'
import LoginOptions from './LoginOptions'
import Logo from './Logo'
import Welcome from './Welcome'

const LoginView: React.FC = () =>
    <div>
        <main>
            <Logo/>
            <Welcome/>
            <LoginOptions/>
        </main>
        <Footer/>
    </div>

export default LoginView
