import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { TokenManager } from '@/lib/token-manager';

interface UserInfo {
  fullname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export function useUserInfo() {
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await TokenManager.getAccessToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data.data || null);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching user info:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [session]);

  return { userInfo, loading };
}

