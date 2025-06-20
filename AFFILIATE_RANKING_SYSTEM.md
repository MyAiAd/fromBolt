# JennaZ Affiliate Ranking System

## Overview
The JennaZ affiliate platform uses a sophisticated multi-level ranking system that rewards affiliates based on team building and performance. This document outlines how affiliate levels, ranks, and commissions are determined.

## 🏆 Affiliate Rank Levels

### Rank Tiers (Based on Total Team Size)

The affiliate ranking system has **5 distinct levels** based on the total number of team members in your network:

| Rank | Icon | Team Size Required | Description |
|------|------|-------------------|-------------|
| **Bronze** | 🥉 | 0-4 team members | Starting level for new affiliates |
| **Silver** | 🥈 | 5-9 team members | Active affiliates building their network |
| **Gold** | 🥇 | 10-24 team members | Successful team builders |
| **Platinum** | 🏆 | 25-49 team members | Elite performers with substantial networks |
| **Sovereign** | 💎 | 50+ team members | Top-tier affiliates with large organizations |

## 📊 Rank Progress Calculation

### How Progress to Next Rank is Calculated:

- **Bronze → Silver**: Progress = (Current Team Size ÷ 5) × 100%
- **Silver → Gold**: Progress = ((Current Team Size - 5) ÷ 5) × 100%
- **Gold → Platinum**: Progress = ((Current Team Size - 10) ÷ 15) × 100%
- **Platinum → Sovereign**: Progress = ((Current Team Size - 25) ÷ 25) × 100%
- **Sovereign**: 100% (Top rank achieved)

### Examples:
- **3 team members**: Bronze rank, 60% progress to Silver
- **7 team members**: Silver rank, 40% progress to Gold  
- **15 team members**: Gold rank, 33% progress to Platinum
- **35 team members**: Platinum rank, 40% progress to Sovereign
- **75 team members**: Sovereign rank, 100% (top level)

## 🎯 Alternative Individual Performance Ranking

For individual affiliate performance tracking, there's a secondary ranking system based on personal referrals:

| Rank | Personal Referrals Required |
|------|---------------------------|
| **Bronze** | 0-1 referrals |
| **Silver** | 2-4 referrals |
| **Gold** | 5-9 referrals |
| **Platinum** | 10-19 referrals |
| **Sovereign** | 20+ referrals |

## 💰 Commission Structure

### Multi-Level Commission Rates

The platform operates on a 3-level commission structure:

#### Default Products (15/5/2 Structure)
- **Level 1 (Direct Referrals)**: 15%
- **Level 2 (Indirect Referrals)**: 5%
- **Level 3 (Grand Referrals)**: 2%

#### Events (5/2.5/2.5 Structure)
- **Level 1 (Direct Referrals)**: 5%
- **Level 2 (Indirect Referrals)**: 2.5%
- **Level 3 (Grand Referrals)**: 2.5%

### How Multi-Level Commissions Work

```
You (Level 0)
├── Direct Referral A (Level 1) - You earn 15% on their sales
│   ├── Their Referral B (Level 2) - You earn 5% on their sales
│   │   └── Their Referral C (Level 3) - You earn 2% on their sales
│   └── Their Referral D (Level 2) - You earn 5% on their sales
└── Direct Referral E (Level 1) - You earn 15% on their sales
    └── Their Referral F (Level 2) - You earn 5% on their sales
```

## 📈 Team Size Calculation

### What Counts as "Team Size"

Your total team size includes:
- **Level 1**: All your direct referrals
- **Level 2**: All referrals made by your direct referrals
- **Level 3**: All referrals made by your Level 2 affiliates

**Total Team Size = Level 1 + Level 2 + Level 3 Affiliates**

## 🎖️ Rank Benefits

### What Each Rank Level Unlocks:

#### Bronze (0-4 team members)
- Basic affiliate access
- Standard commission rates
- Access to training materials

#### Silver (5-9 team members)
- Enhanced dashboard features
- Priority support
- Advanced training modules

#### Gold (10-24 team members)
- Leadership recognition
- Exclusive events access
- Advanced analytics

#### Platinum (25-49 team members)
- Elite status recognition
- Special bonus opportunities
- Mentorship program access

#### Sovereign (50+ team members)
- Top-tier recognition
- Maximum earning potential
- Executive-level benefits
- Advisory board consideration

## 🔄 Rank Updates

### When Ranks Are Calculated:
- **Real-time**: Dashboard displays current rank based on live team size
- **Automatic**: Ranks update immediately when team size changes
- **Retroactive**: Historical rank achievements are tracked

### Team Growth Tracking:
- New referrals automatically added to team count
- Inactive affiliates may affect team metrics
- Commission earnings influence overall performance metrics

## 📊 Performance Metrics

### Key Performance Indicators (KPIs):
1. **Total Team Size** - Primary ranking factor
2. **Direct Referrals** - Personal recruiting success
3. **Commission Earnings** - Financial performance
4. **Team Activity** - Overall network engagement
5. **Growth Rate** - Month-over-month team expansion

## 🎯 Advancement Strategies

### Tips for Rank Advancement:
1. **Focus on Direct Referrals**: Build your Level 1 base first
2. **Support Your Team**: Help referrals succeed to grow Level 2 & 3
3. **Consistent Activity**: Regular engagement maintains team growth
4. **Quality Over Quantity**: Active affiliates contribute more than inactive ones
5. **Leverage Training**: Use platform resources to improve performance

---

## Technical Implementation Notes

### Data Sources:
- Team size calculated from `affiliate_system_users` table
- Referral relationships tracked in `referral_relationships` table
- Commission data from `multi_level_commissions` table
- Real-time aggregation via `affiliateAggregationService`

### Rank Calculation Frequency:
- Dashboard: Real-time calculation on page load
- Background: Periodic updates for cached metrics
- Triggers: Automatic recalculation on team changes

---

*This ranking system is designed to reward both individual effort and team building success, creating multiple pathways for affiliate advancement and earnings growth.* 