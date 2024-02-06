import {Duration} from "tinyduration";
import {ComparableDuration, parse} from "../data/comparable_duration";

export type User = {
    readonly id: string;
    readonly full_name: string;
    readonly name: string;
    readonly discriminator: string | null;
    readonly url: string;
    readonly avatar: string | null;
    readonly pronouns: string | null;
    readonly flair: string;
    readonly twitch_name: string | null;
    readonly twitch_display_name: string;
    readonly twitch_channel: string | null;
    readonly can_moderate: boolean;
    readonly stats?: UserStats;
    readonly teams?: Team[];
    readonly races?: Race[];
}

export type UserStats = {
    readonly joined: number;
    readonly first: number;
    readonly second: number;
    readonly third: number;
    readonly forfeits: number;
}

export type UserRacesResponse = {
    readonly count: number;
    readonly num_pages: number;
    readonly races: Race[];
}

export type Team = {
    readonly name: string;
    readonly slug: string;
    readonly formal: boolean;
    readonly url: string;
    readonly data_url: string;
    readonly avatar: string;
    readonly profile: string;
    readonly categories?: Category[];
    readonly members?: User[];
}

export type RaceStatus = {
    readonly value: string;
    readonly verbose_value: string;
    readonly help_text: string;
}

export type RaceGoal = {
    readonly name: string;
    readonly custom: boolean;
}

export type EntrantStatus = {
    readonly value: string;
    readonly verbose_value: string;
    readonly help_text: string;
}

type BaseEntrant = {
    readonly user: User;
    readonly team?: Team;
    readonly status: EntrantStatus;
    readonly place?: number;
    readonly place_ordinal?: string;
    readonly score?: number;
    readonly score_change: number | null;
    readonly comment: string | null;
    readonly has_comment: boolean;
    readonly stream_live: boolean;
    readonly stream_override: boolean;
}

export type Entrant = {
    readonly finish_time: string | null;
    readonly finished_at: string | null;
} & BaseEntrant

export type EnrichedEntrant = {
    readonly finish_time: ComparableDuration | null;
    readonly finished_at: Date | null;
} & BaseEntrant

export type Category = {
    readonly name: string;
    readonly short_name: string;
    readonly slug: string;
    readonly url: string;
    readonly data_url: string;
    readonly image: string | null;
    readonly info?: string;
    readonly streaming_required?: boolean;
    readonly owners?: User[];
    readonly moderators?: User[];
    readonly goals?: string[];
    readonly current_races?: Race[];
    readonly emotes?: {[name: string]: string};
}

type BaseRace = {
    readonly version?: number;
    readonly name: string;
    readonly slug?: string;
    readonly status: RaceStatus;
    readonly url: string;
    readonly data_url: string;
    readonly websocket_url?: string;
    readonly websocket_bot_url?: string;
    readonly websocket_oauth_url?: string;
    readonly category?: Category;
    readonly goal: RaceGoal;
    readonly info: string;
    readonly info_bot?: string;
    readonly info_user?: string;
    readonly team_race?: boolean;
    readonly entrants_count: number;
    readonly entrants_count_finished: number;
    readonly entrants_count_inactive: number;
    readonly unlisted?: boolean;
    readonly time_limit_auto_complete?: boolean;
    readonly require_even_teams?: boolean;
    readonly streaming_required?: boolean;
    readonly auto_start?: boolean;
    readonly opened_by?: User;
    readonly monitors?: User[];
    readonly recordable?: boolean;
    readonly recorded?: boolean;
    readonly recorded_by?: User;
    readonly allow_comments?: boolean;
    readonly hide_comments?: boolean;
    readonly allow_prerace_chat?: boolean;
    readonly allow_midrace_chat?: boolean;
    readonly allow_non_entrant_chat?: boolean;
}

export type EnrichedRace = {
    readonly opened_at: Date;
    readonly start_delay?: Duration;
    readonly started_at?: Date | null;
    readonly ended_at?: Date | null;
    readonly cancelled_at?: Date | null;
    readonly time_limit: Duration;
    readonly chat_message_delay?: Duration;
    readonly entrants?: EnrichedEntrant[];
} & BaseRace

export type Race = {
    readonly opened_at: string;
    readonly start_delay?: string;
    readonly started_at?: string | null;
    readonly ended_at?: string | null;
    readonly cancelled_at?: string | null;
    readonly time_limit: string;
    readonly chat_message_delay?: string;
    readonly entrants?: Entrant[];
} & BaseRace

export function enrichEntrant(entrant: Entrant): EnrichedEntrant {
    return {
        ...entrant,
        finish_time: (!!entrant.finish_time) ? parse(entrant.finish_time) : null,
        finished_at: (!!entrant.finished_at) ? new Date(entrant.finished_at) : null
    };
}

export function enrichRace(race: Race): EnrichedRace {
    return {
        ...race,
        opened_at: new Date(race.opened_at),
        start_delay: (!!race.start_delay) ? parse(race.start_delay) : null,
        started_at: (!!race.started_at) ? new Date(race.started_at) : null,
        ended_at: (!!race.ended_at) ? new Date(race.ended_at) : null,
        cancelled_at: (!!race.cancelled_at) ? new Date(race.cancelled_at) : null,
        time_limit: parse(race.time_limit),
        chat_message_delay: (!!race.chat_message_delay) ? parse(race.chat_message_delay) : null,
        entrants: (!!race.entrants) ? race.entrants.map(enrichEntrant) : null
    };
}