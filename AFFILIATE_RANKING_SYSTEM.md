# JennaZ Affiliate Ranking System

## Overview
The JennaZ affiliate platform uses a sophisticated 8-tier ranking system that rewards affiliates based on their monthly referral volume performance. This document outlines how affiliate ranks and commissions are determined based on the total dollar value of referrals generated monthly.

## 🏆 Affiliate Rank System

### Rank Tiers (Based on Monthly Referral Volume)

The affiliate ranking system has **8 distinct levels** based on monthly referral volume (cumulative earnings generated through referrals):

| Rank | Icon | Monthly Volume Required | Description |
|------|------|------------------------|-------------|
| **Aligned** | 🎯 | $0 - $1,000 | Entry level - You've tuned in and taken aligned action |
| **Activated** | ⚡ | $1,000 - $5,000 | Building momentum - Your energy is moving, becoming magnetic |
| **Ascended** | 🚀 | $5,000 - $25,000 | Growing impact - Your impact is rising and influence expanding |
| **Magnetic** | 🧲 | $25,000 - $50,000 | Strong performance - Pulling in abundance through pure alignment |
| **Luminary** | 💫 | $50,000 - $100,000 | Community leader - You're a beacon of light in the community |
| **Visionary** | ✨ | $100,000 - $500,000 | Leader of leaders - You've become a leader with a big vision |
| **Oracle** | 🔮 | $500,000 - $1,000,000 | Wisdom and results - Wisdom radiates from your results |
| **Sovereign** | 👑 | $1,000,000+ | Ultimate mastery - You embody mastery, legacy, and divine authority |

## 📊 Rank Progress Calculation

### How Progress to Next Rank is Calculated:

- **Aligned → Activated**: Progress = (Current Volume ÷ $1,000) × 100%
- **Activated → Ascended**: Progress = ((Current Volume - $1,000) ÷ $4,000) × 100%
- **Ascended → Magnetic**: Progress = ((Current Volume - $5,000) ÷ $20,000) × 100%
- **Magnetic → Luminary**: Progress = ((Current Volume - $25,000) ÷ $25,000) × 100%
- **Luminary → Visionary**: Progress = ((Current Volume - $50,000) ÷ $50,000) × 100%
- **Visionary → Oracle**: Progress = ((Current Volume - $100,000) ÷ $400,000) × 100%
- **Oracle → Sovereign**: Progress = ((Current Volume - $500,000) ÷ $500,000) × 100%
- **Sovereign**: 100% (Top rank achieved)

### Examples:
- **$500 monthly volume**: Aligned rank, 50% progress to Activated
- **$3,000 monthly volume**: Activated rank, 50% progress to Ascended  
- **$15,000 monthly volume**: Ascended rank, 50% progress to Magnetic
- **$75,000 monthly volume**: Luminary rank, 50% progress to Visionary
- **$1,500,000 monthly volume**: Sovereign rank, 100% (top level)

## 💰 Commission Structure

### Multi-Level Commission Rates

The platform operates on a 3-level commission structure:

#### High-Commission Products (20/10/5 Structure)
- **BAE**: 20% L1, 10% L2, 5% L3
- **Coaching Packs**: 20% L1, 10% L2, 5% L3
- **Online Mastery**: 20% L1, 10% L2, 5% L3
- **BRAVO Fitness**: 20% L1, 10% L2, 5% L3
- **AI System**: 20% L1, 10% L2, 5% L3

#### Modified Commission Product
- **REACTION CBD**: 15% L1, 5% L2, 5% L3

#### Lower Commission Product
- **Events**: 5% L1, 2.5% L2, 2.5% L3

### How Multi-Level Commissions Work

```
You (Level 0)
├── Direct Referral A (Level 1) - You earn based on product type
│   ├── Their Referral B (Level 2) - You earn L2 commission on their sales
│   │   └── Their Referral C (Level 3) - You earn L3 commission on their sales
│   └── Their Referral D (Level 2) - You earn L2 commission on their sales
└── Direct Referral E (Level 1) - You earn L1 commission on their sales
    └── Their Referral F (Level 2) - You earn L2 commission on their sales
```

## 📈 Monthly Referral Volume Calculation

### What Counts as "Monthly Referral Volume"

Your monthly referral volume includes:
- **Level 1**: Commission earnings from all your direct referrals
- **Level 2**: Commission earnings from referrals made by your direct referrals
- **Level 3**: Commission earnings from referrals made by your Level 2 affiliates

**Total Monthly Volume = L1 + L2 + L3 Commission Earnings for the Current Month**

## 🎖️ Rank Benefits

### What Each Rank Level Unlocks:

#### Aligned ($0-$1,000 monthly)
- Basic affiliate access
- Standard commission rates
- Access to training materials
- Entry-level support

#### Activated ($1,000-$5,000 monthly)
- Enhanced dashboard features
- Priority support access
- Advanced training modules
- Community recognition

#### Ascended ($5,000-$25,000 monthly)
- Leadership development resources
- Exclusive events access
- Advanced analytics dashboard
- Mentorship opportunities

#### Magnetic ($25,000-$50,000 monthly)
- Elite status recognition
- Special bonus opportunities
- Advanced marketing tools
- Direct mentor access

#### Luminary ($50,000-$100,000 monthly)
- Community leadership role
- Advanced training delivery
- Speaking opportunities
- Strategic planning sessions

#### Visionary ($100,000-$500,000 monthly)
- Executive-level benefits
- Product development input
- Leadership council participation
- International opportunities

#### Oracle ($500,000-$1,000,000 monthly)
- Master-level recognition
- Strategic advisory role
- Exclusive retreat access
- Personal brand development

#### Sovereign ($1,000,000+ monthly)
- Ultimate recognition and status
- Executive partnership opportunities
- Legacy program participation
- Global ambassador status

## 🔄 Rank Updates

### When Ranks Are Calculated:
- **Monthly Assessment**: Ranks calculated based on current month's referral volume
- **Real-time Display**: Dashboard shows current rank based on monthly performance
- **Progressive Tracking**: Historical rank achievements are maintained
- **Volume Reset**: Monthly volume resets each calendar month

### Performance Tracking:
- Monthly volume calculations include all commission tiers
- Active affiliate performance influences team metrics
- Consistent monthly achievement builds long-term status
- Seasonal trends and growth patterns analyzed

## 📊 Performance Metrics

### Key Performance Indicators (KPIs):
1. **Monthly Referral Volume** - Primary ranking factor
2. **Direct Referral Performance** - L1 commission generation
3. **Team Depth Performance** - L2 & L3 commission generation
4. **Consistency Rating** - Month-over-month volume stability
5. **Growth Trajectory** - Quarterly volume improvement trends

## 🎯 Advancement Strategies

### Tips for Rank Advancement:
1. **Focus on High-Value Products**: Promote products with higher commission rates
2. **Build Deep Networks**: Develop L2 and L3 relationships for sustained volume
3. **Consistent Monthly Activity**: Maintain regular promotional activities
4. **Quality Over Quantity**: Focus on conversions that generate significant volume
5. **Leverage Training**: Use platform resources to improve conversion rates
6. **Track Monthly Progress**: Monitor volume daily to optimize monthly performance

---

## Technical Implementation Notes

### Data Sources:
- Monthly volume calculated from commission earnings tables
- Referral relationships tracked across 3 levels
- Real-time volume aggregation via commission tracking service
- Monthly reset automation handles volume calculations

### Rank Calculation Frequency:
- Dashboard: Real-time calculation based on current month's volume
- Monthly: Automated rank assessment on month-end
- Historical: Maintains record of all monthly rank achievements

---

*This ranking system rewards consistent high-volume performance and incentivizes both direct sales excellence and team development, creating multiple pathways for affiliate advancement and substantial earnings growth.* 