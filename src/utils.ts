import { Client, Channel, Guild, Message, User } from "eris";

export type ArbitraryFunction = (...args: any[]) => any;

export type Awaitable<T = unknown> = T | Promise<T>;

/**
 * For unicode emoji, the unicode char/string itself.
 * For custom emoji, a string in the format `"emojiName:emojiID"`.
 * @see https://abal.moe/Eris/docs/Message#function-addReaction
 */
export type Reaction = string;

export function get(obj, path, def?): any {
  let cursor = obj;
  const pathParts = path.split(".");
  for (const part of pathParts) {
    cursor = cursor[part];
    if (cursor === undefined) return def;
    if (cursor == null) return null;
  }
  return cursor;
}

const userMentionRegex = /^<@!?([0-9]+)>$/;
const channelMentionRegex = /^<#([0-9]+)>$/;
const roleMentionRegex = /^<@&([0-9]+)>$/;
const snowflakeRegex = /^[1-9][0-9]{5,19}$/;

export function getUserId(str: string) {
  str = str.trim();

  if (str.match(snowflakeRegex)) {
    // User ID
    return str;
  } else {
    const mentionMatch = str.match(userMentionRegex);
    if (mentionMatch) {
      return mentionMatch[1];
    }
  }

  return null;
}

export function getChannelId(str: string) {
  str = str.trim();

  if (str.match(snowflakeRegex)) {
    // Channel ID
    return str;
  } else {
    const mentionMatch = str.match(channelMentionRegex);
    if (mentionMatch) {
      return mentionMatch[1];
    }
  }

  return null;
}

export function getRoleId(str: string) {
  str = str.trim();

  if (str.match(snowflakeRegex)) {
    // Role ID
    return str;
  } else {
    const mentionMatch = str.match(roleMentionRegex);
    if (mentionMatch) {
      return mentionMatch[1];
    }
  }

  return null;
}

export function resolveUser(bot: Client, str: string) {
  const userId = getUserId(str);
  return userId && bot.users.get(userId);
}

export function resolveMember(guild: Guild, str: string) {
  const memberId = getUserId(str);
  return memberId && guild.members.get(memberId);
}

export function resolveChannel(guild: Guild, str: string) {
  const channelId = getChannelId(str);
  return channelId && guild.channels.get(channelId);
}

export function resolveRole(guild: Guild, str: string) {
  const roleId = getRoleId(str);
  return roleId && guild.roles.get(roleId);
}

export const noop = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

const id = v => v;

export interface EventToGuild {
  [key: string]: (...args: any[]) => Guild | undefined;
}

export interface EventToUser {
  [key: string]: (...args: any[]) => User | undefined;
}

export interface EventToChannel {
  [key: string]: (...args: any[]) => Channel | undefined;
}

export interface EventToMessage {
  [key: string]: (...args: any[]) => Message | undefined;
}

export const eventToGuild: EventToGuild = {
  channelCreate: c => c.guild,
  channelDelete: c => c.guild,
  channelPinUpdate: c => c.guild,
  channelUpdate: c => c.guild,
  guildBanAdd: id,
  guildBanRemove: id,
  guildCreate: id,
  guildDelete: id,
  guildEmojisUpdate: id,
  guildMemberAdd: id,
  guildMemberRemove: id,
  guildMemberChunk: id,
  guildMemberUpdate: id,
  guildUnavailable: id,
  guildUpdate: id,
  guildRoleCreate: id,
  guildRoleDelete: id,
  guildRoleUpdate: id,
  messageCreate: m => m.channel.guild,
  messageDelete: m => m.channel.guild,
  messageDeleteBulk: c => c[0] && c[0].channel && c[0].channel.guild,
  messageReactionAdd: m => m.channel.guild,
  messageReactionRemove: m => m.channel.guild,
  messageReactionRemoveAll: m => m.channel.guild,
  messageUpdate: m => m.channel.guild,
  presenceUpdate: m => m.guild,
  typingStart: c => c && c.guild,
  voiceChannelJoin: m => m.guild,
  voiceChannelLeave: m => m.guild,
  voiceChannelSwitch: m => m.guild,
  voiceStateUpdate: m => m.guild,
  unavailableGuildCreate: id
};

export const eventToUser: EventToUser = {
  guildBanAdd: (_, u) => u,
  guildBanRemove: (_, u) => u,
  guildMemberAdd: (_, m) => m.user,
  guildMemberChunk: (_, m) => m[0] && m[0].user,
  guildMemberRemove: m => m.user,
  guildMemberUpdate: (_, m) => m.user,
  messageCreate: m => m.author,
  messageDelete: m => m.author,
  messageDeleteBulk: m => m[0] && m.author,
  messageReactionAdd: (m, _, uId) => {
    const member = m.channel.guild && m.channel.guild.members.get(uId);
    return member && member.user;
  },
  messageReactionRemove: (m, _, uId) => {
    const member = m.channel.guild && m.channel.guild.members.get(uId);
    return member && member.user;
  },
  messageUpdate: m => m.author,
  presenceUpdate: m => m.user,
  typingStart: (_, u) => u,
  userUpdate: id,
  voiceStateUpdate: m => m.user
};

export const eventToChannel: EventToChannel = {
  messageCreate: m => m.channel,
  messageDelete: m => m.channel,
  messageDeleteBulk: m => m[0] && m.channel,
  messageReactionAdd: m => m.channel,
  messageReactionRemove: m => m.channel,
  messageReactionUpdate: m => m.channel,
  channelCreate: id,
  channelDelete: id,
  channelPinsUpdate: id,
  channelUpdate: id,
  channelRecipientAdd: id,
  channelRecipientRemove: id,
  typingStart: id,
  voiceChannelJoin: (_, c) => c,
  voiceChannelLeave: (_, c) => c,
  voiceChannelSwitch: (_, c) => c
};

export const eventToMessage: EventToMessage = {
  messageCreate: id,
  messageDelete: id,
  messageDeleteBulk: m => m[0],
  messageReactionAdd: id,
  messageReactionRemove: id,
  messageReactionRemoveAll: id,
  messageUpdate: id
};
