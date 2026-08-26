import React, { useState } from 'react';
import {
  Gamepad2,
  Zap,
  Flame,
  Monitor,
  Target,
  Cpu,
  Check,
  Copy,
  Search,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Scan,
  Smartphone,
  CheckCircle2,
  Trash2,
  AlertCircle,
  PlusCircle,
  Eye
} from 'lucide-react';
import { InstalledGame, POPULAR_GAMES_DATABASE } from '../data/gamesDatabase';
import { DETECTABLE_GAMES, DeviceApp } from '../data/deviceScanner';
import { CollapsibleCard } from './CollapsibleCard';

interface GameOptimizerProps {
  language: 'ar' | 'en';
  rootReady: boolean;
  onApplyGameProfile: (game: InstalledGame, generatedCommand: string) => void;
  onOpenOverlayHUD?: () => void;
}

export const GameOptimizer: React.FC<GameOptimizerProps> = ({
  language,
  rootReady,
  onApplyGameProfile,
  onOpenOverlayHUD
}) => {
  const isArabic = language === 'ar';

  // State for installed games currently active on device
  // Initially include Oxide Survival Island prominently
  const [gamesList, setGamesList] = useState<InstalledGame[]>(() => {
    return POPULAR_GAMES_DATABASE.filter((g) => {
      const match = DETECTABLE_GAMES.find((dg) => dg.packageName === g.packageName);
      return match ? match.installed : true;
    });
  });

  const [selectedGameId, setSelectedGameId] = useState<string>('oxide-survival');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [showDeviceAppsModal, setShowDeviceAppsModal] = useState<boolean>(false);
  const [showAddCustomGameModal, setShowAddCustomGameModal] = useState<boolean>(false);
  const [deviceApps] = useState<DeviceApp[]>(DETECTABLE_GAMES);

  // Custom game form state
  const [customName, setCustomName] = useState<string>('');
  const [customPackage, setCustomPackage] = useState<string>('');
  const [customIcon, setCustomIcon] = useState<string>('🎮');
  const [customFPS, setCustomFPS] = useState<60 | 90 | 120 | 144>(120);
  const [customResolution, setCustomResolution] = useState<'100%' | '120%' | '1440p' | 'Native'>('100%');

  const selectedGame = gamesList.find((g) => g.id === selectedGameId) || gamesList[0];

  const filteredGames = gamesList.filter((game) => {
    const matchesSearch =
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.packageName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Generate tailored Root / Shell script for the game
  const generateGameCommand = (game: InstalledGame): string => {
    if (!game) return '';
    const fpsVal = game.targetFPS;
    return [
      `# REDZON Game Booster Profile: ${game.nameEn} (${game.packageName})`,
      `# Target FPS: ${fpsVal}Hz | Fan: ${game.fanSpeed} | Touch: ${game.touchSamplingRate}Hz`,
      `# 1. RedMagic Display & Refresh Rate Lock`,
      `setprop persist.vendor.zte.display.fps ${fpsVal}`,
      `setprop vendor.display.qsync 0`,
      `settings put system nubia_refresh_rate ${fpsVal}`,
      `settings put system peak_refresh_rate ${fpsVal}.0`,
      `settings put system min_refresh_rate ${fpsVal}.0`,
      `settings put secure user_refresh_rate ${fpsVal}`,
      `# 2. RedMagic Turbo Engine & CPU Affinity`,
      `setprop sys.nubia.perf.game_mode 1`,
      `setprop vendor.perf.gesture_opt 1`,
      `setprop debug.sf.high_fps.early.app.duration ${fpsVal}`,
      `for gov in /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor; do echo ${game.recommendedGovernor} > $gov; done`,
      `# 3. Adreno GPU Frequency & Bus Lock`,
      `echo 1 > /sys/class/kgsl/kgsl-3d0/force_bus_on 2>/dev/null`,
      `echo 1 > /sys/class/kgsl/kgsl-3d0/force_clk_on 2>/dev/null`,
      `echo 1 > /sys/class/kgsl/kgsl-3d0/force_no_nap 2>/dev/null`,
      `# 4. RedMagic Nova ICE Cooling Fan Speed`,
      `echo 1 > /sys/kernel/fan/fan_enable 2>/dev/null`,
      `echo ${game.fanSpeed} > /sys/kernel/fan/fan_speed 2>/dev/null`,
      `# 5. Gaming Package Priority (Renice & OOM)`,
      `pid=$(pidof ${game.packageName} 2>/dev/null); if [ -n "$pid" ]; then renice -n -20 -p $pid; echo -1000 > /proc/$pid/oom_score_adj; fi`
    ].join(' && ');
  };

  const handleUpdateGameConfig = (
    key: keyof InstalledGame,
    value: any
  ) => {
    setGamesList((prev) =>
      prev.map((g) => (g.id === selectedGame.id ? { ...g, [key]: value } : g))
    );
  };

  const handleApply = () => {
    if (!selectedGame) return;
    setIsApplying(true);
    const cmd = generateGameCommand(selectedGame);

    setTimeout(() => {
      setGamesList((prev) =>
        prev.map((g) => (g.id === selectedGame.id ? { ...g, applied: true } : g))
      );
      setIsApplying(false);
      onApplyGameProfile(selectedGame, cmd);
    }, 600);
  };

  const handleCopyCommand = () => {
    if (!selectedGame) return;
    const rawCmd = generateGameCommand(selectedGame);
    const fullCmd = `su -c "${rawCmd}"`;
    navigator.clipboard.writeText(fullCmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  // Scan installed games on the phone
  const handleScanDevice = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowDeviceAppsModal(true);
    }, 700);
  };

  // Toggle adding or removing an installed phone game
  const handleToggleAddGame = (app: DeviceApp) => {
    const isAlreadyAdded = gamesList.some((g) => g.packageName === app.packageName);

    if (isAlreadyAdded) {
      setGamesList((prev) => {
        const updated = prev.filter((g) => g.packageName !== app.packageName);
        if (selectedGameId === app.packageName && updated.length > 0) {
          setSelectedGameId(updated[0].id);
        }
        return updated;
      });
    } else {
      const dbMatch = POPULAR_GAMES_DATABASE.find((p) => p.packageName === app.packageName);
      const newGameItem: InstalledGame = dbMatch || {
        id: `installed-${Date.now()}`,
        name: app.name,
        nameEn: app.name,
        packageName: app.packageName,
        category: 'custom',
        icon: app.icon || '🎮',
        bannerColor: 'from-blue-600/20 to-indigo-600/10',
        targetFPS: 120,
        recommendedGovernor: 'performance',
        redMagicBoost: true,
        fanSpeed: 5,
        touchSamplingRate: 960,
        renderingResolution: '100%',
        gpuBoostLevel: 'extreme',
        applied: false
      };

      setGamesList((prev) => [newGameItem, ...prev]);
      setSelectedGameId(newGameItem.id);
    }
  };

  const handleRemoveGame = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGamesList((prev) => {
      const filtered = prev.filter((g) => g.id !== id);
      if (selectedGameId === id && filtered.length > 0) {
        setSelectedGameId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleAddManualGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customPackage.trim()) return;

    const newGame: InstalledGame = {
      id: `custom-game-${Date.now()}`,
      name: customName.trim(),
      nameEn: customName.trim(),
      packageName: customPackage.trim(),
      category: 'custom',
      icon: customIcon || '🎮',
      bannerColor: 'from-purple-600/20 to-teal-600/10',
      targetFPS: customFPS,
      recommendedGovernor: 'performance',
      redMagicBoost: true,
      fanSpeed: 5,
      touchSamplingRate: 960,
      renderingResolution: customResolution,
      gpuBoostLevel: 'extreme',
      applied: false
    };

    setGamesList((prev) => [newGame, ...prev]);
    setSelectedGameId(newGame.id);
    setCustomName('');
    setCustomPackage('');
    setShowAddCustomGameModal(false);
  };

  const headerBadges = (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-[#F4B860]" />
        RedMagic Nova Tuned
      </span>
      {rootReady && (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold hidden sm:flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          ROOT Active
        </span>
      )}
    </div>
  );

  const headerActions = (
    <div className="flex items-center gap-1.5">
      {onOpenOverlayHUD && (
        <button
          onClick={onOpenOverlayHUD}
          className="px-2.5 py-1.5 rounded-xl bg-[#09111D] hover:bg-[#16283B] border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
          title={isArabic ? 'تشغيل النافذة العائمة فوق الشاشة' : 'Launch In-Game Floating HUD'}
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">{isArabic ? 'النافذة العائمة' : 'Overlay HUD'}</span>
        </button>
      )}

      <button
        onClick={() => setShowAddCustomGameModal(true)}
        className="px-2.5 py-1.5 rounded-xl bg-[#09111D] hover:bg-[#16283B] border border-purple-500/40 hover:border-purple-400 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
        title={isArabic ? 'إضافة لعبة جديدة يدوياً' : 'Add custom game manually'}
      >
        <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
        <span className="hidden md:inline">{isArabic ? 'إضافة لعبة يدوياً' : 'Add Game'}</span>
      </button>

      <button
        onClick={handleScanDevice}
        disabled={isScanning}
        className="px-3 py-1.5 rounded-xl bg-[#09111D] hover:bg-[#16283B] border border-[#2DD4BF]/40 hover:border-[#2DD4BF] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#2DD4BF]/10 active:scale-95 disabled:opacity-50"
      >
        {isScanning ? (
          <RefreshCw className="w-3.5 h-3.5 text-[#2DD4BF] animate-spin" />
        ) : (
          <Scan className="w-3.5 h-3.5 text-[#2DD4BF]" />
        )}
        <span className="hidden sm:inline">
          {isArabic ? 'فحص ألعاب الهاتف' : 'Scan Phone Games'}
        </span>
      </button>
    </div>
  );

  return (
    <>
      <CollapsibleCard
        id="game-optimizer-section"
        title={isArabic ? 'ألعاب الهاتف المثبتة (Game Space Booster)' : 'Installed Device Games'}
        subtitle={isArabic
          ? 'تطبيق قفل الفريمات الفائق، كسر سرعة المعالج، المروحة ومعدل لمس 960Hz'
          : 'Custom FPS locks, CPU/GPU overclocking & cooling fan speed'}
        icon={Gamepad2}
        badge={headerBadges}
        headerAction={headerActions}
        defaultExpanded={true}
        accentColor="#A855F7"
      >
        <div className="space-y-4">
          {/* Search Bar & Active Count */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3 rtl:right-3 ltr:left-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? 'ابحث في ألعاب هاتفك المضافة...' : 'Search added games...'}
                className="w-full bg-[#09111D] border border-slate-800 rounded-xl py-2 px-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF]/60 transition-colors"
              />
            </div>
            <div className="text-xs text-slate-400 font-mono bg-[#09111D] px-3 py-2 rounded-xl border border-slate-800 shrink-0">
              <span className="text-[#2DD4BF] font-bold">{gamesList.length}</span> {isArabic ? 'ألعاب مثبتة' : 'Games'}
            </div>
          </div>

              {/* Games Selection Horizontal Carousel / Grid */}
              {gamesList.length === 0 ? (
                <div className="bg-[#09111D] border border-dashed border-slate-800 rounded-2xl p-6 text-center space-y-3">
                  <Smartphone className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-300 font-bold">
                    {isArabic ? 'لم تقم بإضافة أي لعبة من ألعاب هاتفك بعد' : 'No games currently selected from your device'}
                  </p>
                  <button
                    onClick={handleScanDevice}
                    className="px-4 py-2 rounded-xl bg-[#2DD4BF] text-[#09111D] font-extrabold text-xs inline-flex items-center gap-1.5 shadow-lg shadow-[#2DD4BF]/20"
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'فحص واختيار ألعاب الهاتف الآن' : 'Scan Phone Games Now'}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredGames.map((game) => {
                    const isSelected = selectedGame && game.id === selectedGame.id;
                    return (
                      <div
                        key={game.id}
                        onClick={() => setSelectedGameId(game.id)}
                        className={`relative p-3 rounded-2xl border cursor-pointer text-right rtl:text-right ltr:text-left transition-all flex flex-col justify-between overflow-hidden group ${
                          isSelected
                            ? 'bg-gradient-to-b from-[#16283B] to-[#0E1824] border-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/15 ring-1 ring-[#2DD4BF]/40'
                            : 'bg-[#09111D]/80 border-slate-800/80 hover:border-slate-700 hover:bg-[#0E1824]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2.5 w-full">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {game.image ? (
                              <img
                                src={game.image}
                                alt={game.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-xl object-cover border border-slate-700/80 shadow-md shrink-0 group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shrink-0">
                                {game.icon}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate group-hover:text-[#2DD4BF] transition-colors">
                                {isArabic ? game.name : game.nameEn}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate font-mono">
                                {game.packageName}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                game.targetFPS >= 120
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {game.targetFPS} FPS
                            </span>
                            <button
                              onClick={(e) => handleRemoveGame(game.id, e)}
                              title={isArabic ? 'إزالة اللعبة' : 'Remove game'}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {game.applied && (
                          <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                            <span className="text-emerald-400 flex items-center gap-1 font-bold">
                              <Check className="w-3 h-3" />
                              {isArabic ? 'البروفايل مفعل' : 'Active Profile'}
                            </span>
                            <span className="text-slate-400 font-mono">
                              {game.touchSamplingRate}Hz • {game.renderingResolution}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Selected Game Profile Tuning Dashboard */}
              {selectedGame && (
                <div className="bg-[#09111D] border border-slate-800 rounded-2xl p-4 md:p-5 space-y-4">
                  {/* Game Title & Status Banner with Real Image */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3.5">
                      {selectedGame.image ? (
                        <div className="relative">
                          <img
                            src={selectedGame.image}
                            alt={selectedGame.name}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-2xl object-cover border border-[#2DD4BF]/40 shadow-lg shadow-[#2DD4BF]/10"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-[#09111D] text-xs px-1 rounded-md border border-slate-700">
                            {selectedGame.icon}
                          </div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-3xl shadow-inner">
                          {selectedGame.icon}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base md:text-lg font-black text-white">
                            {isArabic ? selectedGame.name : selectedGame.nameEn}
                          </h3>
                          {selectedGame.applied && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              {isArabic ? 'مُفعّل حالياً' : 'Active Profile'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#91A5B8] font-mono mt-0.5">
                          Package: <span className="text-slate-300">{selectedGame.packageName}</span>
                        </div>
                      </div>
                    </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCommand}
                className="px-3.5 py-2.5 rounded-xl bg-[#111E2C] hover:bg-[#16283B] border border-slate-700 hover:border-[#2DD4BF]/50 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all"
                title={isArabic ? 'نسخ أمر التيربو لتشغيله في Termux' : 'Copy Termux command'}
              >
                {copiedCmd ? (
                  <>
                    <Check className="w-4 h-4 text-[#2DD4BF]" />
                    <span className="text-[#2DD4BF]">{isArabic ? 'تم النسخ لـ Termux!' : 'Copied for Termux!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#2DD4BF]" />
                    <span>{isArabic ? 'نسخ أمر الـ Termux' : 'Copy Termux Script'}</span>
                  </>
                )}
              </button>

              <button
                id="apply-game-profile-btn"
                onClick={handleApply}
                disabled={isApplying}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#14B8A6] hover:from-[#14B8A6] hover:to-[#0D9488] text-[#09111D] font-extrabold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-[#2DD4BF]/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isApplying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 fill-current" />
                )}
                <span>
                  {isArabic ? 'تطبيق إعدادات اللعبة فوراً' : 'Apply Game Boost Profile'}
                </span>
              </button>
            </div>
          </div>

          {/* Dynamic Sliders & Controls for This Game */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Target FPS Selector */}
            <div className="bg-[#111E2C] border border-slate-800/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#2DD4BF]" />
                  {isArabic ? 'معدل التحديث المستهدف' : 'Target Refresh Rate'}
                </span>
                <span className="font-mono font-bold text-[#2DD4BF] text-sm">
                  {selectedGame.targetFPS} FPS
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 pt-1">
                {([60, 90, 120, 144] as const).map((fps) => (
                  <button
                    key={fps}
                    onClick={() => handleUpdateGameConfig('targetFPS', fps)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                      selectedGame.targetFPS === fps
                        ? 'bg-[#2DD4BF] text-[#09111D] shadow-md shadow-[#2DD4BF]/20'
                        : 'bg-[#09111D] text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {fps}
                  </button>
                ))}
              </div>
            </div>

            {/* Rendering Resolution & Graphics */}
            <div className="bg-[#111E2C] border border-slate-800/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  {isArabic ? 'دقة العرض والجرافيكس' : 'Render Resolution'}
                </span>
                <span className="font-mono font-bold text-cyan-300 text-sm">
                  {selectedGame.renderingResolution}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 pt-1">
                {(['100%', '120%', '1440p', 'Native'] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => handleUpdateGameConfig('renderingResolution', res)}
                    className={`py-1.5 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                      selectedGame.renderingResolution === res
                        ? 'bg-cyan-400 text-[#09111D] shadow-md shadow-cyan-400/20'
                        : 'bg-[#09111D] text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* Touch Sampling Rate */}
            <div className="bg-[#111E2C] border border-slate-800/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  {isArabic ? 'حساسية اللمس (Touch Rate)' : 'Touch Sampling'}
                </span>
                <span className="font-mono font-bold text-amber-300 text-sm">
                  {selectedGame.touchSamplingRate} Hz
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 pt-1">
                {([500, 720, 960, 2000] as const).map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleUpdateGameConfig('touchSamplingRate', rate)}
                    className={`py-1.5 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                      selectedGame.touchSamplingRate === rate
                        ? 'bg-amber-400 text-[#09111D] shadow-md shadow-amber-400/20'
                        : 'bg-[#09111D] text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {rate}Hz
                  </button>
                ))}
              </div>
            </div>

            {/* CPU / GPU Turbo Governor */}
            <div className="bg-[#111E2C] border border-slate-800/80 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  {isArabic ? 'وضع المعالج وكرت الشاشة' : 'CPU/GPU Governor'}
                </span>
                <span className="font-mono font-bold text-purple-300 text-sm">
                  {selectedGame.recommendedGovernor === 'performance' ? 'Performance' : 'Schedutil'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 pt-1">
                {(['performance', 'schedutil'] as const).map((gov) => (
                  <button
                    key={gov}
                    onClick={() => handleUpdateGameConfig('recommendedGovernor', gov)}
                    className={`py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                      selectedGame.recommendedGovernor === gov
                        ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                        : 'bg-[#09111D] text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {gov === 'performance' ? (isArabic ? 'أقصى أداء' : 'Turbo') : (isArabic ? 'متوازن' : 'Balanced')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Generated Command Preview for Termux */}
          <div className="bg-[#09111D] border border-slate-800/80 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[#2DD4BF] flex items-center gap-1.5">
                <span>$</span>
                <span>{isArabic ? 'أمر السكريبت المباشر لـ Termux المخصص لـ ' + selectedGame.name : 'Generated RedMagic Root Script'}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Kernel 6.1 / Snapdragon 8 Gen 3</span>
            </div>
            <div className="bg-[#050A10] p-2.5 rounded-lg border border-slate-900 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed selectable-text">
              su -c "{generateGameCommand(selectedGame)}"
            </div>
          </div>
        </div>
      )}
        </div>
      </CollapsibleCard>

      {/* Modal for Picking Installed Phone Games */}
      {showDeviceAppsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111E2C] border border-slate-700 rounded-2xl p-5 w-full max-w-xl space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/20 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-[#2DD4BF]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isArabic ? 'ألعاب وتطبيقات الهاتف المكتشفة' : 'Installed Phone Games & Apps'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isArabic
                      ? 'حدد الألعاب الموجودة على هاتفك لإضافتها والتحكم في فريماتها وأدائها'
                      : 'Select games found on your phone to optimize'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeviceAppsModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* List of scanned games */}
            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {deviceApps.map((app) => {
                const isAdded = gamesList.some((g) => g.packageName === app.packageName);
                return (
                  <div
                    key={app.packageName}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      isAdded
                        ? 'bg-[#16283B] border-[#2DD4BF]/60 text-white'
                        : 'bg-[#09111D] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {app.image ? (
                        <img
                          src={app.image}
                          alt={app.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0 shadow-sm"
                        />
                      ) : (
                        <span className="text-2xl">{app.icon}</span>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate flex items-center gap-2">
                          <span>{app.name}</span>
                          {app.installed && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {isArabic ? 'مثبت' : 'Installed'}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {app.packageName}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleAddGame(app)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                        isAdded
                          ? 'bg-[#2DD4BF] text-[#09111D] shadow-sm shadow-[#2DD4BF]/20'
                          : 'bg-[#111E2C] border border-slate-700 text-slate-200 hover:bg-[#16283B] hover:text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'مُضاف' : 'Added'}</span>
                        </>
                      ) : (
                        <span>{isArabic ? '+ إضافة' : '+ Add'}</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Note */}
            <div className="bg-[#09111D] border border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                {isArabic
                  ? 'يمكنك إضافة الألعاب المثبتة على جهازك فقط، وحذف أي لعبة لا تحتاج لضبطها.'
                  : 'You can only add games installed on your phone and remove any unused ones.'}
              </span>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowDeviceAppsModal(false)}
                className="px-5 py-2 rounded-xl bg-[#2DD4BF] text-[#09111D] font-extrabold text-xs shadow-md shadow-[#2DD4BF]/20 hover:bg-[#14b8a6]"
              >
                {isArabic ? 'تم وحفظ القائمة' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding Custom Game Manually */}
      {showAddCustomGameModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111E2C] border border-slate-700 rounded-2xl p-5 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isArabic ? 'إضافة لعبة جديدة يدوياً' : 'Add Custom Game'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isArabic ? 'أدخل اسم اللعبة واسم الحزمة لإضافتها للتحسين' : 'Enter game title & Android package name'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddCustomGameModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddManualGame} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isArabic ? 'اسم اللعبة (مثال: أوكسيد، ببجي، ماينكرافت)' : 'Game Name'}
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder={isArabic ? 'أوكسيد سيرفايفل' : 'Oxide: Survival Island'}
                  className="w-full bg-[#09111D] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isArabic ? 'اسم الحزمة (Package Name)' : 'Android Package Name'}
                </label>
                <input
                  type="text"
                  required
                  value={customPackage}
                  onChange={(e) => setCustomPackage(e.target.value)}
                  placeholder="com.catsbit.oxidesurvivalisland"
                  className="w-full bg-[#09111D] border border-slate-800 rounded-xl py-2 px-3 text-xs font-mono text-purple-300 placeholder-slate-600 focus:outline-none focus:border-purple-500/60"
                />
              </div>

              {/* Quick Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isArabic ? 'أيقونة اللعبة:' : 'Game Icon:'}
                </label>
                <div className="flex items-center gap-2">
                  {['🏝️', '🎯', '🔥', '⚔️', '🏎️', '🎖️', '🧟', '🎮'].map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setCustomIcon(ic)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${
                        customIcon === ic
                          ? 'bg-purple-600/30 border-purple-500 shadow-md scale-105'
                          : 'bg-[#09111D] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target FPS */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isArabic ? 'الفريمات المستهدفة:' : 'Target FPS:'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {([60, 90, 120, 144] as const).map((fps) => (
                    <button
                      key={fps}
                      type="button"
                      onClick={() => setCustomFPS(fps)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        customFPS === fps
                          ? 'bg-[#2DD4BF] text-[#09111D] font-black shadow-md'
                          : 'bg-[#09111D] text-slate-400 border border-slate-800'
                      }`}
                    >
                      {fps} FPS
                    </button>
                  ))}
                </div>
              </div>

              {/* Rendering Resolution */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isArabic ? 'دقة العرض والجرافيكس:' : 'Render Resolution:'}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['100%', '120%', '1440p', 'Native'] as const).map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setCustomResolution(res)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        customResolution === res
                          ? 'bg-cyan-400 text-[#09111D] font-black shadow-md'
                          : 'bg-[#09111D] text-slate-400 border border-slate-800'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCustomGameModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-md shadow-purple-600/30"
                >
                  {isArabic ? 'إضافة وضبط اللعبة' : 'Add Game'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
