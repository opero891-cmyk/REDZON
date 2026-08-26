import oxideImg from '../assets/images/oxide_survival_icon_1787672111879.jpg';
import pubgImg from '../assets/images/pubg_mobile_icon_1787672097668.jpg';
import deltaForceImg from '../assets/images/delta_force_icon_1787672125199.jpg';

export interface InstalledGame {
  id: string;
  name: string;
  nameEn: string;
  packageName: string;
  category: 'fps' | 'battle-royale' | 'rpg' | 'racing' | 'moba' | 'custom';
  icon: string;
  image?: string;
  bannerColor: string;
  targetFPS: 60 | 90 | 120 | 144;
  recommendedGovernor: 'performance' | 'schedutil';
  redMagicBoost: boolean;
  fanSpeed: 1 | 2 | 3 | 4 | 5;
  touchSamplingRate: 500 | 720 | 960 | 2000; // in Hz
  renderingResolution: '100%' | '120%' | '1440p' | 'Native';
  gpuBoostLevel: 'balanced' | 'turbo' | 'extreme';
  applied: boolean;
}

export const POPULAR_GAMES_DATABASE: InstalledGame[] = [
  {
    id: 'oxide-survival',
    name: 'أوكسيد سيرفايفل (Oxide: Survival Island)',
    nameEn: 'Oxide: Survival Island',
    packageName: 'com.catsbit.oxidesurvivalisland',
    category: 'battle-royale',
    icon: '🏝️',
    image: oxideImg,
    bannerColor: 'from-emerald-600/20 to-lime-700/10',
    targetFPS: 120,
    recommendedGovernor: 'performance',
    redMagicBoost: true,
    fanSpeed: 5,
    touchSamplingRate: 960,
    renderingResolution: '100%',
    gpuBoostLevel: 'extreme',
    applied: false,
  },
  {
    id: 'pubg-mobile',
    name: 'ببجي موبايل (PUBG Mobile)',
    nameEn: 'PUBG MOBILE',
    packageName: 'com.tencent.ig',
    category: 'battle-royale',
    icon: '🎯',
    image: pubgImg,
    bannerColor: 'from-amber-500/20 to-orange-600/10',
    targetFPS: 120,
    recommendedGovernor: 'performance',
    redMagicBoost: true,
    fanSpeed: 5,
    touchSamplingRate: 960,
    renderingResolution: '100%',
    gpuBoostLevel: 'extreme',
    applied: false,
  },
  {
    id: 'delta-force',
    name: 'دلتا فورس غارينا (Delta Force: Garena)',
    nameEn: 'Delta Force (Garena / Hawk Ops)',
    packageName: 'com.garena.game.deltaforce',
    category: 'fps',
    icon: '🪖',
    image: deltaForceImg,
    bannerColor: 'from-cyan-600/20 to-blue-700/10',
    targetFPS: 120,
    recommendedGovernor: 'performance',
    redMagicBoost: true,
    fanSpeed: 5,
    touchSamplingRate: 960,
    renderingResolution: '1440p',
    gpuBoostLevel: 'extreme',
    applied: false,
  }
];
