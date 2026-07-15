/**
 * @file zh-CN.ts
 * @description YYC³ Dynasty 项目专属中文字典
 *
 * 本文件只包含 Dynasty 项目本身的 UI 文案。@yyc3/i18n-core 内置的
 * zh-CN.ts 已提供 common.{welcome, save, cancel, loading, error, ...}
 * 等通用键，可直接使用，无需在此重复定义。
 *
 * key 命名约定：`<page>.<area>.<element>` 或 `<component>.<element>`
 */

export const zhCN = {
  app: {
    name: 'YYC³ Dynasty',
    tagline: '三省六部 · 敕令',
    subtitle: '言启千行代码 · 语枢万物智能',
    location: '紫微城 · 洛阳',
    edictProtocol: 'YanYu Edict Protocol',
  },

  nav: {
    court: '朝堂总览',
    edict: '旨意工坊',
    honors: '勋章圣殿',
    skills: '藏经阁',
    workflow: '工部作坊',
    bridge: '双星桥',
    hr: '吏部',
    role: '皇帝',
    dashboard: '全屏看板',
    backToCourt: '返回朝堂',
  },

  welcome: {
    roles: {
      emperor: '皇帝',
      emperorDesc: '天子',
      prince: '太子',
      princeDesc: '储君',
      zhongshu: '中书',
      zhongshuDesc: '草拟',
      menxia: '门下',
      menxiaDesc: '审议',
      shangshu: '尚书',
      shangshuDesc: '派发',
      ministries: '六部',
      ministriesDesc: '执行',
    },
  },

  edict: {
    boardTitle: '旨意工坊',
    boardDesc: '拖拽敕令进行节点流转，模拟三省六部真实审批链路',
    archive: '奏折阁 (史料)',
    newEdict: '+ 拟定新旨',
    backToCourt: '返回朝堂',
    sealedHint: '已盖玺发牌',
    draftTitle: '拟定新旨',
    draftTypeLabel: '旨意类型',
    draftTitleLabel: '主旨（标题）',
    draftContentLabel: '内容（详情）',
    draftTitlePlaceholder: '例如：调拨户部银两支援前线',
    draftContentPlaceholder: '输入具体旨意要求...',
    draftCancel: '取消',
    draftSubmit: '降旨',
    workflowActionsLabel: '流转操作',
    // Canonical status labels (10 states)
    status: {
      待承旨: '待承旨',
      待草拟: '待草拟',
      待审议: '待审议',
      待派发: '待派发',
      待执行: '待执行',
      执行中: '执行中',
      待回奏: '待回奏',
      待复核: '待复核',
      已办结: '已办结',
      阻塞中: '阻塞中',
      已撤销: '已撤销',
    },
    // Column labels (combine stage + node)
    columnLabels: {
      待承旨: '天堂 (待承旨)',
      待草拟: '中书 (待草拟)',
      待审议: '门下 (待审议)',
      待派发: '尚书 (待派发)',
      待执行: '六部 (待执行)',
      执行中: '六部 (执行中)',
      待回奏: '六部 (待回奏)',
      待复核: '门下 (待复核)',
      已办结: '定鼎门 (已办结)',
      阻塞中: '阻塞中',
      已撤销: '已撤销',
    },
  },

  archive: {
    title: '定鼎门 · 奏折阁',
    desc: '查看已办结任务的完整流转回溯与史料归档',
    backToEdict: '返回旨意工坊',
    empty: '尚无已归档的奏折',
    viewOriginal: '查阅原文',
    historyTitle: '全链路流转回溯',
  },

  placeholder: {
    honors: '凌烟阁 · 勋章殿',
    skills: '尚书省 · 技法库',
    workflow: '门下省 · 律令格式',
    bridge: '天津桥 · 跨域星桥',
    hr: '吏部 · 官谱名册',
    department: '六部 · 职司公府',
    default: '未央宫 · 建设中',
    body: '工部巧匠正在连夜修缮此殿。飞檐斗拱尚未合拢，请诸位上官移步他处暂歇，静候来日紫微城金碧辉煌之时。',
    returnToCourt: '起驾回朝 (大盘)',
    goBack: '原路退回',
  },

  // Common shared strings used by DashboardPage
  dashboard: {
    globalDashboard: '全局看板',
    viewEdict: '查阅圣旨',
    rejectEdit: '驳回修改',
    applySeal: '加盖尚书印',
    flowTrace: '流转轨迹',
  },

  // Language switcher
  lang: {
    label: '语言',
    zhCN: '简体中文',
    en: 'English',
  },
} as const;
