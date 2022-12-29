import { Tab } from './../components/dashboard/guild-board/guild-add-message/cron-editor/cron-options';
import { StateDataModel } from '../components/dashboard/guild-board/guild-add-message/cron-editor/cron-options';
import { Discord } from './discord.model';
export class UserModel {
  constructor(  
    public id: string,
    public name: string,
    public profile: string | null,
    public messages?: MessageModel[],
  ) {}
}
export class MessageModel {

  constructor(
    public id: string,
    public channelId: string,
    public cron: string,
    public date: Date,
    public parsedMessage: string,
    public message: string,
    public description: string,
    public type: MessageType,
    public creator: UserModel,
    public files: File[],
    public activated: boolean,
    public updatedDate: Date,
    public channelName?: string,
    public cronState?: Partial<StateDataModel>,
    public cronTab?: Tab,
  ) { }
}

export interface DiscordProfile extends Discord.Profile {
  guilds: DiscordGuild[];
  joinedServer: boolean;
}
export interface DiscordGuild extends Discord.GuildInfo {
  added: boolean;
}
export enum MessageType {
  PONCTUAL = "PONCTUAL",
  FREQUENTIAL = "FREQUENTIAL"
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
    public scope: boolean,
    public removeOneTimeMessage: boolean,
    public currentQuota: number,
    public maxQuota: number
  ) {}

}

export interface GuildElement {
  name: string;
  id: string;
  type: TagType
}

export enum TagType {
  Role,
  Person,
  Channel
}

export class MemberModel {

  constructor(
    public name: string,
    public username: string,
    public id: string,
    public type: TagType
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
    public cron: string,
    public cronState?: Partial<StateDataModel>,
    public cronTab?: Tab,
  ) { super(channelId, description, message, parsedMessage) }

}

export class PostPonctMessageInModel extends PostMessageModel {

  constructor(
    public channelId: string,
    public description: string,
    public message: string,
    public parsedMessage: string,
    public date: string,
    public cronState?: Partial<StateDataModel>,
    public cronTab?: Tab,
  ) { super(channelId, description, message, parsedMessage) }
}

export class PatchMessageModel {
  
  constructor(
    public date: string | null,
    public channelId: string,
    public description: string,
    public message: string,
    public parsedMessage: string,
    public cron: string | null,
    public cronState?: Partial<StateDataModel> | null,
    public cronTab?: Tab | null,
  ) {}

}