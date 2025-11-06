import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TrendingUp, Zap, Calendar, Infinity } from 'lucide-react-native';
import { useMembership } from '@/providers/MembershipProvider';
import Colors from '@/constants/colors';

export default function UsageStatsDashboard() {
  const membership = useMembership();

  const tierInfo = useMemo(() => {
    switch (membership.tier) {
      case 'free_trial':
        return {
          name: 'Free Trial',
          color: '#34C759',
          icon: Zap,
        };
      case 'free':
        return {
          name: 'Free',
          color: '#8E8E93',
          icon: Calendar,
        };
      case 'basic':
        return {
          name: 'Basic',
          color: '#007AFF',
          icon: TrendingUp,
        };
      case 'premium':
        return {
          name: 'Premium',
          color: '#FF9500',
          icon: Infinity,
        };
      default:
        return {
          name: 'Unknown',
          color: '#8E8E93',
          icon: Calendar,
        };
    }
  }, [membership.tier]);

  const quotaInfo = useMemo(() => {
    const remaining = membership.getRemainingUsage();
    
    switch (membership.tier) {
      case 'free_trial':
        return {
          label: 'Trial Uses Remaining',
          current: remaining,
          total: membership.limits.trial.total,
          percentage: (remaining / membership.limits.trial.total) * 100,
        };
      case 'free':
        return {
          label: 'Daily Uses Remaining',
          current: remaining,
          total: membership.limits.free.daily,
          percentage: (remaining / membership.limits.free.daily) * 100,
        };
      case 'basic':
        const monthlyRemaining = membership.monthlyUsageRemaining;
        const dailyRemaining = Math.max(0, membership.limits.basic.dailyBonus - membership.dailyUsageCount);
        return {
          label: 'Monthly + Daily Bonus',
          current: monthlyRemaining + dailyRemaining,
          total: membership.limits.basic.monthly + membership.limits.basic.dailyBonus,
          percentage: ((monthlyRemaining + dailyRemaining) / (membership.limits.basic.monthly + membership.limits.basic.dailyBonus)) * 100,
          breakdown: {
            monthly: monthlyRemaining,
            daily: dailyRemaining,
          },
        };
      case 'premium':
        return {
          label: 'Unlimited',
          current: -1,
          total: -1,
          percentage: 100,
        };
      default:
        return {
          label: 'Unknown',
          current: 0,
          total: 0,
          percentage: 0,
        };
    }
  }, [membership]);

  const TierIcon = tierInfo.icon;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: tierInfo.color + '20' }]}>
          <TierIcon size={32} color={tierInfo.color} />
        </View>
        <Text style={styles.tierName}>{tierInfo.name}</Text>
        <Text style={styles.tierSubtitle}>Current Membership</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Usage Statistics</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>{quotaInfo.label}</Text>
          {quotaInfo.current === -1 ? (
            <View style={styles.unlimitedBadge}>
              <Infinity size={16} color={Colors.primary.accent} />
              <Text style={styles.unlimitedText}>Unlimited</Text>
            </View>
          ) : (
            <Text style={styles.statValue}>
              {quotaInfo.current} / {quotaInfo.total}
            </Text>
          )}
        </View>

        {quotaInfo.current !== -1 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${quotaInfo.percentage}%`,
                    backgroundColor: quotaInfo.percentage > 20 ? tierInfo.color : '#FF3B30',
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(quotaInfo.percentage)}%</Text>
          </View>
        )}

        {quotaInfo.breakdown && (
          <View style={styles.breakdown}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Monthly Quota</Text>
              <Text style={styles.breakdownValue}>{quotaInfo.breakdown.monthly}</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Daily Bonus</Text>
              <Text style={styles.breakdownValue}>{quotaInfo.breakdown.daily}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Total Usage</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Today</Text>
          <Text style={styles.statValue}>{membership.dailyUsageCount}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>All Time</Text>
          <Text style={styles.statValue}>{membership.usageCount}</Text>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Device Management</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Bound Devices</Text>
          <Text style={styles.statValue}>
            {membership.devices.length} / {membership.getMaxDevices()}
          </Text>
        </View>

        {membership.devices.length > 0 && (
          <View style={styles.deviceList}>
            {membership.devices.map((device, index) => (
              <View key={device.deviceId} style={styles.deviceItem}>
                <Text style={styles.deviceName} numberOfLines={1}>
                  {device.deviceName || `Device ${index + 1}`}
                </Text>
                <Text style={styles.deviceDate}>
                  {new Date(device.lastLogin).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Features</Text>
        
        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>Adult Content</Text>
          <View style={[styles.featureBadge, membership.supportsAdultContent() ? styles.featureEnabled : styles.featureDisabled]}>
            <Text style={[styles.featureBadgeText, membership.supportsAdultContent() ? styles.featureEnabledText : styles.featureDisabledText]}>
              {membership.supportsAdultContent() ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
        </View>

        <View style={styles.featureRow}>
          <Text style={styles.featureLabel}>Custom Voice Commands</Text>
          <View style={[styles.featureBadge, membership.tier !== 'free' ? styles.featureEnabled : styles.featureDisabled]}>
            <Text style={[styles.featureBadgeText, membership.tier !== 'free' ? styles.featureEnabledText : styles.featureDisabledText]}>
              {membership.tier !== 'free' ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  header: {
    alignItems: 'center' as const,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  tierName: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.primary.text,
    marginBottom: 4,
  },
  tierSubtitle: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
  },
  statsCard: {
    backgroundColor: Colors.card.bg,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.primary.text,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary.text,
  },
  unlimitedBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  unlimitedText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary.accent,
  },
  progressContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.card.border,
    borderRadius: 4,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary.textSecondary,
    minWidth: 40,
    textAlign: 'right' as const,
  },
  breakdown: {
    flexDirection: 'row' as const,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.card.border,
  },
  breakdownItem: {
    flex: 1,
    alignItems: 'center' as const,
  },
  breakdownDivider: {
    width: 1,
    backgroundColor: Colors.card.border,
    marginHorizontal: 16,
  },
  breakdownLabel: {
    fontSize: 12,
    color: Colors.primary.textSecondary,
    marginBottom: 4,
  },
  breakdownValue: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.primary.text,
  },
  deviceList: {
    marginTop: 12,
  },
  deviceItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary.bg,
    borderRadius: 8,
    marginBottom: 8,
  },
  deviceName: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary.text,
    marginRight: 12,
  },
  deviceDate: {
    fontSize: 12,
    color: Colors.primary.textSecondary,
  },
  featureRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  featureLabel: {
    fontSize: 14,
    color: Colors.primary.text,
  },
  featureBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureEnabled: {
    backgroundColor: '#34C75920',
  },
  featureDisabled: {
    backgroundColor: '#8E8E9320',
  },
  featureBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  featureEnabledText: {
    color: '#34C759',
  },
  featureDisabledText: {
    color: '#8E8E93',
  },
});
