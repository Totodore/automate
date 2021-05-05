import { Profile, GuildInfo } from 'passport-discord';
export class GuildModel {
  constructor(
    public id: string,
    public timezone: string,
    public timezoneCode: string,
    public messages: MessageModel[],
    public name?: string,
    public profile?: string
  ) { }
}
export class UserModel {
  constructor(  
    public id: string,
    public name: string,
    public profile: string,
    public messages: MessageModel[],
  ) {}
}
export class MessageModel {

  constructor(
    public id: string,
    public channelId: string,
    public cron: string,
    public date: Date,
    public parsedMessage: string,
    public rawMessage: string,
    public description: string,
    public type: MessageType,
    public guild: GuildModel,
    public creator: UserModel,
    public files: File[],
    public updatedDate: Date,
    public channelName?: string,
  ) { }
}

export interface DiscordProfile extends Profile {
  guilds: DiscordGuild[];
}
export interface DiscordGuild extends GuildInfo {
  added: boolean;
}
export enum MessageType {
  PONCTUAL,
  FREQUENTIAL
}