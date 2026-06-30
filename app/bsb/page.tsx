'use client';

import { Calculator, TrendingUp, Swords, ArrowLeftRight, FileText } from 'lucide-react';
import LeagueHubLayout, { HubTool, HubQuickLink } from '../components/LeagueHubLayout';

const TOOLS: HubTool[] = [
  { name: 'Keeper Analyzer', desc: 'Calculate 2026 keeper costs with "The Accelerator" penalty', icon: <Calculator size={22} />, href: '/bsb-keeper', status: 'live' },
  { name: 'Draft Strategy Tool', desc: 'Plan keeper decisions and draft pick allocations', icon: <TrendingUp size={22} />, status: 'soon' },
  { name: 'Matchup Analyzer', desc: 'Weekly head-to-head matchup predictions', icon: <Swords size={22} />, status: 'soon' },
  { name: 'Trade Analyzer', desc: 'Evaluate trades with keeper pick implications', icon: <ArrowLeftRight size={22} />, href: '/bsb-trade', status: 'live' },
  { name: 'League Constitution', desc: 'Official rules, keeper penalties, and roster structure', icon: <FileText size={22} />, externalHref: '/docs/bsb/bsb-bylaws.pdf', status: 'live' },
];

const QUICK_LINKS: HubQuickLink[] = [
  { label: 'League Homepage', href: 'https://www47.myfantasyleague.com/2025/home/62908#0' },
  { label: 'Rosters', href: 'https://www47.myfantasyleague.com/2025/options?L=62908&O=17' },
  { label: 'Draft Picks', href: 'https://www47.myfantasyleague.com/2025/options?L=62908&O=07' },
  { label: 'Standings', href: 'https://www47.myfantasyleague.com/2025/options?L=62908&O=26' },
];

export default function BSBHub() {
  return (
    <LeagueHubLayout
      code="BSB"
      name="Blood, Sweat, and Beers"
      meta="League ID: 62908 • MFL 2025 • Draft-Based Keepers"
      tools={TOOLS}
      quickLinks={QUICK_LINKS}
    />
  );
}
