import React, { useState } from 'react';
import {
  FolderLock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Eye,
  Upload,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { CollapsibleCard } from './CollapsibleCard';

interface SystemPermissionsManagerProps {
  language: 'ar' | 'en';
  rootReady: boolean;
  onOpenOverlayHUD: () => void;
  isOverlayActive: boolean;
  onGameFileLoaded?: (fileName: string, fileSize: number) => void;
  onGrantAllFiles?: () => Promise<void>;
  onGrantOverlay?: () => Promise<void>;
}

export const SystemPermissionsManager: React.FC<SystemPermissionsManagerProps> = ({
  language,
  rootReady,
  onOpenOverlayHUD,
  isOverlayActive,
  onGameFileLoaded,
  onGrantAllFiles,
  onGrantOverlay
}) => {
  const isArabic = language === 'ar';

  // Permission states
  const [allFilesGranted, setAllFilesGranted] = useState<boolean>(true);
  const [overlayGranted, setOverlayGranted] = useState<boolean>(true);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileStatusMsg, setFileStatusMsg] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleGrantAllFiles = async () => {
    if (onGrantAllFiles) {
      await onGrantAllFiles();
    }
    setAllFilesGranted(true);
  };

  const handleGrantOverlay = async () => {
    if (onGrantOverlay) {
      await onGrantOverlay();
    }
    setOverlayGranted(true);
  };

  const handleOpenAndroidSettings = async (type: 'all_files' | 'overlay') => {
    if (type === 'all_files') {
      if (onGrantAllFiles) {
        await onGrantAllFiles();
      }
      // Direct intent for Android 11+ All Files Access
      const intentUrl = 'intent:#Intent;action=android.settings.MANAGE_APP_ALL_FILES_ACCESS_PERMISSION;package=com.redzon.optimizer;end';
      try {
        window.location.href = intentUrl;
      } catch (e) {
        console.log('Opening intent fallback', e);
      }
      setAllFilesGranted(true);
    } else {
      if (onGrantOverlay) {
        await onGrantOverlay();
      }
      // Direct intent for Overlay Display Over Apps
      const intentUrl = 'intent:#Intent;action=android.settings.action.MANAGE_OVERLAY_PERMISSION;package=com.redzon.optimizer;end';
      try {
        window.location.href = intentUrl;
      } catch (e) {
        console.log('Opening overlay intent fallback', e);
      }
      setOverlayGranted(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setFileStatusMsg(
        isArabic
          ? `تم قراءة ملف اللعبة بنجاح: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
          : `Game file loaded successfully: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
      );
      if (onGameFileLoaded) {
        onGameFileLoaded(file.name, file.size);
      }
    }
  };

  const adbAllFilesCmd = 'su -c "appops set com.redzon.optimizer MANAGE_EXTERNAL_STORAGE allow"';
  const adbOverlayCmd = 'su -c "appops set com.redzon.optimizer SYSTEM_ALERT_WINDOW allow"';

  const headerBadge = (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        {rootReady ? (isArabic ? 'ROOT نشط' : 'ROOT Active') : (isArabic ? 'صلاحيات النظام' : 'System Privileges')}
      </span>
    </div>
  );

  return (
    <CollapsibleCard
      id="system-permissions-section"
      title={isArabic ? 'أذونات النظام: الوصول لكل الملفات والعرض فوق الشاشة' : 'Android System Permissions & In-Game Overlay'}
      subtitle={isArabic
        ? 'منح أذونات قراءة ملفات الألعاب (OBB/Data) والعرض العائم المباشر أثناء اللعب'
        : 'Manage All Files Access (MANAGE_EXTERNAL_STORAGE) & Display Over Other Apps'}
      icon={FolderLock}
      badge={headerBadge}
      defaultExpanded={true}
      accentColor="#10B981"
    >
      <div className="space-y-4">
        
        {/* Two Main Permission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          
          {/* 1. All Files Access Permission (MANAGE_EXTERNAL_STORAGE) */}
          <div className="bg-[#09111D] border border-slate-800 rounded-2xl p-4 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <FolderLock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
                    <span>{isArabic ? 'السماح بالوصول إلى كل الملفات' : 'All Files Access Permission'}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400">
                    MANAGE_EXTERNAL_STORAGE (Android 11+)
                  </span>
                </div>
              </div>

              {/* Status Switch */}
              <button
                id="toggle-all-files-perm-btn"
                onClick={() => {
                  if (!allFilesGranted) {
                    handleGrantAllFiles();
                  } else {
                    setAllFilesGranted(false);
                  }
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                  allFilesGranted
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border-red-500/40'
                }`}
              >
                {allFilesGranted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'ممنوح / مفعل' : 'Granted'}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'مطلوب' : 'Required'}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-[#91A5B8] leading-relaxed">
              {isArabic
                ? 'ضروري لقراءة ملفات إعدادات الألعاب (مثل أوكسيد سيرفايفل وببجي)، وتعديل ملفات الرسومات OBB/Data وتحميل سكربتات تحسين الفريمات.'
                : 'Required to read game config files (e.g. Oxide Survival & PUBG), modify OBB/Data graphics files, and load FPS shell scripts.'}
            </p>

            {/* Actions for All Files */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="open-storage-settings-btn"
                  onClick={() => handleOpenAndroidSettings('all_files')}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#111E2C] hover:bg-[#16283B] border border-slate-700 hover:border-emerald-500/40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isArabic ? 'فتح إعدادات النظام للملفات' : 'Open Android Storage Settings'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(adbAllFilesCmd, 'all_files_cmd')}
                  className="py-2 px-3 rounded-xl bg-[#050A10] hover:bg-slate-800 border border-slate-850 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                  title={isArabic ? 'نسخ أمر ADB/Root' : 'Copy ADB/Root command'}
                >
                  {copiedCmd === 'all_files_cmd' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{isArabic ? 'تم النسخ' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'أمر الشل' : 'Shell Cmd'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct File Picker / Storage Explorer */}
              <div className="bg-[#050A10] p-2.5 rounded-xl border border-slate-850 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    {isArabic ? 'فحص / اختيار ملفات اللعبة من الهاتف:' : 'Pick Game File from Storage:'}
                  </span>
                  <label
                    htmlFor="game-file-input"
                    className="cursor-pointer px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition-all"
                  >
                    {isArabic ? 'استعراض الذاكرة' : 'Browse Storage'}
                  </label>
                  <input
                    id="game-file-input"
                    type="file"
                    accept=".ini,.cfg,.sh,.apk,.json,.txt,.obb"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {selectedFileName ? (
                  <div className="text-[11px] font-mono text-emerald-300 bg-[#09111D] p-2 rounded-lg border border-emerald-500/30 flex items-center justify-between">
                    <span className="truncate">{selectedFileName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500 font-mono">
                    {isArabic ? 'يدعم قراءة: Android/data, Android/obb, UserCustom.ini, *.sh' : 'Supports: Android/data, Android/obb, UserCustom.ini, *.sh'}
                  </div>
                )}

                {fileStatusMsg && (
                  <div className="text-[10px] text-emerald-400 font-mono">
                    {fileStatusMsg}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Display Over Other Apps Permission (SYSTEM_ALERT_WINDOW) */}
          <div className="bg-[#09111D] border border-slate-800 rounded-2xl p-4 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
                    <span>{isArabic ? 'السماح بالعرض فوق الشاشة والتطبيقات' : 'Display Over Other Apps'}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400">
                    SYSTEM_ALERT_WINDOW (In-Game Floating HUD)
                  </span>
                </div>
              </div>

              {/* Status Switch */}
              <button
                id="toggle-overlay-perm-btn"
                onClick={() => {
                  if (!overlayGranted) {
                    handleGrantOverlay();
                  } else {
                    setOverlayGranted(false);
                  }
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                  overlayGranted
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-red-500/20 text-red-300 border-red-500/40'
                }`}
              >
                {overlayGranted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'ممنوح / مفعل' : 'Granted'}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'مطلوب' : 'Required'}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-[#91A5B8] leading-relaxed">
              {isArabic
                ? 'يتيح إظهار عداد الفريمات (FPS Counter) المباشر، ومراقبة حرارة المعالج والبطارية ونافذة التيربو العائمة فوق أي لعبة أثناء تشغيلها.'
                : 'Enables real-time floating FPS counter, CPU/Battery thermals and in-game turbo boost overlay while playing games.'}
            </p>

            {/* Actions for Overlay */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="open-overlay-settings-btn"
                  onClick={() => handleOpenAndroidSettings('overlay')}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#111E2C] hover:bg-[#16283B] border border-slate-700 hover:border-cyan-500/40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isArabic ? 'فتح إعدادات العرض فوق التطبيقات' : 'Open Overlay Settings'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(adbOverlayCmd, 'overlay_cmd')}
                  className="py-2 px-3 rounded-xl bg-[#050A10] hover:bg-slate-800 border border-slate-850 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                  title={isArabic ? 'نسخ أمر ADB/Root' : 'Copy ADB/Root command'}
                >
                  {copiedCmd === 'overlay_cmd' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-cyan-400">{isArabic ? 'تم النسخ' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'أمر الشل' : 'Shell Cmd'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Launch In-Game Floating HUD Button */}
              <button
                type="button"
                id="launch-floating-hud-btn"
                onClick={onOpenOverlayHUD}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#09111D] font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
              >
                <Eye className="w-4 h-4" />
                <span>
                  {isOverlayActive
                    ? (isArabic ? 'النافذة العائمة نشطة الآن على الشاشة' : 'Floating Overlay is Active Now')
                    : (isArabic ? 'تشغيل عداد الفريمات والنافذة العائمة فوق الشاشة' : 'Launch In-Game Floating Overlay HUD')}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational Guidance Box */}
        <div className="bg-[#09111D] border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 text-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {isArabic
              ? 'تلميح: بعد منح إذن العرض فوق الشاشة، يمكنك سحب نافذة عداد الفريمات في أي زاوية أثناء لعب "أوكسيد سيرفايفل" أو أي لعبة أخرى لمراقبة الأداء والاستقرار.'
              : 'Tip: After granting overlay permission, you can drag the floating FPS counter to any corner while playing Oxide: Survival Island or any other game.'}
          </p>
        </div>

      </div>
    </CollapsibleCard>
  );
};
