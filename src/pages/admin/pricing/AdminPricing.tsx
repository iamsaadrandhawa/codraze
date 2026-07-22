import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, 
  ArrowUpDown, Search, X, Check, 
  DollarSign, Calendar, Tag, 
  ArrowUp, ArrowDown, Copy, 
  MoreVertical, CheckCircle2,
  AlertCircle, RefreshCw
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { PricingPlan } from '../../../lib/types';
import { formatDate } from '../../../lib/utils';

export default function AdminPricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField] = useState<keyof PricingPlan>('display_order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for add/edit
  const [formData, setFormData] = useState<Partial<PricingPlan>>({
    name: '',
    slug: '',
    description: '',
    price: '',
    period: 'project',
    features: [],
    cta_text: 'Get Started',
    cta_url: '/contact',
    is_featured: false,
    is_active: true,
    display_order: 1,
    status: 'published'
  });

  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pricing')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof PricingPlan) => {
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
        .from('pricing')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPlans(plans.filter(p => p.id !== id));
      setShowDeleteModal(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('pricing')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      setPlans(plans.map(p => 
        p.id === id ? { ...p, is_active: !currentStatus } : p
      ));
    } catch (error) {
      console.error('Error toggling plan status:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedPlan) {
        // Update existing
        const { error } = await supabase
          .from('pricing')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedPlan.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('pricing')
          .insert([{
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
      }

      await fetchPlans();
      setShowEditModal(false);
      setSelectedPlan(null);
      resetForm();
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      period: 'project',
      features: [],
      cta_text: 'Get Started',
      cta_url: '/contact',
      is_featured: false,
      is_active: true,
      display_order: plans.length + 1,
      status: 'published'
    });
    setFeatureInput('');
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: (formData.features || []).filter((_, i) => i !== index)
    });
  };

  const openEditModal = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setFormData(plan);
    setShowEditModal(true);
  };

  const openDeleteModal = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setShowDeleteModal(true);
  };

  // Filter and sort plans
  const filteredPlans = plans
    .filter(plan => {
      const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.price.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && plan.is_active) ||
                           (filterStatus === 'inactive' && !plan.is_active);
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
          <h1 className="text-2xl font-bold text-white">Pricing Plans</h1>
          <p className="mt-1 text-sm text-slate-400">Manage your pricing plans and subscription tiers</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setSelectedPlan(null);
            setShowEditModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/30 transition-all hover:from-orange-400 hover:to-orange-500 hover:shadow-orange-600/40"
        >
          <Plus className="h-4 w-4" />
          Add Plan
        </button>
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
            Inactive
          </button>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search plans..."
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
                    onClick={() => handleSort('display_order')}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    Order
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    Plan Name
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    Price
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Period
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Features
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <button
                    onClick={() => handleSort('is_featured')}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    Featured
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-slate-500" />
                      <p>No pricing plans found</p>
                      <button
                        onClick={() => {
                          resetForm();
                          setSelectedPlan(null);
                          setShowEditModal(true);
                        }}
                        className="mt-2 inline-flex items-center gap-2 rounded-lg bg-orange-500/20 px-4 py-2 text-sm text-orange-400 hover:bg-orange-500/30"
                      >
                        <Plus className="h-4 w-4" />
                        Create your first plan
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan) => (
                  <tr key={plan.id} className="transition-colors hover:bg-white/5">
                    <td className="px-4 py-3 text-sm text-slate-300">{plan.display_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {plan.is_featured && (
                          <CheckCircle2 className="h-4 w-4 text-amber-400" />
                        )}
                        <span className="font-medium text-white">{plan.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-white">{plan.price}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{plan.period}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {plan.features?.slice(0, 3).map((feature, i) => (
                          <span key={i} className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                            {feature}
                          </span>
                        ))}
                        {plan.features && plan.features.length > 3 && (
                          <span className="text-xs text-slate-500">+{plan.features.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {plan.is_featured ? (
                        <span className="rounded-full bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-400">
                          Featured
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(plan.id, plan.is_active)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                          plan.is_active
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(plan)}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(plan)}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0f1e] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Delete Pricing Plan</h3>
            <p className="mt-2 text-sm text-slate-400">
              Are you sure you want to delete <span className="font-medium text-white">{selectedPlan.name}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedPlan.id)}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0a0f1e] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {selectedPlan ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedPlan(null);
                  resetForm();
                }}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Starter, Pro, Enterprise"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="e.g., starter, pro, enterprise"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this plan"
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 resize-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                    Price *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., $49, $99, Custom"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                    Period *
                  </label>
                  <select
                    value={formData.period || 'project'}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="project">Project</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                    <option value="quote">Quote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                  Features
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                    placeholder="Add a feature..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="rounded-xl bg-orange-500/20 px-4 py-2.5 text-sm text-orange-400 transition-colors hover:bg-orange-500/30"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.features?.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-slate-300"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                    CTA Text
                  </label>
                  <input
                    type="text"
                    value={formData.cta_text || 'Get Started'}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    placeholder="e.g., Get Started, Buy Now"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                    CTA URL
                  </label>
                  <input
                    type="text"
                    value={formData.cta_url || '/contact'}
                    onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                    placeholder="e.g., /contact, /signup"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured || false}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500/20"
                  />
                  <span className="text-sm text-slate-400">Featured Plan</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active !== false}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500/20"
                  />
                  <span className="text-sm text-slate-400">Active</span>
                </label>
                <div>
                  <label className="mr-2 text-xs text-slate-400">Display Order:</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.display_order || 1}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                    className="w-16 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white outline-none transition-all focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedPlan(null);
                    resetForm();
                  }}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-orange-400 hover:to-orange-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : selectedPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}