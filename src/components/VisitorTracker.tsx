import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface VisitorInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  isp: string;
  org: string;
  timezone: string;
  lat: number;
  lon: number;
  user_agent: string;
  referrer: string;
  page_url: string;
  device_type: string;
  browser: string;
  os: string;
}

export function VisitorTracker() {
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    // Check if already tracked in this session
    const sessionId = sessionStorage.getItem('visitor_tracked');
    if (sessionId) {
      console.log('📍 Visitor already tracked this session');
      setTracked(true);
      return;
    }

    const trackVisitor = async () => {
      try {
        console.log('📍 Starting visitor tracking...');

        // Get IP
        let ipData: any = null;
        const ipServices = [
          'https://api.ipify.org?format=json',
          'https://api.my-ip.io/ip.json',
          'https://ip-api.io/json/'
        ];

        for (const service of ipServices) {
          try {
            const response = await fetch(service, { signal: AbortSignal.timeout(5000) });
            if (response.ok) {
              const data = await response.json();
              if (data.ip) {
                ipData = data;
                break;
              }
            }
          } catch {
            continue;
          }
        }

        if (!ipData) {
          try {
            const response = await fetch('https://httpbin.org/ip', { signal: AbortSignal.timeout(5000) });
            const data = await response.json();
            if (data.origin) {
              ipData = { ip: data.origin };
            }
          } catch {
            console.warn('📍 All IP services failed');
            return;
          }
        }

        const ip = ipData?.ip;
        if (!ip) {
          console.warn('📍 No IP found');
          return;
        }

        console.log('📍 IP detected:', ip);

        // Get geolocation data
        let geoData: any = null;
        let ispData: any = null;
        let source = 'unknown';

        // Try ip-api.com first
        try {
          const ispResponse = await fetch(
            `https://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as`,
            { signal: AbortSignal.timeout(5000) }
          );
          if (ispResponse.ok) {
            const data = await ispResponse.json();
            if (data.status === 'success') {
              ispData = data;
              source = 'ip-api.com';
            }
          }
        } catch {
          // ISP service failed
        }

        // Try ipapi.co as fallback
        if (!ispData) {
          try {
            const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`, {
              signal: AbortSignal.timeout(5000)
            });
            if (geoResponse.ok) {
              const data = await geoResponse.json();
              if (data.ip) {
                geoData = data;
                source = 'ipapi.co';
              }
            }
          } catch {
            // Geo service failed
          }
        }

        // Try ipinfo.io as third fallback
        if (!geoData && !ispData) {
          try {
            const backupResponse = await fetch(`https://ipinfo.io/${ip}/json`, {
              signal: AbortSignal.timeout(5000)
            });
            if (backupResponse.ok) {
              const data = await backupResponse.json();
              geoData = {
                city: data.city,
                region: data.region,
                country_name: data.country,
                country_code: data.country,
                org: data.org,
                timezone: data.timezone,
                latitude: data.loc?.split(',')[0],
                longitude: data.loc?.split(',')[1]
              };
              source = 'ipinfo.io';
            }
          } catch {
            // All failed
          }
        }

        // Get browser info
        const userAgent = navigator.userAgent;
        const getDeviceType = () => {
          if (/mobile/i.test(userAgent)) return 'Mobile';
          if (/tablet/i.test(userAgent)) return 'Tablet';
          return 'Desktop';
        };
        const getBrowser = () => {
          if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) return 'Chrome';
          if (/firefox/i.test(userAgent)) return 'Firefox';
          if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';
          if (/edge/i.test(userAgent)) return 'Edge';
          return 'Other';
        };
        const getOS = () => {
          if (/windows/i.test(userAgent)) return 'Windows';
          if (/mac/i.test(userAgent)) return 'MacOS';
          if (/linux/i.test(userAgent)) return 'Linux';
          if (/android/i.test(userAgent)) return 'Android';
          if (/ios|iphone|ipad/i.test(userAgent)) return 'iOS';
          return 'Other';
        };

        const visitorData: VisitorInfo = {
          ip: ip,
          city: geoData?.city || ispData?.city || 'Unknown',
          region: geoData?.region || ispData?.regionName || 'Unknown',
          country: geoData?.country_name || ispData?.country || 'Unknown',
          country_code: geoData?.country_code || ispData?.countryCode || 'Unknown',
          isp: ispData?.isp || geoData?.org || 'Unknown',
          org: ispData?.org || geoData?.org || 'Unknown',
          timezone: geoData?.timezone || ispData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          lat: parseFloat(geoData?.latitude) || parseFloat(ispData?.lat) || 0,
          lon: parseFloat(geoData?.longitude) || parseFloat(ispData?.lon) || 0,
          user_agent: userAgent,
          referrer: document.referrer || 'Direct',
          page_url: window.location.href,
          device_type: getDeviceType(),
          browser: getBrowser(),
          os: getOS()
        };

        console.log('📍 Visitor data:', {
          ip: visitorData.ip,
          city: visitorData.city,
          country: visitorData.country,
          isp: visitorData.isp,
          device: visitorData.device_type,
          browser: visitorData.browser,
          source: source
        });

        // Save to database
        const { data, error } = await supabase
          .from('visitor_locations')
          .insert([{
            ip_address: visitorData.ip,
            city: visitorData.city,
            region: visitorData.region,
            country: visitorData.country,
            country_code: visitorData.country_code,
            isp: visitorData.isp,
            org: visitorData.org,
            timezone: visitorData.timezone,
            latitude: visitorData.lat,
            longitude: visitorData.lon,
            user_agent: visitorData.user_agent,
            referrer: visitorData.referrer,
            page_url: visitorData.page_url,
            device_type: visitorData.device_type,
            browser: visitorData.browser,
            os: visitorData.os,
            visited_at: new Date().toISOString()
          }])
          .select();

        if (error) {
          console.error('❌ Database error:', error);
          return;
        }

        console.log('✅ Visitor tracked successfully!', data);
        
        // Mark as tracked in session
        sessionStorage.setItem('visitor_tracked', 'true');
        setTracked(true);

      } catch (error) {
        console.error('❌ Error tracking visitor:', error);
      }
    };

    // Track visitor after page load
    console.log('📍 Scheduling visitor tracking...');
    const timer = setTimeout(() => {
      trackVisitor();
    }, 1500);

    return () => clearTimeout(timer);

  }, []);

  // This component doesn't render anything
  return null;
}