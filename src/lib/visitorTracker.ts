import { supabase } from './supabase';

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
  accuracy: 'gps' | 'ip' | 'wifi' | 'unknown';
  gps_available: boolean;
  user_agent: string;
  referrer: string;
  page_url: string;
  device_type: string;
  browser: string;
  os: string;
}

class VisitorTrackerService {
  private static instance: VisitorTrackerService;
  private isTracking = false;

  static getInstance(): VisitorTrackerService {
    if (!VisitorTrackerService.instance) {
      VisitorTrackerService.instance = new VisitorTrackerService();
    }
    return VisitorTrackerService.instance;
  }

  async track() {
    if (this.isTracking) {
      console.log('📍 Already tracking...');
      return;
    }

    const sessionId = sessionStorage.getItem('visitor_tracked');
    if (sessionId) {
      console.log('📍 Visitor already tracked this session');
      return;
    }

    this.isTracking = true;

    try {
      console.log('📍 Starting visitor tracking...');

      // Get IP
      const ip = await this.getIP();
      if (!ip) {
        console.warn('📍 No IP found');
        this.isTracking = false;
        return;
      }

      console.log('📍 IP detected:', ip);

      // Try to get GPS location from browser (most accurate)
      let gpsLocation = null;
      let gpsAvailable = false;
      
      try {
        gpsLocation = await this.getBrowserLocation();
        if (gpsLocation) {
          gpsAvailable = true;
          console.log('📍 GPS location detected:', gpsLocation);
        }
      } catch (error) {
        console.log('📍 GPS not available, using IP geolocation');
      }

      // Get location data
      let locationData;
      let accuracy: 'gps' | 'ip' | 'wifi' | 'unknown' = 'unknown';
      
      if (gpsLocation && gpsAvailable) {
        // Use GPS coordinates with reverse geocoding for city/country
        locationData = await this.getLocationFromGPS(gpsLocation.lat, gpsLocation.lon);
        locationData.lat = gpsLocation.lat;
        locationData.lon = gpsLocation.lon;
        accuracy = 'gps';
      } else {
        // Use IP-based geolocation
        locationData = await this.getIPLocationData(ip);
        accuracy = locationData.accuracy || 'ip';
      }

      // Get browser info
      const browserInfo = this.getBrowserInfo();

      const visitorData: VisitorInfo = {
        ip: ip,
        city: locationData.city || 'Unknown',
        region: locationData.region || 'Unknown',
        country: locationData.country || 'Unknown',
        country_code: locationData.country_code || 'Unknown',
        isp: locationData.isp || 'Unknown',
        org: locationData.org || 'Unknown',
        timezone: locationData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        lat: locationData.lat || 0,
        lon: locationData.lon || 0,
        accuracy: accuracy,
        gps_available: gpsAvailable,
        user_agent: browserInfo.userAgent,
        referrer: document.referrer || 'Direct',
        page_url: window.location.href,
        device_type: browserInfo.deviceType,
        browser: browserInfo.browser,
        os: browserInfo.os
      };

      console.log('📍 Visitor data:', {
        ip: visitorData.ip,
        city: visitorData.city,
        country: visitorData.country,
        accuracy: visitorData.accuracy,
        gps_available: visitorData.gps_available,
        lat: visitorData.lat,
        lon: visitorData.lon,
        device: visitorData.device_type,
        browser: visitorData.browser
      });

      // Save to database
      await this.saveVisitorData(visitorData);

      sessionStorage.setItem('visitor_tracked', 'true');
      console.log(`✅ Visitor tracked successfully! (Accuracy: ${visitorData.accuracy})`);

    } catch (error) {
      console.error('❌ Error tracking visitor:', error);
    } finally {
      this.isTracking = false;
    }
  }

  private async getBrowserLocation(): Promise<{ lat: number; lon: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => {
          resolve(null);
        },
        { 
          timeout: 10000, 
          enableHighAccuracy: true,
          maximumAge: 0
        }
      );
    });
  }

  private async getLocationFromGPS(lat: number, lon: number): Promise<{
    city: string;
    region: string;
    country: string;
    country_code: string;
    isp: string;
    org: string;
    timezone: string;
    lat: number;
    lon: number;
    accuracy: 'gps' | 'ip' | 'wifi' | 'unknown';
  }> {
    try {
      // Reverse geocoding to get city/country from coordinates
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
        { signal: AbortSignal.timeout(5000) }
      );
      
      if (response.ok) {
        const data = await response.json();
        return {
          city: data.city || data.locality || 'Unknown',
          region: data.principalSubdivision || 'Unknown',
          country: data.countryName || 'Unknown',
          country_code: data.countryCode || 'Unknown',
          isp: 'GPS Location',
          org: 'Browser Geolocation',
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          lat: lat,
          lon: lon,
          accuracy: 'gps'
        };
      }
    } catch (error) {
      console.warn('📍 Reverse geocoding failed:', error);
    }

    return {
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      country_code: 'Unknown',
      isp: 'GPS Location',
      org: 'Browser Geolocation',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      lat: lat,
      lon: lon,
      accuracy: 'gps'
    };
  }

  private async getIP(): Promise<string | null> {
    const ipServices = [
      'https://api.ipify.org?format=json',
      'https://api.my-ip.io/ip.json',
      'https://ip-api.io/json/'
    ];

    for (const service of ipServices) {
      try {
        const response = await fetch(service, { 
          signal: AbortSignal.timeout(5000)
        });
        if (response.ok) {
          const data = await response.json();
          if (data.ip) {
            return data.ip;
          }
        }
      } catch {
        continue;
      }
    }

    try {
      const response = await fetch('https://httpbin.org/ip', { 
        signal: AbortSignal.timeout(5000)
      });
      const data = await response.json();
      if (data.origin) {
        return data.origin;
      }
    } catch {
      // All services failed
    }

    return null;
  }

  private async getIPLocationData(ip: string): Promise<{
    city: string;
    region: string;
    country: string;
    country_code: string;
    isp: string;
    org: string;
    timezone: string;
    lat: number;
    lon: number;
    accuracy: 'gps' | 'ip' | 'wifi' | 'unknown';
  }> {
    let geoData: any = null;
    let ispData: any = null;

    // Try ip-api.com
    try {
      const response = await fetch(
        `https://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          ispData = data;
        }
      }
    } catch {
      // ISP service failed
    }

    // Try ipapi.co
    if (!ispData) {
      try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`, {
          signal: AbortSignal.timeout(5000)
        });
        if (response.ok) {
          geoData = await response.json();
        }
      } catch {
        // Geo service failed
      }
    }

    // Try ipinfo.io
    if (!geoData && !ispData) {
      try {
        const response = await fetch(`https://ipinfo.io/${ip}/json`, {
          signal: AbortSignal.timeout(5000)
        });
        if (response.ok) {
          const data = await response.json();
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
        }
      } catch {
        // All failed
      }
    }

    return {
      city: geoData?.city || ispData?.city || 'Unknown',
      region: geoData?.region || ispData?.regionName || 'Unknown',
      country: geoData?.country_name || ispData?.country || 'Unknown',
      country_code: geoData?.country_code || ispData?.countryCode || 'Unknown',
      isp: ispData?.isp || geoData?.org || 'Unknown',
      org: ispData?.org || geoData?.org || 'Unknown',
      timezone: geoData?.timezone || ispData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      lat: parseFloat(geoData?.latitude) || parseFloat(ispData?.lat) || 0,
      lon: parseFloat(geoData?.longitude) || parseFloat(ispData?.lon) || 0,
      accuracy: 'ip'
    };
  }

  private getBrowserInfo() {
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

    return {
      userAgent,
      deviceType: getDeviceType(),
      browser: getBrowser(),
      os: getOS()
    };
  }

  private async saveVisitorData(data: VisitorInfo) {
    try {
      const { error } = await supabase
        .from('visitor_locations')
        .insert([{
          ip_address: data.ip,
          city: data.city,
          region: data.region,
          country: data.country,
          country_code: data.country_code,
          isp: data.isp,
          org: data.org,
          timezone: data.timezone,
          latitude: data.lat,
          longitude: data.lon,
          accuracy: data.accuracy,
          gps_available: data.gps_available,
          user_agent: data.user_agent,
          referrer: data.referrer,
          page_url: data.page_url,
          device_type: data.device_type,
          browser: data.browser,
          os: data.os,
          visited_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('❌ Database error:', error);
      }
    } catch (error) {
      console.error('❌ Error saving visitor data:', error);
    }
  }
}

export const visitorTracker = VisitorTrackerService.getInstance();