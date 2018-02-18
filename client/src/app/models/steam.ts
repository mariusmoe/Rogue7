
export interface SteamServer {
	id?: string;
	title: string;
	route: string;
	type: string;
	address: string;
	port: string;
}


export interface GameDig {
	bots: [any];
	map: string;
	maxplayers: number;
	name: string;
	password: boolean;
	players: [GameDigPlayer];
	query?: GameDigQuery;
	raw?: GameDigRaw;
	lastUpdate?: Date; // Added separately from GameDig
}

interface GameDigPlayer {
	name: string;
	score: number;
	time: number;
	timeDate?: Date; // Added separately from GameDig
}

interface GameDigQuery {
	address: string;
	host: string;
	port: number;
	port_query: number;
	pretty: string;
	type: string;
}

interface GameDigRaw {
	environment: string;
	folder: string;
	game: string;
	gameid: string;
	listentype: string;
	numbots: number;
	numplayers: number;
	port: number;
	protocol: number;
	rules: GameDigRules;
	secure: number;
	steamappid: number;
	steamid: string;
	tags: string; // commaseparated tags within the string
	version: string; // a.b.c.d
}

interface GameDigRules {
	BuildId_s: string;  // number string
	CUSTOMSERVERNAME_s: string;
	DayTime_s: string;
	GameMode_s: string;
	MATCHTIMEOUT_f: string;  // number string
	MINORBUILDID_s: string;  // number string
	ModId_l: string; // number string
	NUMOPENPUBCONN: string; // number string
	Networking_i: string; // number string
	OFFICIALSERVER_i: string; // boolean-number string
	OWNINGID: string; // number string
	OWNINGNAME: string; // number string
	P2PADDR: string; // number string
	P2PPORT: string; // number string
	SEARCHKEYWORDS_s: string;
	SERVERUSESBATTLEYE_b: string; // boolean string
	SESSIONFLAGS: string; // "683", so far.
	ServerPassword_b: string; // boolean string
}
