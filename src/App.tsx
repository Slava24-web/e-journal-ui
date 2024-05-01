import React, { useEffect } from 'react';
import { Spin } from 'antd';
import { observer } from 'mobx-react-lite'
import { Route, Routes, useNavigate } from 'react-router-dom';
import { SignUp } from './Pages/SignUp';
import { SignIn } from './Pages/SingIn';
import { AuthClient } from './api/auth';
import inMemoryJWT from './services/jwt';
import AuthSlice from './store/auth/slice'
import { LoadingOutlined } from '@ant-design/icons';
import config from './config';
import { Notification } from './Components/Notification';
import { Main } from './Pages/Main';

const App: React.FC = observer(() => {
    const navigate = useNavigate()

    const isAppReady = AuthSlice.getIsAppReady
    const isUserAuth = AuthSlice.getIsUserAuth

    useEffect(() => {
        AuthClient.post('/refresh')
            .then(response => {
                const { accessToken, accessTokenExpiration, user } = response.data
                inMemoryJWT.setToken(accessToken, accessTokenExpiration)

                AuthSlice.setIsAppReady(true)
                AuthSlice.setIsUserAuth(true, user)
            })
            .catch(() => {
                AuthSlice.setIsAppReady(true)
                AuthSlice.setIsUserAuth(false)
            })
    }, []);

    // Обработка logout с разных устройств
    useEffect(() => {
        const handlePersistedLogOut = (event: StorageEvent) => {
            if (event.key === config.LOGOUT_STORAGE_KEY) {
                inMemoryJWT.deleteToken()
                AuthSlice.setIsUserAuth(false)
            }
        }

        window.addEventListener('storage', handlePersistedLogOut)

        return () => {
            window.removeEventListener('storage', handlePersistedLogOut)
        }
    }, []);

    useEffect(() => {
        if (isUserAuth && !/main/.test(window.location.href)) {
            navigate('/main')
        }
        if (!isUserAuth && isAppReady) {
            navigate('/sign-in')
        }
    }, [isUserAuth]);

    return (
        <>
            {
                isAppReady && (
                    <div className='app'>
                        <Routes>
                            <Route path='/sign-up' element={<SignUp />} />
                            <Route path='/sign-in' element={<SignIn />} />
                            <Route path='/main/*' element={<Main />} />
                        </Routes>
                        <Notification />
                    </div>
                )
            }

            {
                !isAppReady && <Spin indicator={<LoadingOutlined style={{ fontSize: 52 }} spin />} fullscreen />
            }
        </>
    )
})

export default App
