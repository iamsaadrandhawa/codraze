import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, X, Mail, Calendar, Users, 
  UserCheck, UserX, Activity, 
  ArrowUpDown, Download, Trash2,
  RefreshCw, AlertCircle, Check,
  Clock, Globe, MapPin, Filter
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Subscriber } from '../../../lib/types';
import { formatDate, formatDateTime } from '../../../lib/utils';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField] = useState<keyof Subscriber>('subscribed_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof Subscriber) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSubscribers(subscribers.filter(s => s.id !== id));
      setShowDeleteModal(false);
      setSelectedSubscriber(null);
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const { error } = await supabase
        .from('subscribers')
        .update({ 
          status: newStatus,
          unsubscribed_at: newStatus === 'inactive' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      setSubscribers(subscribers.map(s => 
        s.id === id ? { ...s, status: newStatus, unsubscribed_at: newStatus === 'inactive' ? new Date().toISOString() : null } : s
      ));
    } catch (error) {
      console.error('Error toggling subscriber status:', error);
    }
  };

  const exportCSV = () => {
    const headers = ['Email', 'Status', 'Subscribed At', 'Unsubscribed At', 'IP Address'];
    const rows = filteredSubscribers.map(s => [
      s.email,
      s.status,
      s.subscribed_at,
      s.unsubscribed_at || '',
      s.ip_address || ''
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stats
  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(s => s.status === 'active').length;
  const inactiveSubscribers = subscribers.filter(s => s.status === 'inactive').length;
  const newThisMonth = subscribers.filter(s => {
    const date = new Date(s.subscribed_at);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  // Filter and sort subscribers
  const filteredSubscribers = subscribers
    .filter(s => {
      const matchesSearch = s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (s.ip_address && s.ip_address.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscribers</h1>
          <p className="mt-1 text-sm text-slate-400">Manage your email subscribers and newsletter list</p>
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
            onClick={fetchSubscribers}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <Users className="h-5 w-5 text-blaze-400" />
            <span className="text-xs text-slate-500">Total</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{totalSubscribers}</div>
          <div className="text-xs text-slate-400">Total Subscribers</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <UserCheck className="h-5 w-5 text-emerald-400" />
            <span className="text-xs text-slate-500">Active</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">{activeSubscribers}</div>
          <div className="text-xs text-slate-400">Active Subscribers</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <UserX className="h-5 w-5 text-red-400" />
            <span className="text-xs text-slate-500">Inactive</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-red-400">{inactiveSubscribers}</div>
          <div className="text-xs text-slate-400">Inactive Subscribers</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <Calendar className="h-5 w-5 text-amber-400" />
            <span className="text-xs text-slate-500">New</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400">{newThisMonth}</div>
          <div className="text-xs text-slate-400">New This Month</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              filterStatus === 'all'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              filterStatus === 'active'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            <UserCheck className="inline h-3 w-3 mr-1" />
            Active
          </button>
          <button
            onClick={() => setFilterStatus('inactive')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              filterStatus === 'inactive'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            <UserX className="inline h-3 w-3 mr-1" />
            Inactive
          </button>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by email or IP..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    Email
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    Status
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <button
                    onClick={() => handleSort('subscribed_at')}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    Subscribed
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  IP Address
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Loading subscribers...
                    </div>
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Mail className="h-8 w-8 text-slate-500" />
                      <p>No subscribers found</p>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="mt-2 text-sm text-orange-400 hover:text-orange-300"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="transition-colors hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-white">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(subscriber.id, subscriber.status)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                          subscriber.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {subscriber.status === 'active' ? (
                          <><Check className="inline h-3 w-3 mr-1" /> Active</>
                        ) : (
                          <><X className="inline h-3 w-3 mr-1" /> Inactive</>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-300">
                        {formatDateTime(subscriber.subscribed_at)}
                      </div>
                      {subscriber.unsubscribed_at && (
                        <div className="text-xs text-red-400">
                          Unsubscribed: {formatDate(subscriber.unsubscribed_at)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-slate-400">
                        <Globe className="h-3.5 w-3.5" />
                        {subscriber.ip_address || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedSubscriber(subscriber);
                            setShowDetails(true);
                          }}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                          title="View Details"
                        >
                          <Activity className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSubscriber(subscriber);
                            setShowDeleteModal(true);
                          }}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscriber Details Modal */}
      {showDetails && selectedSubscriber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0f1e] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Subscriber Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <div className="text-xs text-slate-500">Email</div>
                <div className="text-sm font-medium text-white">{selectedSubscriber.email}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Status</div>
                <div className={`text-sm font-medium ${selectedSubscriber.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selectedSubscriber.status}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Subscribed At</div>
                <div className="text-sm text-white">{formatDateTime(selectedSubscriber.subscribed_at)}</div>
              </div>
              {selectedSubscriber.unsubscribed_at && (
                <div>
                  <div className="text-xs text-slate-500">Unsubscribed At</div>
                  <div className="text-sm text-red-400">{formatDateTime(selectedSubscriber.unsubscribed_at)}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-slate-500">IP Address</div>
                <div className="text-sm text-white">{selectedSubscriber.ip_address || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">User Agent</div>
                <div className="text-sm text-slate-400 break-all">{selectedSubscriber.user_agent || 'N/A'}</div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => handleToggleStatus(selectedSubscriber.id, selectedSubscriber.status)}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-colors ${
                  selectedSubscriber.status === 'active'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {selectedSubscriber.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedSubscriber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0f1e] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Delete Subscriber</h3>
            <p className="mt-2 text-sm text-slate-400">
              Are you sure you want to delete <span className="font-medium text-white">{selectedSubscriber.email}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedSubscriber.id)}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}