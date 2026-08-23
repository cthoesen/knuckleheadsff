'use client';

import { DollarSign, ClipboardList, TrendingUp, ArrowLeftRight, Skull, FileText } from 'lucide-react';
import LeagueHubLayout, { HubTool, HubQuickLink } from '../components/LeagueHubLayout';

const TOOLS: HubTool[] = [
  { name: 'Contract Manager', desc: 'Track contracts, tags (franchise/restricted), and free agents', icon: <DollarSign size={22} />, href: '/kdl-contract', status: 'live' },
  { name: 'Unassigned Years', desc: 'Track waiver pickups that still need contract years assigned', icon: <ClipboardList size={22} />, href: '/kdl-years', status: 'live' },
  { name: 'Tag Calculator', desc: 'Calculate franchise and restricted tag costs for the 2026 season', icon: <TrendingUp size={22} />, href: '/kdl-tags', status: 'live' },
  { name: 'Trade Analyzer', desc: 'Evaluate trades with contract and cap implications', icon: <ArrowLeftRight size={22} />, href: '/kdl-trade', status: 'live' },
  { name: 'Dead Money Tracker', desc: `Track dead money penalties for the ${new Date().getFullYear() + 1} season from mid-season cuts`, icon: <Skull size={22} />, href: '/kdl-dead-money', status: 'live' },
  { name: 'League Constitution', desc: 'Official rules, contract structure, and tag policies', icon: <FileText size={22} />, externalHref: '/docs/kdl/kdl-bylaws.pdf', status: 'live' },
];

const QUICK_LINKS: HubQuickLink[] = [
  { label: 'League Homepage', href: 'https://www47.myfantasyleague.com/2026/home/68756#0' },
  { label: 'Rosters', href: 'https://www47.myfantasyleague.com/2026/options?L=68756&O=07' },
  { label: 'Rookie Draft Results', href: 'https://www47.myfantasyleague.com/2026/options?L=68756&O=17' },
  { label: 'Standings', href: 'https://www47.myfantasyleague.com/2026/standings?L=68756' },
];

export default function KDLHub() {
  return (
    <LeagueHubLayout
      code="KDL"
      name="Knuckleheads Dynasty League"
      meta="MFL League ID: 68756 • Salary Cap & Contracts"
      tools={TOOLS}
      quickLinks={QUICK_LINKS}
    />
  );
}
