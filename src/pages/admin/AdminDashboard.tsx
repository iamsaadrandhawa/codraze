import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, FolderKanban, Mail, MailWarning, 
  CheckCircle2, FileEdit, ArrowRight, 
  Users, TrendingUp, Eye, Clock,
  BarChart3, PieChart, Activity,
  Wifi, WifiOff, Server, Globe,
  ArrowUp, ArrowDown, Minus,
  Network, Cpu, HardDrive,
  HandCoins, UserPlus, CreditCard,
  DollarSign, Users as UsersIcon,
  MapPin, RefreshCw, Zap, Signal,
  AlertCircle, CheckCircle, Database,
  Satellite, Wifi as WifiIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Blog, ContactSubmission, Profile } from '../../lib/types';
import { formatDate, formatDateTime } from '../../lib/utils';

interface Stats {
  publishedBlogs: number;
  draftBlogs: number;
  projects: number;
  contacts: number;
  unread: number;
  totalUsers: number;
  activeUsers: number;
  totalSubscribers: number;
  activeSubscribers: number;
  totalPricingPlans: number;
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface IPInfo {
  ip: string;
  localIP: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  isp: string;
  org: string;
  asn: string;
  timezone: string;
  lat: number;
  lon: number;
  postal: string;
  status: 'online' | 'offline';
  responseTime: number;
  lastUpdated: string;
  source: string;
}

interface GrowthData {
  month: string;
  blogs: number;
  projects: number;
  contacts: number;
  users: number;
  subscribers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [recentContacts, setRecentContacts] = useState<ContactSubmission[]>([]);
  const [blogsByStatus, setBlogsByStatus] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [ipLoading, setIpLoading] = useState(true);
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [pageViews, setPageViews] = useState(0);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [locationSaved, setLocationSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get local IP
  const getLocalIP = async (): Promise<string> => {
    try {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      return new Promise((resolve) => {
        pc.onicecandidate = (ice) => {
          if (!ice.candidate) {
            resolve('127.0.0.1');
            return;
          }
          const candidate = ice.candidate.candidate;
          const ipMatch = candidate.match(/(\d{1,3}\.){3}\d{1,3}/);
          if (ipMatch) {
            resolve(ipMatch[0]);
            pc.close();
          }
        };
        setTimeout(() => {
          resolve('127.0.0.1');
          pc.close();
        }, 3000);
      });
    } catch {
      return '127.0.0.1';
    }
  };

  // Save location to database
  // Save location to database with proper upsert
const saveLocationToDatabase = async (locationData: IPInfo) => {
  try {
    setIsSavingLocation(true);
    setSaveError(null);

    // Validate required fields
    if (!locationData.ip || locationData.ip === 'Unable to fetch') {
      setSaveError('Invalid IP address');
      return;
    }

    const locationPayload = {
      ip_address: locationData.ip,
      local_ip: locationData.localIP || '127.0.0.1',
      city: locationData.city || 'Unknown',
      region: locationData.region || 'Unknown',
      country: locationData.country || 'Unknown',
      country_code: locationData.country_code || 'Unknown',
      isp: locationData.isp || 'Unknown',
      org: locationData.org || 'Unknown',
      timezone: locationData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      latitude: locationData.lat || 0,
      longitude: locationData.lon || 0,
      postal: locationData.postal || 'Unknown',
      last_updated: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('💾 Saving location to database:', locationPayload);

    // Use upsert to avoid duplicate violations
    const { data, error } = await supabase
      .from('ip_locations')
      .upsert(
        {
          ...locationPayload,
          created_at: new Date().toISOString()
        },
        { onConflict: 'ip_address' }
      )
      .select();

    if (error) {
      console.error('Save error:', error);
      setSaveError(error.message || 'Failed to save location');
      setLocationSaved(false);
      return;
    }

    setLocationSaved(true);
    console.log('✅ Location saved successfully:', locationData.ip, locationData.city, locationData.country);
    
    // Reset saved status after 3 seconds
    setTimeout(() => setLocationSaved(false), 3000);

  } catch (error: any) {
    console.error('❌ Error saving location to database:', error);
    setSaveError(error.message || 'Failed to save location');
    setLocationSaved(false);
  } finally {
    setIsSavingLocation(false);
  }
};

  // Fetch IP info with multiple fallback sources
  // Fetch IP info with multiple fallback sources
const fetchIPInfo = async () => {
  try {
    setIpLoading(true);
    setSaveError(null);
    
    const startTime = performance.now();
    let ipData: any = null;
    let geoData: any = null;
    let ispData: any = null;
    let source = 'unknown';

    // Try multiple IP services with fallbacks
    const ipServices = [
      { url: 'https://api.ipify.org?format=json', key: 'ip' },
      { url: 'https://api.my-ip.io/ip.json', key: 'ip' },
      { url: 'https://ip-api.io/json/', key: 'ip' }
    ];

    for (const service of ipServices) {
      try {
        const response = await fetch(service.url, { signal: AbortSignal.timeout(5000) });
        if (response.ok) {
          const data = await response.json();
          if (data.ip) {
            ipData = data;
            source = service.url;
            break;
          }
        }
      } catch {
        continue;
      }
    }

    // If no IP found, try one more service
    if (!ipData) {
      try {
        const response = await fetch('https://httpbin.org/ip', { signal: AbortSignal.timeout(5000) });
        const data = await response.json();
        if (data.origin) {
          ipData = { ip: data.origin };
          source = 'httpbin.org';
        }
      } catch {
        // All services failed
      }
    }

    const ip = ipData?.ip || 'Unable to fetch';

    // Try to get geolocation data
    if (ip !== 'Unable to fetch') {
      // Try ip-api.com first (more reliable for ISP info)
      try {
        const ispResponse = await fetch(`https://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as`, { signal: AbortSignal.timeout(5000) });
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
          const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`, { signal: AbortSignal.timeout(5000) });
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
          const backupResponse = await fetch(`https://ipinfo.io/${ip}/json`, { signal: AbortSignal.timeout(5000) });
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
    }

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    // Get local IP
    const localIP = await getLocalIP();

    // Combine data from all sources
    const newIpInfo: IPInfo = {
      ip: ip,
      localIP: localIP,
      city: geoData?.city || ispData?.city || 'Unknown',
      region: geoData?.region || ispData?.regionName || 'Unknown',
      country: geoData?.country_name || ispData?.country || 'Unknown',
      country_code: geoData?.country_code || ispData?.countryCode || 'Unknown',
      isp: ispData?.isp || geoData?.org || 'Unknown',
      org: ispData?.org || geoData?.org || 'Unknown',
      asn: ispData?.as || geoData?.asn || 'Unknown',
      timezone: geoData?.timezone || ispData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      lat: parseFloat(geoData?.latitude) || parseFloat(ispData?.lat) || 0,
      lon: parseFloat(geoData?.longitude) || parseFloat(ispData?.lon) || 0,
      postal: geoData?.postal || ispData?.zip || 'Unknown',
      status: ip !== 'Unable to fetch' ? 'online' : 'offline',
      responseTime: responseTime,
      lastUpdated: new Date().toISOString(),
      source: source
    };

    setIpInfo(newIpInfo);
    setRefreshCount(prev => prev + 1);

    // Log location info
    console.log('📍 Location Detected:', {
      ip: newIpInfo.ip,
      city: newIpInfo.city,
      region: newIpInfo.region,
      country: newIpInfo.country,
      isp: newIpInfo.isp,
      org: newIpInfo.org,
      asn: newIpInfo.asn,
      responseTime: newIpInfo.responseTime + 'ms',
      source: newIpInfo.source
    });

    // Auto-save location to database
    if (newIpInfo.ip !== 'Unable to fetch' && newIpInfo.city !== 'Unknown') {
      await saveLocationToDatabase(newIpInfo);
    } else {
      console.warn('⚠️ Skipping save: IP or location data incomplete');
      setSaveError('IP or location data incomplete');
    }

  } catch (error: any) {
    console.error('❌ Error fetching IP info:', error);
    setSaveError(error.message || 'Failed to fetch IP info');
    setIpInfo({
      ip: 'Unable to fetch',
      localIP: '127.0.0.1',
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      country_code: 'Unknown',
      isp: 'Unknown',
      org: 'Unknown',
      asn: 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      lat: 0,
      lon: 0,
      postal: 'Unknown',
      status: 'offline',
      responseTime: 0,
      lastUpdated: new Date().toISOString(),
      source: 'none'
    });
  } finally {
    setIpLoading(false);
  }
};

  // Start/stop live refresh
  const toggleLive = () => {
    setIsLive(!isLive);
    if (!isLive) {
      fetchIPInfo();
    }
  };

  // Generate mock growth data
  const generateGrowthData = (): GrowthData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      month,
      blogs: Math.floor(Math.random() * 20 + 5) + index * 2,
      projects: Math.floor(Math.random() * 10 + 3) + index,
      contacts: Math.floor(Math.random() * 30 + 10) + index * 3,
      users: Math.floor(Math.random() * 50 + 20) + index * 5,
      subscribers: Math.floor(Math.random() * 40 + 10) + index * 4,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogs, projects, contacts, profiles, subscribers, pricing] = await Promise.all([
          supabase.from('blogs').select('*').order('created_at', { ascending: false }),
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
          supabase.from('profiles').select('*'),
          supabase.from('subscribers').select('*'),
          supabase.from('pricing').select('*').eq('is_active', true),
        ]);

        if (blogs.error) throw blogs.error;
        if (projects.error) throw projects.error;
        if (contacts.error) throw contacts.error;
        if (profiles.error) throw profiles.error;
        if (subscribers.error) throw subscribers.error;
        if (pricing.error) throw pricing.error;

        const blogRows = blogs.data ?? [];
        const projectRows = projects.data ?? [];
        const contactRows = contacts.data ?? [];
        const profileRows = profiles.data ?? [];
        const subscriberRows = subscribers.data ?? [];
        const pricingRows = pricing.data ?? [];

        const published = blogRows.filter((b) => b.status === 'published').length;
        const drafts = blogRows.filter((b) => b.status === 'draft').length;
        const archived = blogRows.filter((b) => b.status === 'archived').length;

        setBlogsByStatus([
          { label: 'Published', value: published, color: '#22c55e' },
          { label: 'Drafts', value: drafts, color: '#f59e0b' },
          { label: 'Archived', value: archived, color: '#6b7280' },
        ]);

        const activeCount = profileRows.filter((p) => p.status === 'active').length;
        const activeSubscribers = subscriberRows.filter((s) => s.status === 'active').length;
        
        setActiveUsers(activeCount);
        setPageViews(Math.floor(Math.random() * 5000 + 1000));

        setStats({
          publishedBlogs: published,
          draftBlogs: drafts,
          projects: projectRows.length,
          contacts: contactRows.length,
          unread: contactRows.filter((c) => !c.is_read).length,
          totalUsers: profileRows.length,
          activeUsers: activeCount,
          totalSubscribers: subscriberRows.length,
          activeSubscribers: activeSubscribers,
          totalPricingPlans: pricingRows.length,
        });
        
        setRecentBlogs(blogRows.slice(0, 5));
        setRecentContacts(contactRows.slice(0, 5));
        setGrowthData(generateGrowthData());
        
        // Initial IP fetch
        await fetchIPInfo();
        
        // Set up interval for live refresh
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        intervalRef.current = setInterval(() => {
          if (isLive) {
            fetchIPInfo();
          }
        }, 5000); // Refresh every 5 seconds
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update interval when isLive changes
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (isLive) {
      intervalRef.current = setInterval(() => {
        fetchIPInfo();
      }, 5000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive]);

  // Growth Chart Component
  const GrowthChart = ({ data }: { data: GrowthData[] }) => {
    const maxValue = Math.max(
      ...data.map(d => Math.max(d.blogs, d.projects, d.contacts, d.users, d.subscribers))
    );
    
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="flex items-end gap-2 h-48">
            {data.map((item, index) => {
              const height = (item.users / maxValue) * 100;
              const blogHeight = (item.blogs / maxValue) * 100;
              const projectHeight = (item.projects / maxValue) * 100;
              const contactHeight = (item.contacts / maxValue) * 100;
              const subscriberHeight = (item.subscribers / maxValue) * 100;
              
              return (
                <div key={item.month} className="flex flex-col items-center flex-1">
                  <div className="relative w-full flex items-end justify-center gap-1 h-40">
                    <div 
                      className="w-3 rounded-t bg-pink-500/60 transition-all duration-500 hover:bg-pink-500"
                      style={{ height: `${subscriberHeight * 0.5}%` }}
                      title={`Subscribers: ${item.subscribers}`}
                    />
                    <div 
                      className="w-3 rounded-t bg-emerald-500/60 transition-all duration-500 hover:bg-emerald-500"
                      style={{ height: `${contactHeight * 0.6}%` }}
                      title={`Contacts: ${item.contacts}`}
                    />
                    <div 
                      className="w-3 rounded-t bg-sky-500/60 transition-all duration-500 hover:bg-sky-500"
                      style={{ height: `${projectHeight * 0.7}%` }}
                      title={`Projects: ${item.projects}`}
                    />
                    <div 
                      className="w-3 rounded-t bg-amber-500/60 transition-all duration-500 hover:bg-amber-500"
                      style={{ height: `${blogHeight * 0.8}%` }}
                      title={`Blogs: ${item.blogs}`}
                    />
                    <div 
                      className="w-3 rounded-t bg-purple-500/60 transition-all duration-500 hover:bg-purple-500"
                      style={{ height: `${height}%` }}
                      title={`Users: ${item.users}`}
                    />
                  </div>
                  <span className="mt-1 text-[10px] text-slate-500">{item.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-purple-500"/> Users</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-500"/> Blogs</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-sky-500"/> Projects</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500"/> Contacts</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-pink-500"/> Subscribers</span>
          </div>
        </div>
      </div>
    );
  };

  // Circle Progress Component
  const CircleProgress = ({ value, max, label, color, icon: Icon }: { value: number; max: number; label: string; color: string; icon: any }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const circumference = 2 * Math.PI * 36;
    const dashOffset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative h-20 w-20">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
        </div>
        <span className="mt-1 text-xs font-medium text-white">{label}</span>
        <span className="text-[10px] text-slate-400">{value}/{max}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-blaze-500" />
      </div>
    );
  }

  const cards = [
    { label: 'Published Blogs', value: stats?.publishedBlogs ?? 0, icon: CheckCircle2, to: '/admin/blogs', color: 'text-emerald-400' },
    { label: 'Draft Blogs', value: stats?.draftBlogs ?? 0, icon: FileEdit, to: '/admin/blogs', color: 'text-amber-400' },
    { label: 'Projects', value: stats?.projects ?? 0, icon: FolderKanban, to: '/admin/projects', color: 'text-sky-400' },
    { label: 'Messages', value: stats?.contacts ?? 0, icon: Mail, to: '/admin/contacts', color: 'text-blaze-400' },
    { label: 'Unread', value: stats?.unread ?? 0, icon: MailWarning, to: '/admin/contacts', color: 'text-red-400' },
    { label: 'Users', value: stats?.totalUsers ?? 0, icon: Users, to: '/admin/users', color: 'text-purple-400' },
    { label: 'Subscribers', value: stats?.totalSubscribers ?? 0, icon: UserPlus, to: '/admin/subscribers', color: 'text-pink-400' },
    { label: 'Pricing Plans', value: stats?.totalPricingPlans ?? 0, icon: CreditCard, to: '/admin/pricing', color: 'text-amber-400' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Overview of your content, users, and subscribers</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {new Date().toLocaleTimeString()}
          </span>
          <span className="flex items-center gap-1">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            {pageViews} views today
          </span>
          <button
            onClick={toggleLive}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              isLive 
                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            }`}
          >
            <Signal className={`h-3 w-3 ${isLive ? 'animate-pulse' : ''}`} />
            {isLive ? 'Live' : 'Paused'}
          </button>
          <button
            onClick={fetchIPInfo}
            className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>
      </div>

      {/* IP Info Cards with Live Refresh Indicator */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="card border-white/10 bg-white/5 p-3 relative">
          {isLive && ipInfo?.status === 'online' && (
            <div className="absolute -top-1 -right-1">
              <span className="flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blaze-400" />
            <span className="text-xs text-slate-400">Public IP</span>
          </div>
          <div className="mt-1 font-mono text-sm text-white truncate">
            {ipLoading ? 'Loading...' : ipInfo?.ip || 'N/A'}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-500">
            {ipInfo?.city}, {ipInfo?.country}
          </div>
        </div>
        
        <div className="card border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-sky-400" />
            <span className="text-xs text-slate-400">Local IP</span>
          </div>
          <div className="mt-1 font-mono text-sm text-white truncate">
            {ipLoading ? 'Loading...' : ipInfo?.localIP || 'N/A'}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-500">
            {ipInfo?.isp || 'Local Network'}
          </div>
        </div>
        
        <div className="card border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-slate-400">Location</span>
          </div>
          <div className="mt-1 text-sm font-medium text-white truncate">
            {ipLoading ? 'Loading...' : `${ipInfo?.city}, ${ipInfo?.region}`}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-500">
            {ipInfo?.country} {ipInfo?.country_code && `(${ipInfo.country_code})`}
          </div>
        </div>
        
        <div className="card border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <WifiIcon className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-slate-400">ISP</span>
          </div>
          <div className="mt-1 text-sm font-medium text-white truncate">
            {ipLoading ? 'Loading...' : ipInfo?.isp || 'Unknown'}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-500">
            ASN: {ipInfo?.asn || 'Unknown'}
          </div>
        </div>
        
        <div className="card border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2">
            {ipInfo?.status === 'online' ? (
              <Wifi className="h-4 w-4 text-emerald-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-400" />
            )}
            <span className="text-xs text-slate-400">Status</span>
          </div>
          <div className="mt-1 text-sm font-semibold">
            {ipInfo?.status === 'online' ? (
              <span className="text-emerald-400">Online</span>
            ) : (
              <span className="text-red-400">Offline</span>
            )}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-500">
            {ipInfo?.responseTime}ms • {refreshCount} refreshes
          </div>
        </div>
        
        <div className="card border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-slate-400">Location DB</span>
          </div>
          <div className="mt-1 text-sm font-medium truncate">
            {isSavingLocation ? (
              <span className="text-amber-400">Saving...</span>
            ) : locationSaved ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Saved
              </span>
            ) : saveError ? (
              <span className="text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Error
              </span>
            ) : ipInfo?.city !== 'Unknown' ? (
              <span className="text-slate-300">Ready to save</span>
            ) : (
              <span className="text-slate-500">Waiting...</span>
            )}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-500">
            {saveError ? saveError.substring(0, 30) : (ipInfo?.source && ipInfo.source !== 'none' ? `Source: ${ipInfo.source}` : 'Auto-detect')}
          </div>
        </div>
      </div>

      {/* Last Updated Info */}
      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex items-center gap-2">
          <Zap className="h-3 w-3 text-amber-400" />
          <span>Last updated: {ipInfo?.lastUpdated ? new Date(ipInfo.lastUpdated).toLocaleTimeString() : 'Never'}</span>
          <span className="text-slate-600">•</span>
          <span>Refresh interval: 5s {isLive ? '(active)' : '(paused)'}</span>
          {ipInfo?.source && ipInfo.source !== 'none' && (
            <>
              <span className="text-slate-600">•</span>
              <span>Source: {ipInfo.source}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {ipInfo?.lat && ipInfo?.lon && ipInfo.lat !== 0 && ipInfo.lon !== 0 && (
            <a 
              href={`https://maps.google.com/maps?q=${ipInfo.lat},${ipInfo.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blaze-400 hover:text-blaze-300 transition-colors"
            >
              View on Map →
            </a>
          )}
        </div>
      </div>

      {/* Stat Cards - Now 8 cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card group border-white/10 bg-white/5 p-3 transition-all hover:border-blaze-500/40 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <c.icon className={`h-4 w-4 ${c.color}`} strokeWidth={1.8} />
              <ArrowRight className="h-3 w-3 text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-blaze-400" />
            </div>
            <div className="mt-2 text-xl font-extrabold text-white">{c.value}</div>
            <div className="mt-0.5 text-[8px] font-medium uppercase tracking-wider text-slate-500">{c.label}</div>
          </Link>
        ))}
      </div>

      {/* Growth Chart */}
      <div className="mt-6 card border-white/10 bg-white/5 p-4 sm:p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
          <TrendingUp className="h-4 w-4 text-blaze-400" /> Growth Overview
        </h2>
        <div className="mt-4">
          <GrowthChart data={growthData} />
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Blog Status Chart */}
        <div className="card border-white/10 bg-white/5 p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <BarChart3 className="h-4 w-4 text-blaze-400" /> Blog Status
          </h2>
          <div className="mt-4">
            <div className="space-y-3">
              {blogsByStatus.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(item.value / Math.max(...blogsByStatus.map(d => d.value), 1)) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Circular Progress Indicators */}
        <div className="card border-white/10 bg-white/5 p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <PieChart className="h-4 w-4 text-blaze-400" /> Progress
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <CircleProgress 
              value={stats?.publishedBlogs ?? 0} 
              max={10} 
              label="Blogs" 
              color="#22c55e"
              icon={FileText}
            />
            <CircleProgress 
              value={stats?.projects ?? 0} 
              max={8} 
              label="Projects" 
              color="#0ea5e9"
              icon={FolderKanban}
            />
            <CircleProgress 
              value={stats?.totalSubscribers ?? 0} 
              max={50} 
              label="Subscribers" 
              color="#ec4899"
              icon={UserPlus}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card border-white/10 bg-white/5 p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Activity className="h-4 w-4 text-blaze-400" /> Quick Stats
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-sm text-slate-400">Total Users</span>
              <span className="text-sm font-bold text-white">{stats?.totalUsers ?? 0}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-sm text-slate-400">Active Users</span>
              <span className="text-sm font-bold text-emerald-400">{stats?.activeUsers ?? 0}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-sm text-slate-400">Total Subscribers</span>
              <span className="text-sm font-bold text-pink-400">{stats?.totalSubscribers ?? 0}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-sm text-slate-400">Active Subscribers</span>
              <span className="text-sm font-bold text-pink-400">{stats?.activeSubscribers ?? 0}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-sm text-slate-400">Pricing Plans</span>
              <span className="text-sm font-bold text-amber-400">{stats?.totalPricingPlans ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Messages</span>
              <span className="text-sm font-bold text-blaze-400">{stats?.contacts ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Recent blogs */}
        <div className="card border-white/10 bg-white/5 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <FileText className="h-4 w-4 text-blaze-400" /> Recent Blogs
            </h2>
            <Link to="/admin/blogs" className="text-xs text-blaze-400 hover:text-blaze-300">View all</Link>
          </div>
          <div className="mt-4 space-y-2">
            {recentBlogs.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">No blogs yet</p>
            ) : (
              recentBlogs.map((b) => (
                <Link key={b.id} to="/admin/blogs" className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-200">{b.title}</div>
                    <div className="text-xs text-slate-500">{formatDate(b.created_at)}</div>
                  </div>
                  <span className={`ml-3 flex-none rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    b.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 
                    b.status === 'draft' ? 'bg-amber-500/15 text-amber-400' :
                    'bg-gray-500/15 text-gray-400'
                  }`}>
                    {b.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent contacts */}
        <div className="card border-white/10 bg-white/5 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <Mail className="h-4 w-4 text-blaze-400" /> Recent Messages
            </h2>
            <Link to="/admin/contacts" className="text-xs text-blaze-400 hover:text-blaze-300">View all</Link>
          </div>
          <div className="mt-4 space-y-2">
            {recentContacts.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">No messages yet</p>
            ) : (
              recentContacts.map((c) => (
                <Link key={c.id} to="/admin/contacts" className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {!c.is_read && <span className="inline-block h-1.5 w-1.5 rounded-full bg-blaze-500 flex-none" />}
                      <span className="truncate text-sm font-medium text-slate-200">{c.name}</span>
                    </div>
                    <div className="text-xs text-slate-500">{formatDateTime(c.created_at)}</div>
                  </div>
                  <span className="ml-3 truncate text-xs text-slate-400 max-w-[80px] sm:max-w-[120px]">{c.email}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}