export namespace Discord {
	export interface GuildInfo {
		owner: boolean;
		permissions: number;
		icon: string | null;
		id: string;
		name: string;
		features?: string[] | undefined;
	}

	export interface Profile {
		id: string;
		provider: "discord";
		username: string;
		locale: string;
		mfa_enabled: boolean;
		flags: number;
		banner: string | null;
		accent_color: number | null;
		avatar: string | null;
		discriminator: string;
		verified: boolean;
		fetchedAt: string;
		email?: string | undefined; // requires "email" scope
		guilds?: GuildInfo[] | undefined; // requires "guilds" scope
	}
}