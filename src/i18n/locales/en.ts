/**
 * @file en.ts
 * @description English translations for the YYC³ Dynasty project.
 *
 * Cultural context: the Dynasty UI overlays a Tang-dynasty governance model
 * onto an AI workflow dashboard. English strings preserve the metaphor where
 * useful (e.g. "Edict" rather than "Task Order", "Six Ministries" rather
 * than "Departments") so the brand identity survives translation.
 */

export const en = {
  app: {
    name: 'YYC³ Dynasty',
    tagline: 'Three Departments · Six Ministries',
    subtitle: 'Words that shape code · Language that moves worlds',
    location: 'Purple Palace · Luoyang',
    edictProtocol: 'YanYu Edict Protocol',
  },

  nav: {
    court: 'Court Hall',
    edict: 'Edict Workshop',
    honors: 'Hall of Honors',
    skills: 'Scripture Vault',
    workflow: 'Works Bureau',
    bridge: 'Twin-Star Bridge',
    hr: 'Personnel',
    role: 'Emperor',
    dashboard: 'Fullscreen',
    backToCourt: 'Back to Court',
  },

  welcome: {
    roles: {
      emperor: 'Emperor',
      emperorDesc: 'Son of Heaven',
      prince: 'Crown Prince',
      princeDesc: 'Heir',
      zhongshu: 'Secretariat',
      zhongshuDesc: 'Drafts',
      menxia: 'Chancellery',
      menxiaDesc: 'Reviews',
      shangshu: 'Department',
      shangshuDesc: 'Dispatch',
      ministries: 'Ministries',
      ministriesDesc: 'Executes',
    },
  },

  edict: {
    boardTitle: 'Edict Workshop',
    boardDesc: 'Drag edicts between columns to simulate the real three-department approval chain',
    archive: 'Archive (records)',
    newEdict: '+ Draft new edict',
    backToCourt: 'Back to Court',
    sealedHint: 'Sealed & token issued',
    draftTitle: 'Draft New Edict',
    draftTypeLabel: 'Edict type',
    draftTitleLabel: 'Subject (title)',
    draftContentLabel: 'Content (details)',
    draftTitlePlaceholder: 'e.g. Allocate treasury silver to the front line',
    draftContentPlaceholder: 'Enter specific edict requirements...',
    draftCancel: 'Cancel',
    draftSubmit: 'Decree',
    workflowActionsLabel: 'Workflow actions',
    status: {
      待承旨: 'Pending intake',
      待草拟: 'Pending draft',
      待审议: 'Pending review',
      待派发: 'Pending dispatch',
      执行中: 'Executing',
      待回奏: 'Pending report',
      已办结: 'Closed',
    },
    columnLabels: {
      待承旨: 'Heaven (intake)',
      待草拟: 'Secretariat (draft)',
      待审议: 'Chancellery (review)',
      待派发: 'Department (dispatch)',
      执行中: 'Ministries (executing)',
      待回奏: 'Ministries (reporting)',
      已办结: 'Dingding Gate (closed)',
    },
  },

  archive: {
    title: 'Dingding Gate · Records Hall',
    desc: 'Review the full trace and archived history of completed tasks',
    backToEdict: 'Back to Edict Workshop',
    empty: 'No archived reports yet',
    viewOriginal: 'View original',
    historyTitle: 'Full-chain flow trace',
  },

  placeholder: {
    honors: 'Glory Hall · Hall of Medals',
    skills: 'Secretariat · Skill Library',
    workflow: 'Chancellery · Regulations',
    bridge: 'Tianjin Bridge · Cross-domain',
    hr: 'Personnel · Roster',
    department: 'Six Ministries · Bureau',
    default: 'Weiyang Palace · Under construction',
    body: 'The Works Bureau artisans are rebuilding this hall overnight. The eaves are not yet joined; please withdraw elsewhere for now and await the day Purple Forbidden City gleams in gold.',
    returnToCourt: 'Return to Court (overview)',
    goBack: 'Go back',
  },

  dashboard: {
    globalDashboard: 'Overview',
    viewEdict: 'View Edict',
    rejectEdit: 'Reject edit',
    applySeal: 'Apply seal',
    flowTrace: 'Flow trace',
  },

  lang: {
    label: 'Language',
    zhCN: '简体中文',
    en: 'English',
  },
} as const;
