import oxideImg from '../assets/images/oxide_survival_icon_1787672111879.jpg';
import pubgImg from '../assets/images/pubg_mobile_icon_1787672097668.jpg';
import deltaForceImg from '../assets/images/delta_force_icon_1787672125199.jpg';

export interface DeviceApp {
  packageName: string;
  name: string;
  isGame: boolean;
  category: 'game' | 'app';
  icon: string;
  image?: string;
  installed: boolean;
}

// Common Android game packages scanner database
export const DETECTABLE_GAMES: DeviceApp[] = [
  { packageName: 'com.catsbit.oxidesurvivalisland', name: 'Oxide: Survival Island (أوكسيد سيرفايفل)', isGame: true, category: 'game', icon: '🏝️', image: oxideImg, installed: true },
  { packageName: 'com.tencent.ig', name: 'PUBG Mobile (ببجي موبايل)', isGame: true, category: 'game', icon: '🎯', image: pubgImg, installed: true },
  { packageName: 'com.garena.game.deltaforce', name: 'Delta Force Garena (دلتا فورس غارينا)', isGame: true, category: 'game', icon: '🪖', image: deltaForceImg, installed: true }
];
