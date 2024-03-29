// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  discordCdn: "https://cdn.discordapp.com",
  apiLink: "http://localhost:3000",
  botLink: "https://discord.com/api/oauth2/authorize?client_id=924749236938088448&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fguild%2Fauth&scope=bot&disable_guild_select=true&guild_id=",
  oauthLink: "https://discord.com/api/oauth2/authorize?client_id=924749236938088448&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fuser%2Fauth&response_type=code&scope=identify%20guilds"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
