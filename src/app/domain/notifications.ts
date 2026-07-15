/**
 * @file notifications.ts
 * @description Notification channel abstraction.
 *
 * Ported from YYC3-Dynasty-Framework edict/backend/app/channels/base.py
 * Protocol pattern. Defines the pluggable channel interface and 7 channels.
 */

import type { ChannelType, NotificationChannelInfo, NotificationPayload } from './types';

// ── Channel Registry ─────────────────────────────────────────────────────

export const CHANNELS: readonly NotificationChannelInfo[] = [
  {
    type: 'feishu',
    label: '飞书 / Lark',
    icon: '🐦',
    placeholder: 'https://open.feishu.cn/open-apis/bot/v2/hook/...',
    allowedDomains: ['open.feishu.cn', 'open.larksuite.com'],
  },
  {
    type: 'wecom',
    label: '企业微信',
    icon: '💬',
    placeholder: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=...',
    allowedDomains: ['qyapi.weixin.qq.com'],
  },
  {
    type: 'telegram',
    label: 'Telegram',
    icon: '✈️',
    placeholder: 'https://api.telegram.org/bot<token>/sendMessage',
    allowedDomains: ['api.telegram.org'],
  },
  {
    type: 'discord',
    label: 'Discord',
    icon: '🎮',
    placeholder: 'https://discord.com/api/webhooks/...',
    allowedDomains: ['discord.com', 'discordapp.com'],
  },
  {
    type: 'slack',
    label: 'Slack',
    icon: '#️⃣',
    placeholder: 'https://hooks.slack.com/services/...',
    allowedDomains: ['hooks.slack.com'],
  },
  {
    type: 'qq',
    label: 'QQ 机器人',
    icon: '🐧',
    placeholder: 'https://api.sgroup.qq.com/...',
    allowedDomains: ['api.sgroup.qq.com'],
  },
  {
    type: 'webhook',
    label: '通用 Webhook',
    icon: '🔗',
    placeholder: 'https://your-server.com/webhook',
    allowedDomains: [],
  },
];

export const CHANNEL_MAP: Readonly<Record<string, NotificationChannelInfo>> = Object.fromEntries(
  CHANNELS.map((c) => [c.type, c]),
);

// ── Validation ───────────────────────────────────────────────────────────

export function validateWebhook(url: string, channelType: ChannelType): boolean {
  const channel = CHANNEL_MAP[channelType];
  if (!channel) return false;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;

    // Webhook channel accepts any HTTPS domain
    if (channel.allowedDomains.length === 0) return true;

    return channel.allowedDomains.some(
      (d) => parsed.hostname === d || parsed.hostname.endsWith(`.${d}`),
    );
  } catch {
    return false;
  }
}

// ── Message Builders (per-channel payload formats) ────────────────────────

export function buildPayload(
  channelType: ChannelType,
  payload: NotificationPayload,
): Record<string, unknown> {
  const { title, content, url } = payload;

  switch (channelType) {
    case 'feishu':
      return {
        msg_type: 'interactive',
        card: {
          header: { template: 'blue', title: { tag: 'plain_text', content: title } },
          elements: [
            { tag: 'div', lark_md: content },
            ...(url
              ? [
                  {
                    tag: 'action',
                    actions: [
                      {
                        tag: 'button',
                        text: { tag: 'plain_text', content: '查看详情' },
                        url,
                        type: 'primary',
                      },
                    ],
                  },
                ]
              : []),
          ],
        },
      };

    case 'wecom':
      return {
        msgtype: 'markdown',
        markdown: { content: `## ${title}\n${content}${url ? `\n[查看详情](${url})` : ''}` },
      };

    case 'telegram':
      return {
        text: `*${title}*\n${content}${url ? `\n[🔗 查看详情](${url})` : ''}`,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      };

    case 'discord':
      return {
        embeds: [{ title, description: content, color: 5814783, ...(url ? { url } : {}) }],
      };

    case 'slack':
      return {
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: title } },
          { type: 'section', text: { type: 'mrkdwn', text: content } },
        ],
      };

    case 'qq':
      return {
        msg_type: 0,
        content: `${title}\n${content}${url ? `\n${url}` : ''}`,
      };

    case 'webhook':
    default:
      return { title, content, url, source: 'edict' };
  }
}
