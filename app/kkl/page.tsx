'use client';

import { Calculator, TrendingUp, ArrowLeftRight, FileText } from 'lucide-react';
import LeagueHubLayout, { HubTool, HubQuickLink } from '../components/LeagueHubLayout';

const TOOLS: HubTool[] = [
  { name: 'Keeper Analyzer', desc: 'Calculate keeper eligibility and draft costs for the 2026 season', icon: <Calculator size={22} />, href: '/kkl-keeper', status: 'live' },
  { name: 'Draft Assistant', desc: 'Live draft helper with player rankings and ADP tracking', icon: <TrendingUp size={22} />, status: 'soon' },
  { name: 'Trade Analyzer', desc: 'Evaluate trade proposals with keeper implications', icon: <ArrowLeftRight size={22} />, href: '/kkl-trade', status: 'live' },
  { name: 'League Constitution', desc: 'Official rules, scoring, and keeper regulations', icon: <FileText size={22} />, externalHref: '/docs/kkl/kkl-bylaws.pdf', status: 'live' },
];

const QUICK_LINKS: HubQuickLink[] = [
  { label: 'League Homepage', href: 'https://www47.myfantasyleague.com/2026/home/45267#0' },
  { label: 'Rosters', href: 'https://www47.myfantasyleague.com/2026/options?L=45267&O=17' },
  { label: 'Salaries', href: 'https://www47.myfantasyleague.com/2026/options?L=45267&O=07' },
  { label: 'Standings', href: 'https://www47.myfantasyleague.com/2026/options?L=45267&O=26' },
];

export default function KKLHub() {
  return (
    <LeagueHubLayout
      code="KKL"
      name="Knuckleheads Keeper League"
      meta="League ID: 45267 • MFL 2025"
      tools={TOOLS}
      quickLinks={QUICK_LINKS}
    />
  );
}
