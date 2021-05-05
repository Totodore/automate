import { Profile, GuildInfo } from 'passport-discord';
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


export class GuildReqModel {
  
  constructor(
    public id: string,
    public messages: MessageModel[],
    public channels: GuildElement[],
    public timezone: string,
    public timezoneCode: string,
    public name: string,
    public roles: GuildElement[],
    public maxMessages: number,
    public scope: boolean
  ) {}

}

export interface GuildElement {
  name: string;
  id: string;
}