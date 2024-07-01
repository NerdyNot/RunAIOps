import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import { useBackendUrl } from '../contexts/BackendUrlContext';
import Cookies from 'js-cookie'
import axios from 'axios'

const requireAuth = (WrappedComponent: any, skipAuthPages: string[] = []) => {
  return (props: any) => {
    const router = useRouter()
    const { user } = useAuth()
    const { backendUrl } = useBackendUrl();

    useEffect(() => {
      const verifyToken = async () => {
        const token = Cookies.get('token')

        if (!token) {
          router.push('/login')
          return
        }

        try {
          const response = await axios.post(`${backendUrl}/verify-token`, { token })
          
          if (response.status !== 200) {
            router.push('/login')
          }
        } catch (err) {
          console.error('Token verification failed:', err)
          router.push('/login')
        }
      }

      if (!skipAuthPages.includes(router.pathname)) {
        verifyToken()
      }
    }, [router, user])

    return <WrappedComponent {...props} />
  }
}

export default requireAuth
