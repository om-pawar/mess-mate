import React, { useState } from 'react';
import {
  BellRing,
  Send,
  Save,
  Trash2,
  Smartphone,
  CheckCircle2,
  Eye,
  PenSquare,
  Sparkles,
  Inbox,
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { TEMPLATES } from '../../services/messService';

export const AnnounceTab = () => {
  const { announcements, handleSendBroadcast, totalSubscribed, addToast } = useMess();

  // Composer Form State
  const [category, setCategory] = useState('🚨 Emergency / Closure');
  const [urgentPush, setUrgentPush] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState(`All Students (${totalSubscribed})`);

  const handleTemplateClick = (tpl) => {
    setCategory(tpl.category);
    setUrgentPush(tpl.urgentPush);
    setSubject(tpl.subject);
    setContent(tpl.content);
    setAudience(`All Students (${totalSubscribed})`);
    addToast('Template Loaded', `Filled template for "${tpl.name}".`, 'info');
  };

  const handleClear = () => {
    setSubject('');
    setContent('');
    addToast('Cleared', 'Form fields reset.', 'info');
  };

  const handleSaveDraft = () => {
    addToast('Draft Saved', 'Your announcement draft is saved locally.', 'success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      addToast('Missing Details', 'Please enter a broadcast subject and content.', 'error');
      return;
    }
    handleSendBroadcast({
      category,
      urgentPush,
      subject,
      content,
      audience,
    });
    setSubject('');
    setContent('');
  };

  return (
    <div className="space-y-4 px-4 py-3">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span className="uppercase text-[11px] font-bold text-slate-700 tracking-wider">
              BROADCAST HUB • HOSTEL 4 VEG MESS
            </span>
          </div>
          <span className="bg-[#EFF6FF] text-[#1E40AF] px-2 py-0.5 rounded text-[10px] font-bold">
            Live Node
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Mess Announcements
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Send instant push alerts & urgent dining updates to {totalSubscribed} subscribed hostelers
        </p>
      </div>

      {/* 3 KPI Mini-Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white border border-slate-200 rounded-2xl p-2.5 text-center shadow-xs">
          <p className="text-[10px] font-mono uppercase text-slate-600 font-semibold">TOTAL AUDIENCE</p>
          <p className="text-base font-extrabold text-slate-900 mt-0.5">
            {totalSubscribed} <span className="text-[10px] font-normal text-emerald-600">{totalSubscribed > 0 ? '100%' : '0%'}</span>
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5 font-medium">Verified devices</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-2.5 text-center shadow-xs">
          <p className="text-[10px] font-mono uppercase text-slate-600 font-semibold">AVG DELIVERY</p>
          <p className="text-base font-extrabold text-slate-900 mt-0.5">
            {announcements.length > 0 ? '1.4s' : '0.0s'} <span className="text-amber-500">⚡</span>
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5 font-medium">Ultra-low latency</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-2.5 text-center shadow-xs">
          <p className="text-[10px] font-mono uppercase text-slate-600 font-semibold">READ RATE</p>
          <p className="text-base font-extrabold text-[#16A34A] mt-0.5">
            {announcements.length > 0 ? '94.8%' : '0.0%'} <span className="text-xs">↑</span>
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5 font-medium">Within 15 mins</p>
        </div>
      </div>

      {/* New Announcement Composer Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
            <PenSquare className="w-4 h-4 text-slate-700" />
            <span>New Announcement</span>
          </div>
          <span className="bg-[#EFF6FF] text-[#1E40AF] text-[10px] font-mono font-medium px-2 py-0.5 rounded">
            Live Composer
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Priority & Category Pills */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
              NOTICE PRIORITY & CATEGORY
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['🚨 Emergency / Closure', '⏰ Timing Update', '🍛 Special Menu'].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Urgent Push Alert Override */}
          <div className="bg-[#DCFCE7]/60 border border-[#86EFAC] rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#16A34A] text-white flex items-center justify-center shrink-0">
                <BellRing className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Urgent Push Alert Override</p>
                <p className="text-[10px] text-slate-600">
                  Triggers high-priority audible alerts on student devices
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setUrgentPush(!urgentPush)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                urgentPush ? 'bg-[#16A34A]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  urgentPush ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Broadcast Subject */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold">
                BROADCAST SUBJECT
              </label>
              <span className="text-[10px] font-mono text-slate-600 font-medium">
                {subject.length} / 80
              </span>
            </div>
            <input
              type="text"
              maxLength={80}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Dinner Timing Postponed by 30 mins"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          {/* Notice Content */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold">
                NOTICE CONTENT
              </label>
              <span className="text-[10px] font-mono text-slate-600 font-medium">
                {content.length} / 280
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={280}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type urgent dining instructions, menu changes or reminders..."
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none leading-relaxed"
              required
            />
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
              RECIPIENT TARGET AUDIENCE
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                `All Students (${totalSubscribed})`,
                `Hostel 4 (${totalSubscribed})`,
                `Active Plan (${totalSubscribed})`,
              ].map((aud) => (
                <button
                  type="button"
                  key={aud}
                  onClick={() => setAudience(aud)}
                  className={`text-[11px] font-medium py-1.5 px-2 rounded-xl border transition-all cursor-pointer text-center ${
                    audience === aud
                      ? 'bg-black text-white border-black font-semibold'
                      : 'bg-[#EFF6FF] text-[#1E40AF] border-blue-100 hover:bg-blue-100'
                  }`}
                >
                  {aud}
                </button>
              ))}
            </div>
          </div>

          {/* Live Lock-Screen Preview */}
          <div className="bg-[#EFF6FF] border border-blue-100 rounded-xl p-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px] uppercase tracking-wider mb-1">
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>LIVE LOCK-SCREEN PREVIEW</span>
            </div>
            <p className="font-bold text-slate-900 truncate">
              MessMate: {subject || 'Announcement Subject Preview'}
            </p>
            <p className="text-[11px] text-slate-600 truncate mt-0.5">
              {content || 'Announcement content will appear live on student mobile lock screens...'}
            </p>
          </div>

          {/* Primary Submit CTA */}
          <button
            type="submit"
            className="w-full bg-[#0F172A] hover:bg-black text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-[0.99]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Broadcast Now ({totalSubscribed} Students)</span>
          </button>

          {/* Draft & Clear Row */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span>Save as Draft</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-medium text-slate-600 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Clear Fields</span>
            </button>
          </div>
        </form>
      </div>

      {/* Quick One-Tap Templates */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick One-Tap Templates</span>
          </div>
          <span className="text-[11px] text-slate-500">Tap to populate</span>
        </div>

        <div className="space-y-2">
          {TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => handleTemplateClick(tpl)}
              className="bg-slate-50 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-100 rounded-xl p-2.5 flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base shrink-0">{tpl.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    {tpl.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate max-w-[240px]">
                    {tpl.desc}
                  </p>
                </div>
              </div>
              <span className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all text-sm">
                →
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Broadcasts */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            RECENT BROADCASTS
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {announcements.length} TOTAL
          </span>
        </div>

        {announcements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="font-bold text-xs text-slate-900">No broadcasts sent yet</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Use the composer above to dispatch live dining alerts to students.
            </p>
          </div>
        ) : (
          announcements.map((broadcast) => (
            <div
              key={broadcast.id}
              className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      broadcast.category.includes('EMERGENCY')
                        ? 'bg-[#EFF6FF] text-[#1E40AF]'
                        : 'bg-[#DCFCE7] text-[#15803D]'
                    }`}
                  >
                    {broadcast.category}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                      broadcast.status === 'Active'
                        ? 'bg-[#DCFCE7] text-[#16A34A]'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {broadcast.status === 'Active' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    )}
                    <span>{broadcast.status}</span>
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {broadcast.timestamp}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-xs leading-snug">
                {broadcast.subject}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                {broadcast.content}
              </p>

              <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                  <span>
                    {broadcast.delivered} / {broadcast.total} Delivered ({broadcast.deliveredPct})
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-slate-400" />
                  <span>{broadcast.opened} Opened</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
