import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, UserPlus, Crown, TrendingUp, DollarSign, Eye, Mail, Phone } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate: string;
  level: number;
  referrals: number;
  earnings: number;
  rank: string;
  status: 'active' | 'inactive' | 'pending';
  directReferrer?: string;
}

const Team: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [teamStats, setTeamStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalEarnings: 0,
    thisMonthGrowth: 0
  });

  useEffect(() => {
    fetchTeamData();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [teamMembers, searchTerm, levelFilter, statusFilter]);

  const fetchTeamData = async () => {
    try {
      // Mock team data for demonstration
      const mockTeamMembers: TeamMember[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '+1 (555) 123-4567',
          joinDate: '2024-01-15',
          level: 1,
          referrals: 8,
          earnings: 2450,
          rank: 'Gold',
          status: 'active',
          directReferrer: 'You'
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'michael@example.com',
          joinDate: '2024-02-03',
          level: 1,
          referrals: 5,
          earnings: 1890,
          rank: 'Silver',
          status: 'active',
          directReferrer: 'You'
        },
        {
          id: '3',
          name: 'Emma Davis',
          email: 'emma@example.com',
          joinDate: '2024-01-28',
          level: 2,
          referrals: 3,
          earnings: 1650,
          rank: 'Silver',
          status: 'active',
          directReferrer: 'Sarah Johnson'
        },
        {
          id: '4',
          name: 'James Wilson',
          email: 'james@example.com',
          joinDate: '2024-03-10',
          level: 1,
          referrals: 2,
          earnings: 1200,
          rank: 'Bronze',
          status: 'pending',
          directReferrer: 'You'
        },
        {
          id: '5',
          name: 'Lisa Rodriguez',
          email: 'lisa@example.com',
          joinDate: '2024-02-20',
          level: 2,
          referrals: 4,
          earnings: 980,
          rank: 'Bronze',
          status: 'active',
          directReferrer: 'Michael Chen'
        },
        {
          id: '6',
          name: 'David Kim',
          email: 'david@example.com',
          joinDate: '2024-03-05',
          level: 3,
          referrals: 1,
          earnings: 450,
          rank: 'Bronze',
          status: 'inactive',
          directReferrer: 'Emma Davis'
        }
      ];

      setTeamMembers(mockTeamMembers);
      
      // Calculate team stats
      const stats = {
        totalMembers: mockTeamMembers.length,
        activeMembers: mockTeamMembers.filter(m => m.status === 'active').length,
        totalEarnings: mockTeamMembers.reduce((sum, m) => sum + m.earnings, 0),
        thisMonthGrowth: 15 // Mock growth percentage
      };
      
      setTeamStats(stats);
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = teamMembers;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(member => member.level === parseInt(levelFilter));
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    setFilteredMembers(filtered);
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Diamond': return 'text-blue-400';
      case 'Platinum': return 'text-gray-300';
      case 'Gold': return 'text-yellow-400';
      case 'Silver': return 'text-gray-400';
      default: return 'text-amber-600';
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Diamond': return '💎';
      case 'Platinum': return '🏆';
      case 'Gold': return '🥇';
      case 'Silver': return '🥈';
      default: return '🥉';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-900/30 text-green-400';
      case 'inactive': return 'bg-red-900/30 text-red-400';
      case 'pending': return 'bg-yellow-900/30 text-yellow-400';
      default: return 'bg-gray-900/30 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rise-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-white mb-2 flex items-center">
            <Users className="mr-3 h-8 w-8 text-blue-400" />
            Team Management
          </h1>
          <p className="text-gray-400">Manage and support your downline network</p>
        </div>
        
        <button className="mt-4 lg:mt-0 btn btn-primary flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Invite New Member</span>
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">Total Members</h3>
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">{teamStats.totalMembers}</p>
          <div className="text-xs flex items-center text-green-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+{teamStats.thisMonthGrowth}% this month</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">Active Members</h3>
            <Crown className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">{teamStats.activeMembers}</p>
          <div className="text-xs text-gray-400">
            {Math.round((teamStats.activeMembers / teamStats.totalMembers) * 100)}% active rate
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">Team Earnings</h3>
            <DollarSign className="h-5 w-5 text-rise-gold" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">${teamStats.totalEarnings.toLocaleString()}</p>
          <div className="text-xs flex items-center text-green-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>Growing strong!</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">Avg. Performance</h3>
            <Eye className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            ${Math.round(teamStats.totalEarnings / teamStats.totalMembers).toLocaleString()}
          </p>
          <div className="text-xs text-gray-400">per member</div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Levels</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4+</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Team Members Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-xl text-white">Team Members</h2>
          <span className="text-gray-400 text-sm">{filteredMembers.length} members</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-rise-gold divide-opacity-20">
            <thead>
              <tr>
                <th className="table-header text-left">Member</th>
                <th className="table-header text-left">Level</th>
                <th className="table-header text-left">Referrals</th>
                <th className="table-header text-left">Earnings</th>
                <th className="table-header text-left">Rank</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rise-gold divide-opacity-10">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-rise-dark-light transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-rise-gold text-rise-dark flex items-center justify-center font-medium">
                        {member.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-white">{member.name}</div>
                        <div className="text-xs text-gray-400">{member.email}</div>
                        <div className="text-xs text-gray-500">Joined: {new Date(member.joinDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-900/30 text-blue-400">
                      Level {member.level}
                    </span>
                  </td>
                  <td className="table-cell text-white">{member.referrals}</td>
                  <td className="table-cell text-rise-gold font-semibold">
                    ${member.earnings.toLocaleString()}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <span className="mr-1">{getRankIcon(member.rank)}</span>
                      <span className={getRankColor(member.rank)}>{member.rank}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(member.status)}`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      {member.phone && (
                        <button 
                          className="text-green-400 hover:text-green-300 transition-colors"
                          title="Call"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        className="text-gray-400 hover:text-gray-300 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No team members found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Team; 