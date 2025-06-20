import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Settings, Edit, Save, X, Plus } from 'lucide-react';

interface CommissionPlan {
  id: string;
  product_category: string;
  product_name: string;
  level_1_rate: number;
  level_2_rate: number;
  level_3_rate: number;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const CommissionPlans: React.FC = () => {
  const [plans, setPlans] = useState<CommissionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CommissionPlan>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState<Partial<CommissionPlan>>({
    product_category: '',
    product_name: '',
    level_1_rate: 0,
    level_2_rate: 0,
    level_3_rate: 0,
    is_active: true,
    notes: ''
  });

  useEffect(() => {
    loadCommissionPlans();
  }, []);

  const loadCommissionPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('commission_plans')
        .select('*')
        .order('product_name');

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error loading commission plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (plan: CommissionPlan) => {
    setEditingId(plan.id);
    setEditForm(plan);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('commission_plans')
        .update({
          product_category: editForm.product_category,
          product_name: editForm.product_name,
          level_1_rate: editForm.level_1_rate,
          level_2_rate: editForm.level_2_rate,
          level_3_rate: editForm.level_3_rate,
          is_active: editForm.is_active,
          notes: editForm.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      await loadCommissionPlans();
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating commission plan:', error);
    }
  };

  const addNewPlan = async () => {
    try {
      const { error } = await supabase
        .from('commission_plans')
        .insert([newPlan]);

      if (error) throw error;
      
      await loadCommissionPlans();
      setIsAddModalOpen(false);
      setNewPlan({
        product_category: '',
        product_name: '',
        level_1_rate: 0,
        level_2_rate: 0,
        level_3_rate: 0,
        is_active: true,
        notes: ''
      });
    } catch (error) {
      console.error('Error adding commission plan:', error);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('commission_plans')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      await loadCommissionPlans();
    } catch (error) {
      console.error('Error toggling plan status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Commission Plans</h1>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Plan</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Plans</h3>
            <p className="text-2xl font-bold">{plans.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Active Plans</h3>
            <p className="text-2xl font-bold text-green-400">
              {plans.filter(p => p.is_active).length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Avg L1 Rate</h3>
            <p className="text-2xl font-bold text-blue-400">
              {plans.length > 0 ? (plans.reduce((sum, p) => sum + p.level_1_rate, 0) / plans.length).toFixed(1) : 0}%
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Categories</h3>
            <p className="text-2xl font-bold text-purple-400">
              {new Set(plans.map(p => p.product_category)).size}
            </p>
          </div>
        </div>

        {/* Commission Plans Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">Commission Structure</h2>
            <p className="text-gray-400 mt-1">Manage commission rates for different products and levels</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Level 1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Level 2
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Level 3
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-700">
                    {editingId === plan.id ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={editForm.product_name || ''}
                            onChange={(e) => setEditForm({...editForm, product_name: e.target.value})}
                            className="input-field w-full text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={editForm.product_category || ''}
                            onChange={(e) => setEditForm({...editForm, product_category: e.target.value})}
                            className="input-field w-full text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.level_1_rate || 0}
                              onChange={(e) => setEditForm({...editForm, level_1_rate: parseFloat(e.target.value)})}
                              className="input-field w-16 text-sm"
                            />
                            <span className="text-gray-400">%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.level_2_rate || 0}
                              onChange={(e) => setEditForm({...editForm, level_2_rate: parseFloat(e.target.value)})}
                              className="input-field w-16 text-sm"
                            />
                            <span className="text-gray-400">%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.level_3_rate || 0}
                              onChange={(e) => setEditForm({...editForm, level_3_rate: parseFloat(e.target.value)})}
                              className="input-field w-16 text-sm"
                            />
                            <span className="text-gray-400">%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editForm.is_active || false}
                              onChange={(e) => setEditForm({...editForm, is_active: e.target.checked})}
                              className="mr-2"
                            />
                            <span className="text-sm">Active</span>
                          </label>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => saveEdit(plan.id)}
                              className="text-green-400 hover:text-green-300"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-gray-400 hover:text-gray-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">{plan.product_name}</div>
                            {plan.notes && (
                              <div className="text-sm text-gray-400">{plan.notes}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {plan.product_category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-blue-400">{plan.level_1_rate}%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-green-400">{plan.level_2_rate}%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-purple-400">{plan.level_3_rate}%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleActive(plan.id, plan.is_active)}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              plan.is_active 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {plan.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => startEdit(plan)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Plan Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add New Commission Plan</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={newPlan.product_name || ''}
                    onChange={(e) => setNewPlan({...newPlan, product_name: e.target.value})}
                    className="input-field w-full"
                    placeholder="e.g., New Product"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    value={newPlan.product_category || ''}
                    onChange={(e) => setNewPlan({...newPlan, product_category: e.target.value})}
                    className="input-field w-full"
                    placeholder="e.g., new_category"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Level 1 (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newPlan.level_1_rate || 0}
                      onChange={(e) => setNewPlan({...newPlan, level_1_rate: parseFloat(e.target.value)})}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Level 2 (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newPlan.level_2_rate || 0}
                      onChange={(e) => setNewPlan({...newPlan, level_2_rate: parseFloat(e.target.value)})}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Level 3 (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newPlan.level_3_rate || 0}
                      onChange={(e) => setNewPlan({...newPlan, level_3_rate: parseFloat(e.target.value)})}
                      className="input-field w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                  <textarea
                    value={newPlan.notes || ''}
                    onChange={(e) => setNewPlan({...newPlan, notes: e.target.value})}
                    className="input-field w-full"
                    rows={3}
                    placeholder="Optional notes about this commission plan"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewPlan}
                  className="btn btn-primary flex-1"
                >
                  Add Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionPlans; 