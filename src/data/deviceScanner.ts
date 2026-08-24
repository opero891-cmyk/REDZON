export interface DeviceApp {
  packageName: string;
  name: string;
  isGame: boolean;
  category: 'game' | 'app';
  icon: string;
  installed: boolean;
}

// Common Android game packages scanner database
export const DETECTABLE_GAMES: DeviceApp[] = [
  { packageName: 'com.tencent.ig', name: 'PUBG Mobile (Global)', isGame: true, category: 'game', icon: '🎯', installed: true },
  { packageName: 'com.pubg.krmobile', name: 'PUBG Mobile (KR)', isGame: true, category: 'game', icon: '⚔️', installed: true },
  { packageName: 'com.vng.pubgmobile', name: 'PUBG Mobile (VN)', isGame: true, category: 'game', icon: '🎯', installed: false },
  { packageName: 'com.activision.callofduty.warzone', name: 'Call of Duty: Warzone Mobile', isGame: true, category: 'game', icon: '🎖️', installed: true },
  { packageName: 'com.activision.callofduty.shooter', name: 'Call of Duty: Mobile', isGame: true, category: 'game', icon: '💥', installed: true },
  { packageName: 'com.miHoYo.GenshinImpact', name: 'Genshin Impact', isGame: true, category: 'game', icon: '✨', installed: true },
  { packageName: 'com.HoYoverse.hkrpgoversea', name: 'Honkai: Star Rail', isGame: true, category: 'game', icon: '🌌', installed: true },
  { packageName: 'com.kurogame.wutheringwaves.global', name: 'Wuthering Waves', isGame: true, category: 'game', icon: '🌊', installed: true },
  { packageName: 'com.dts.freefiremax', name: 'Free Fire MAX', isGame: true, category: 'game', icon: '🔥', installed: false },
  { packageName: 'com.dts.freefireth', name: 'Free Fire', isGame: true, category: 'game', icon: '🔥', installed: false },
  { packageName: 'com.carxtech.sr', name: 'CarX Street', isGame: true, category: 'game', icon: '🏎️', installed: true },
  { packageName: 'com.mobile.legends', name: 'Mobile Legends: Bang Bang', isGame: true, category: 'game', icon: '🛡️', installed: false },
  { packageName: 'com.supercell.brawlstars', name: 'Brawl Stars', isGame: true, category: 'game', icon: '⭐', installed: true },
  { packageName: 'com.riotgames.league.wildrift', name: 'League of Legends: Wild Rift', isGame: true, category: 'game', icon: '⚔️', installed: false },
  { packageName: 'com.ea.gp.apexlegendsmobilefps', name: 'Apex Legends Mobile', isGame: true, category: 'game', icon: '🏆', installed: false },
  { packageName: 'com.epicgames.fortnite', name: 'Fortnite Mobile', isGame: true, category: 'game', icon: '🪂', installed: false },
  { packageName: 'com.mojang.minecraftpe', name: 'Minecraft PE', isGame: true, category: 'game', icon: '🧱', installed: false },
  { packageName: 'com.roblox.client', name: 'Roblox', isGame: true, category: 'game', icon: '🤖', installed: false },
  { packageName: 'com.gameloft.android.ANMP.GloftA9HM', name: 'Asphalt 9: Legends', isGame: true, category: 'game', icon: '🏎️', installed: false },
  { packageName: 'com.levelinfinite.sgameGlobal', name: 'Honor of Kings', isGame: true, category: 'game', icon: '👑', installed: false },
  { packageName: 'com.netease.lztgglobal', name: 'Blood Strike', isGame: true, category: 'game', icon: '🔫', installed: false },
  { packageName: 'com.axlebolt.standoff2', name: 'Standoff 2', isGame: true, category: 'game', icon: '🎯', installed: false },
  { packageName: 'com.madfingergames.legends', name: 'Shadowgun Legends', isGame: true, category: 'game', icon: '👽', installed: false }
];
