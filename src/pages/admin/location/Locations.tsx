import { useEffect, useState } from 'react';
import { 
  MapPin, Globe, Users, Eye, Activity, 
  RefreshCw, Download, Search, Filter,
  Clock, Server, Wifi, WifiOff,
  CheckCircle, AlertCircle, Database,
  BarChart3, PieChart, TrendingUp,
  MousePointer, Smartphone, Monitor,
  Chrome, Apple, Terminal, Shield, Layers,
  ChevronDown, ChevronRight, ExternalLink,
  Info, User, Link as LinkIcon, Calendar,
  Satellite, Crosshair, Navigation, Target
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { formatDateTime } from '../../../lib/utils';

interface VisitorLocation {
  id: string;
  ip_address: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  isp: string;
  org: string;
  timezone: string;
  latitude: number;
  longitude: number;
  accuracy: 'gps' | 'ip' | 'unknown';
  gps_available: boolean;
  user_agent: string;
  referrer: string;
  page_url: string;
  device_type: string;
  browser: string;
  os: string;
  visited_at: string;
  created_at: string;
}

interface Stats {
  totalVisitors: number;
  uniqueVisitors: number;
  totalCountries: number;
  totalCities: number;
  deviceBreakdown: { [key: string]: number };
  browserBreakdown: { [key: string]: number };
  osBreakdown: { [key: string]: number };
  topCountries: { country: string; count: number }[];
  accuracyBreakdown: { [key: string]: number };
  gpsAvailable: number;
  recentVisitors: VisitorLocation[];
}

export default function Locations() {
  const [visitors, setVisitors] = useState<VisitorLocation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState<string>('All');
  const [filterDevice, setFilterDevice] = useState<string>('All');
  const [filterAccuracy, setFilterAccuracy] = useState<string>('All');
  const [countries, setCountries] = useState<string[]>([]);
  const [devices, setDevices] = useState<string[]>([]);
  const [accuracyOptions, setAccuracyOptions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'visitors'>('overview');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data: visitorData, error: visitorError } = await supabase
        .from('visitor_locations')
        .select('*')
        .order('visited_at', { ascending: false });

      if (visitorError) {
        console.error('Error fetching visitors:', visitorError);
        return;
      }

      if (visitorData) {
        setVisitors(visitorData);

        const uniqueIPs = new Set(visitorData.map(v => v.ip_address));
        const countrySet = new Set(visitorData.map(v => v.country).filter(c => c && c !== 'Unknown'));
        const citySet = new Set(visitorData.map(v => v.city).filter(c => c && c !== 'Unknown'));
        
        const deviceCount: { [key: string]: number } = {};
        const browserCount: { [key: string]: number } = {};
        const osCount: { [key: string]: number } = {};
        const countryCount: { [key: string]: number } = {};
        const accuracyCount: { [key: string]: number } = {};
        let gpsAvailable = 0;

        visitorData.forEach(v => {
          deviceCount[v.device_type] = (deviceCount[v.device_type] || 0) + 1;
          browserCount[v.browser] = (browserCount[v.browser] || 0) + 1;
          osCount[v.os] = (osCount[v.os] || 0) + 1;
          if (v.country && v.country !== 'Unknown') {
            countryCount[v.country] = (countryCount[v.country] || 0) + 1;
          }
          if (v.accuracy) {
            accuracyCount[v.accuracy] = (accuracyCount[v.accuracy] || 0) + 1;
          }
          if (v.gps_available) {
            gpsAvailable++;
          }
        });

        const topCountries = Object.entries(countryCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([country, count]) => ({ country, count }));

        setStats({
          totalVisitors: visitorData.length,
          uniqueVisitors: uniqueIPs.size,
          totalCountries: countrySet.size,
          totalCities: citySet.size,
          deviceBreakdown: deviceCount,
          browserBreakdown: browserCount,
          osBreakdown: osCount,
          topCountries: topCountries,
          accuracyBreakdown: accuracyCount,
          gpsAvailable: gpsAvailable,
          recentVisitors: visitorData.slice(0, 10)
        });

        setCountries(['All', ...Array.from(countrySet).sort()]);
        setDevices(['All', ...Object.keys(deviceCount).sort()]);
        setAccuracyOptions(['All', ...Object.keys(accuracyCount).sort()]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getGoogleMapsUrl = (lat: number, lon: number) => {
    return `https://www.google.com/maps?q=${lat},${lon}`;
  };

  const getOpenStreetMapUrl = (lat: number, lon: number) => {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=12`;
  };

  const getAccuracyBadge = (accuracy: string) => {
    switch (accuracy) {
      case 'gps':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
            <Satellite className="h-3 w-3" />
            GPS
          </span>
        );
      case 'ip':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-400">
            <Wifi className="h-3 w-3" />
            IP
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2.5 py-1 text-xs font-medium text-red-400">
            <AlertCircle className="h-3 w-3" />
            Unknown
          </span>
        );
    }
  };

  const filteredVisitors = visitors
    .filter(v => {
      const matchesSearch = 
        v.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.isp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.browser?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.os?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = filterCountry === 'All' || v.country === filterCountry;
      const matchesDevice = filterDevice === 'All' || v.device_type === filterDevice;
      const matchesAccuracy = filterAccuracy === 'All' || v.accuracy === filterAccuracy;
      return matchesSearch && matchesCountry && matchesDevice && matchesAccuracy;
    });

  const exportCSV = () => {
    const headers = ['IP', 'City', 'Region', 'Country', 'ISP', 'Accuracy', 'GPS Available', 'Device', 'Browser', 'OS', 'Referrer', 'Page', 'Visited At'];
    const rows = filteredVisitors.map(v => [
      v.ip_address,
      v.city,
      v.region,
      v.country,
      v.isp,
      v.accuracy || 'unknown',
      v.gps_available ? 'Yes' : 'No',
      v.device_type,
      v.browser,
      v.os,
      v.referrer,
      v.page_url,
      formatDateTime(v.visited_at)
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitors_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-blaze-500" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Visitor Locations</h1>
          <p className="mt-1 text-sm text-slate-400">Track where your website visitors are coming from</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <Users className="h-5 w-5 text-blaze-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-white">{stats.totalVisitors}</div>
              <div className="text-xs text-slate-400">Total Visits</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <Eye className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-400">{stats.uniqueVisitors}</div>
              <div className="text-xs text-slate-400">Unique Visitors</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <Globe className="h-5 w-5 text-amber-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-amber-400">{stats.totalCountries}</div>
              <div className="text-xs text-slate-400">Countries</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <MapPin className="h-5 w-5 text-sky-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-sky-400">{stats.totalCities}</div>
              <div className="text-xs text-slate-400">Cities</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <Satellite className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-400">
                {stats.accuracyBreakdown?.gps || 0}
              </div>
              <div className="text-xs text-slate-400">GPS Location</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <Wifi className="h-5 w-5 text-amber-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-amber-400">
                {stats.accuracyBreakdown?.ip || 0}
              </div>
              <div className="text-xs text-slate-400">IP Location</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <Crosshair className="h-5 w-5 text-sky-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-sky-400">
                {stats.gpsAvailable || 0}
              </div>
              <div className="text-xs text-slate-400">GPS Available</div>
            </div>
          </div>

          {/* Accuracy Legend */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-blaze-400" />
              Location Accuracy Types
            </h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                  <Satellite className="h-3 w-3" />
                  GPS
                </span>
                <span className="text-xs text-slate-400">Most accurate (5-10 meters)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-400">
                  <Wifi className="h-3 w-3" />
                  IP
                </span>
                <span className="text-xs text-slate-400">City/Region level</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  Unknown
                </span>
                <span className="text-xs text-slate-400">Location not available</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tabs */}
      <div className="mt-4 flex gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-orange-500/20 text-orange-400'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <BarChart3 className="inline h-4 w-4 mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('visitors')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'visitors'
              ? 'bg-orange-500/20 text-orange-400'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Users className="inline h-4 w-4 mr-2" />
          Visitors ({stats?.totalVisitors || 0})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Globe className="h-4 w-4 text-amber-400" />
                Top Countries
              </h3>
              <div className="mt-4 space-y-2">
                {stats.topCountries.map((item) => (
                  <div key={item.country} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{item.country}</span>
                    <span className="text-sm font-medium text-white">{item.count}</span>
                  </div>
                ))}
                {stats.topCountries.length === 0 && (
                  <p className="text-sm text-slate-500">No data yet</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Smartphone className="h-4 w-4 text-purple-400" />
                Device Breakdown
              </h3>
              <div className="mt-4 space-y-2">
                {Object.entries(stats.deviceBreakdown).map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{device}</span>
                    <span className="text-sm font-medium text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Chrome className="h-4 w-4 text-sky-400" />
                Browser Breakdown
              </h3>
              <div className="mt-4 space-y-2">
                {Object.entries(stats.browserBreakdown).map(([browser, count]) => (
                  <div key={browser} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{browser}</span>
                    <span className="text-sm font-medium text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Layers className="h-4 w-4 text-emerald-400" />
                OS Breakdown
              </h3>
              <div className="mt-4 space-y-2">
                {Object.entries(stats.osBreakdown).map(([os, count]) => (
                  <div key={os} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{os}</span>
                    <span className="text-sm font-medium text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Users className="h-4 w-4 text-blaze-400" />
                Recent Visitors
              </h3>
              <button
                onClick={() => setActiveTab('visitors')}
                className="text-xs text-orange-400 hover:text-orange-300"
              >
                View All →
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {stats.recentVisitors.slice(0, 5).map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <div>
                    <div className="text-sm font-medium text-white">{v.city}, {v.country}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      {v.accuracy === 'gps' && <Satellite className="h-3 w-3 text-emerald-400" />}
                      {v.device_type} • {v.browser}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">{formatDateTime(v.visited_at)}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[150px]">{v.ip_address}</div>
                  </div>
                </div>
              ))}
              {stats.recentVisitors.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No visitors yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Visitors Tab */}
      {activeTab === 'visitors' && (
        <div className="mt-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none"
              >
                {countries.map(c => (
                  <option key={c} value={c} className="bg-slate-800">{c}</option>
                ))}
              </select>
              <select
                value={filterDevice}
                onChange={(e) => setFilterDevice(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none"
              >
                {devices.map(d => (
                  <option key={d} value={d} className="bg-slate-800">{d}</option>
                ))}
              </select>
              <select
                value={filterAccuracy}
                onChange={(e) => setFilterAccuracy(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none"
              >
                {accuracyOptions.map(a => (
                  <option key={a} value={a} className="bg-slate-800">{a}</option>
                ))}
              </select>
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by IP, city, country..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-xs text-slate-400">
            Showing {filteredVisitors.length} of {visitors.length} visitors
          </div>

          {/* Visitors Table with Expandable Rows */}
          <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400 w-8"></th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">IP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Accuracy</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">ISP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Device</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Browser / OS</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Visited At</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredVisitors.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                        No visitors found
                      </td>
                    </tr>
                  ) : (
                    filteredVisitors.map((v) => (
                      <>
                        <tr key={v.id} className="transition-colors hover:bg-white/5">
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleRow(v.id)}
                              className="text-slate-400 hover:text-white transition-colors"
                            >
                              {expandedRow === v.id ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-3 font-mono text-sm text-white">{v.ip_address}</td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="text-sm text-white">{v.city}</div>
                              <div className="text-xs text-slate-400">{v.country}</div>
                              {v.latitude && v.longitude && v.latitude !== 0 && v.longitude !== 0 && (
                                <div className="text-[10px] text-slate-500">
                                  {v.latitude.toFixed(4)}, {v.longitude.toFixed(4)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {getAccuracyBadge(v.accuracy)}
                            {v.gps_available && (
                              <div className="text-[10px] text-emerald-500 mt-0.5">GPS Available</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-300 max-w-[150px] truncate">{v.isp}</td>
                          <td className="px-4 py-3 text-sm text-slate-300">{v.device_type}</td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="text-sm text-slate-300">{v.browser}</div>
                              <div className="text-xs text-slate-500">{v.os}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-400">
                            {formatDateTime(v.visited_at)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {v.latitude && v.longitude && v.latitude !== 0 && v.longitude !== 0 && (
                                <a
                                  href={getGoogleMapsUrl(v.latitude, v.longitude)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                  title="View on Google Maps"
                                >
                                  <MapPin className="h-3 w-3" />
                                  Map
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                        {/* Expanded Row */}
                        {expandedRow === v.id && (
                          <tr>
                            <td colSpan={9} className="px-4 py-4 bg-white/5">
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                                {/* Location Details */}
                                <div className="space-y-1">
                                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> Location
                                  </h4>
                                  <div className="text-sm text-white">{v.city}, {v.region}</div>
                                  <div className="text-xs text-slate-400">{v.country} ({v.country_code})</div>
                                  {v.latitude && v.longitude && v.latitude !== 0 && v.longitude !== 0 && (
                                    <div className="text-xs text-slate-500">
                                      Lat: {v.latitude.toFixed(6)}, Lon: {v.longitude.toFixed(6)}
                                    </div>
                                  )}
                                  <div className="text-xs text-slate-500">Timezone: {v.timezone}</div>
                                </div>

                                {/* Accuracy Details */}
                                <div className="space-y-1">
                                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                    <Target className="h-3 w-3" /> Accuracy
                                  </h4>
                                  <div>{getAccuracyBadge(v.accuracy)}</div>
                                  <div className="text-xs text-slate-400">
                                    {v.gps_available ? (
                                      <span className="text-emerald-400">✓ GPS was available</span>
                                    ) : (
                                      <span className="text-amber-400">No GPS data</span>
                                    )}
                                  </div>
                                  {v.accuracy === 'gps' && (
                                    <div className="text-xs text-emerald-400">High accuracy (5-10m)</div>
                                  )}
                                  {v.accuracy === 'ip' && (
                                    <div className="text-xs text-amber-400">City/Region level</div>
                                  )}
                                </div>

                                {/* ISP Details */}
                                <div className="space-y-1">
                                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                    <Server className="h-3 w-3" /> ISP
                                  </h4>
                                  <div className="text-sm text-white">{v.isp}</div>
                                  <div className="text-xs text-slate-400">Organization: {v.org}</div>
                                </div>

                                {/* Device Details */}
                                <div className="space-y-1">
                                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                    <Smartphone className="h-3 w-3" /> Device
                                  </h4>
                                  <div className="text-sm text-white">{v.device_type}</div>
                                  <div className="text-xs text-slate-400">Browser: {v.browser}</div>
                                  <div className="text-xs text-slate-400">OS: {v.os}</div>
                                </div>

                                {/* Page Details */}
                                <div className="space-y-1">
                                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                    <LinkIcon className="h-3 w-3" /> Page
                                  </h4>
                                  <div className="text-xs text-slate-400 truncate">
                                    <a 
                                      href={v.page_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                    >
                                      {v.page_url}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>
                                  <div className="text-xs text-slate-500">Referrer: {v.referrer || 'Direct'}</div>
                                  <div className="text-xs text-slate-500">Visited: {formatDateTime(v.visited_at)}</div>
                                  {v.user_agent && (
                                    <div className="text-xs text-slate-500 truncate" title={v.user_agent}>
                                      UA: {v.user_agent.substring(0, 50)}...
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* View on Map Buttons */}
                              {v.latitude && v.longitude && v.latitude !== 0 && v.longitude !== 0 && (
                                <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-white/10">
                                  <a
                                    href={getGoogleMapsUrl(v.latitude, v.longitude)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/20 px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                  >
                                    <MapPin className="h-4 w-4" />
                                    View on Google Maps
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                  <a
                                    href={getOpenStreetMapUrl(v.latitude, v.longitude)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg bg-sky-500/20 px-3 py-2 text-sm font-medium text-sky-400 hover:bg-sky-500/30 transition-colors"
                                  >
                                    <MapPin className="h-4 w-4" />
                                    View on OpenStreetMap
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        `${v.city}, ${v.country}\nLat: ${v.latitude}, Lon: ${v.longitude}\nIP: ${v.ip_address}\nAccuracy: ${v.accuracy}`
                                      );
                                    }}
                                    className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/20 transition-colors"
                                  >
                                    Copy Location
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}