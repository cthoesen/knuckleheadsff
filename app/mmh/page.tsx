'use client';

import { Calculator, Zap, TrendingUp, ArrowLeftRight, FileText } from 'lucide-react';
import LeagueHubLayout, { HubTool, HubQuickLink } from '../components/LeagueHubLayout';

const TOOLS: HubTool[] = [
  { name: 'Salary Cap Manager', desc: 'Track salaries, cap space, and 2026 keeper costs', icon: <Calculator size={22} />, href: '/mmh-keeper', status: 'live' },
  { name: 'Contract Optimizer', desc: 'Maximize keeper value while staying under the cap', icon: <Zap size={22} />, status: 'soon' },
  { name: 'Auction Draft Tool', desc: 'Live auction helper with budget tracking', icon: <TrendingUp size={22} />, status: 'soon' },
  { name: 'Trade Analyzer', desc: 'Evaluate trades with salary cap implications', icon: <ArrowLeftRight size={22} />, href: '/mmh-trade', status: 'live' },
  { name: 'League Constitution', desc: 'Official rules, salary structure, and roster limits', icon: <FileText size={22} />, externalHref: '/docs/mmh/mmh-bylaws.pdf', status: 'live' },
];

const QUICK_LINKS: HubQuickLink[] = [
  { label: 'League Homepage', href: 'https://www47.myfantasyleague.com/2025/home/72966#0' },
  { label: 'Rosters', href: 'https://www47.myfantasyleague.com/2025/options?L=72966&O=17' },
  { label: 'Salaries', href: 'https://www47.myfantasyleague.com/2025/options?L=72966&O=07' },
  { label: 'Standings', href: 'https://www47.myfantasyleague.com/2025/options?L=72966&O=26' },
];

export default function MMHHub() {
  return (
    <LeagueHubLayout
      code="MMH"
      name="Monday Morning Hangover"
      meta="League ID: 72966 • MFL 2025 • Salary Cap League"
      tools={TOOLS}
      quickLinks={QUICK_LINKS}
    />
  );
}
