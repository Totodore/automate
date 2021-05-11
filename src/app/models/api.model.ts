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
    public activated: boolean,
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

export class MemberModel {

  constructor(
    public name: string,
    public username: string,
    public id: string
  ) {}
}

export class DataMessageModel {
  constructor(
    public message: string,
    public parsedMessage: string,
  ) {}
}

export class PostMessageModel extends DataMessageModel {
  constructor(
    public channelId: string,
    public description: string,
    public message: string,
    public parsedMessage: string,
  ) { super(message, parsedMessage) }
}

export class PostFreqMessageInModel extends PostMessageModel {
  
  constructor(
    public channelId: string,
    public description: string,
    public message: string,
    public parsedMessage: string,
    public cron: string
  ) { super(channelId, description, message, parsedMessage) }

}

export class PostPonctMessageInModel extends PostMessageModel {

  constructor(
    public channelId: string,
    public description: string,
    public message: string,
    public parsedMessage: string,
    public date: string
  ) { super(channelId, description, message, parsedMessage) }
}