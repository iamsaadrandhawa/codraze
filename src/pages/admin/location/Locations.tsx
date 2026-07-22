import { useEffect, useState } from 'react';
import { 
  MapPin, Globe, Users, Eye, Activity, 
  RefreshCw, Download, Search, Filter,
  Clock, Server, Wifi, WifiOff,
  CheckCircle, AlertCircle, Database,
  BarChart3, PieChart, TrendingUp,
  MousePointer, Smartphone, Monitor,
  Chrome, Apple, Terminal, Shield, Layers
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
  recentVisitors: VisitorLocation[];
}

export default function Locations() {
  const [visitors, setVisitors] = useState<VisitorLocation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState<string>('All');
  const [filterDevice, setFilterDevice] = useState<string>('All');
  const [countries, setCountries] = useState<string[]>([]);
  const [devices, setDevices] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'visitors'>('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all visitors
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

        // Calculate stats
        const uniqueIPs = new Set(visitorData.map(v => v.ip_address));
        const countrySet = new Set(visitorData.map(v => v.country).filter(c => c && c !== 'Unknown'));
        const citySet = new Set(visitorData.map(v => v.city).filter(c => c && c !== 'Unknown'));
        
        const deviceCount: { [key: string]: number } = {};
        const browserCount: { [key: string]: number } = {};
        const osCount: { [key: string]: number } = {};
        const countryCount: { [key: string]: number } = {};

        visitorData.forEach(v => {
          deviceCount[v.device_type] = (deviceCount[v.device_type] || 0) + 1;
          browserCount[v.browser] = (browserCount[v.browser] || 0) + 1;
          osCount[v.os] = (osCount[v.os] || 0) + 1;
          if (v.country && v.country !== 'Unknown') {
            countryCount[v.country] = (countryCount[v.country] || 0) + 1;
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
          recentVisitors: visitorData.slice(0, 10)
        });

        setCountries(['All', ...Array.from(countrySet).sort()]);
        setDevices(['All', ...Object.keys(deviceCount).sort()]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVisitors = visitors
    .filter(v => {
      const matchesSearch = 
        v.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.isp?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = filterCountry === 'All' || v.country === filterCountry;
      const matchesDevice = filterDevice === 'All' || v.device_type === filterDevice;
      return matchesSearch && matchesCountry && matchesDevice;
    });

  const exportCSV = () => {
    const headers = ['IP', 'City', 'Region', 'Country', 'ISP', 'Device', 'Browser', 'OS', 'Referrer', 'Page', 'Visited At'];
    const rows = filteredVisitors.map(v => [
      v.ip_address,
      v.city,
      v.region,
      v.country,
      v.isp,
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
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
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
              <Smartphone className="h-5 w-5 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-purple-400">
              {Object.keys(stats.deviceBreakdown).length}
            </div>
            <div className="text-xs text-slate-400">Devices</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <Monitor className="h-5 w-5 text-pink-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-pink-400">
              {Object.keys(stats.browserBreakdown).length}
            </div>
            <div className="text-xs text-slate-400">Browsers</div>
          </div>
        </div>
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
          {/* Top Countries & Device Breakdown */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Top Countries */}
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

            {/* Device Breakdown */}
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
                {Object.keys(stats.deviceBreakdown).length === 0 && (
                  <p className="text-sm text-slate-500">No data yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Browser & OS Breakdown */}
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
                {Object.keys(stats.browserBreakdown).length === 0 && (
                  <p className="text-sm text-slate-500">No data yet</p>
                )}
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
                {Object.keys(stats.osBreakdown).length === 0 && (
                  <p className="text-sm text-slate-500">No data yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Visitors Preview */}
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
                    <div className="text-xs text-slate-500">{v.device_type} • {v.browser}</div>
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

          {/* Visitors Table */}
          <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">IP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">ISP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Device</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Browser / OS</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Visited At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredVisitors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                        No visitors found
                      </td>
                    </tr>
                  ) : (
                    filteredVisitors.map((v) => (
                      <tr key={v.id} className="transition-colors hover:bg-white/5">
                        <td className="px-4 py-3 font-mono text-sm text-white">{v.ip_address}</td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm text-white">{v.city}</div>
                            <div className="text-xs text-slate-400">{v.country}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">{v.isp}</td>
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
                      </tr>
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