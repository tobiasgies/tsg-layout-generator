import {Duration} from "tinyduration";
import {ComparableDuration, parse} from "../data/comparable_duration";

export class RacetimeUser {
    readonly id: string;
    readonly full_name: string;
    readonly name: string;
    readonly discriminator: string | null;
    readonly url: string;
    readonly avatar: string;
    readonly pronouns: string;
    readonly flair: string;
    readonly twitch_name: string;
    readonly twitch_display_name: string;
    readonly twitch_channel: string;
    readonly can_moderate: boolean;
    readonly stats: RacetimeUserStats | null;
    readonly teams: RacetimeTeam[] | null;
    readonly races: RacetimeRace[] | null;

    constructor(
        {
            id,
            full_name,
            name,
            discriminator,
            url,
            avatar,
            pronouns,
            flair,
            twitch_name,
            twitch_display_name,
            twitch_channel,
            can_moderate,
            stats = null,
            teams = null,
            races = null
        }: {
            id: string,
            full_name: string,
            name: string,
            discriminator: string | null,
            url: string,
            avatar: string,
            pronouns: string,
            flair: string,
            twitch_name: string,
            twitch_display_name: string,
            twitch_channel: string,
            can_moderate: boolean,
            stats?: RacetimeUserStats | null,
            teams?: RacetimeTeam[] | null,
            races?: RacetimeRace[] | null
        }) {
        this.id = id;
        this.full_name = full_name;
        this.name = name;
        this.discriminator = discriminator;
        this.url = url;
        this.avatar = avatar;
        this.pronouns = pronouns;
        this.flair = flair;
        this.twitch_name = twitch_name;
        this.twitch_display_name = twitch_display_name;
        this.twitch_channel = twitch_channel;
        this.can_moderate = can_moderate;
        this.stats = stats;
        this.teams = teams;
        this.races = races;
    }
}

export class RacetimeUserStats {
    readonly joined: number;
    readonly first: number;
    readonly second: number;
    readonly third: number;
    readonly forfeits: number;

    constructor(
        {
            joined,
            first,
            second,
            third,
            forfeits
        }: {
            joined: number,
            first: number,
            second: number,
            third: number,
            forfeits: number
        }
    ) {
        this.joined = joined;
        this.first = first;
        this.second = second;
        this.third = third;
        this.forfeits = forfeits;
    }
}

export class RacetimeTeam {
    readonly name: string;
    readonly slug: string;
    readonly formal: boolean;
    readonly url: string;
    readonly data_url: string;
    readonly avatar: string;
    readonly profile: string;
    readonly categories: RacetimeCategory[] | null;
    readonly members: RacetimeUser[] | null;

    constructor(
        {
            name,
            slug,
            formal,
            url,
            data_url,
            avatar,
            profile,
            categories = null,
            members = null
        }: {
            name: string,
            slug: string,
            formal: boolean,
            url: string,
            data_url: string,
            avatar: string,
            profile: string,
            categories?: RacetimeCategory[] | null,
            members?: RacetimeUser[] | null
        }
    ) {
        this.name = name;
        this.slug = slug;
        this.formal = formal;
        this.url = url;
        this.data_url = data_url;
        this.avatar = avatar;
        this.profile = profile;
        this.categories = categories;
        this.members = members;
    }
}

export class RacetimeRaceStatus {
    readonly value: string;
    readonly verbose_value: string;
    readonly help_text: string;

    constructor(
        {
            value,
            verbose_value,
            help_text
        }: {
            value: string,
            verbose_value: string,
            help_text: string
        }
    ) {
        this.value = value;
        this.verbose_value = verbose_value;
        this.help_text = help_text;
    }
}

class RacetimeRaceGoal {
    readonly name: string;
    readonly custom: boolean;

    constructor(
        {
            name,
            custom
        }: {
            name: string,
            custom: boolean
        }
    ) {
        this.name = name;
        this.custom = custom;
    }
}

class RacetimeEntrantStatus {
    readonly value: string;
    readonly verbose_value: string;
    readonly help_text: string;

    constructor(
        {
            value,
            verbose_value,
            help_text
        }: {
            value: string,
            verbose_value: string,
            help_text: string
        }
    ) {
        this.value = value;
        this.verbose_value = verbose_value;
        this.help_text = help_text;
    }
}

class RacetimeEntrant {
    readonly user: RacetimeUser;
    readonly team: RacetimeTeam | null;
    readonly status: RacetimeEntrantStatus;
    readonly finish_time: ComparableDuration | null;
    readonly finished_at: Date | null;
    readonly place: number | null;
    readonly place_ordinal: string | null;
    readonly score: number | null;
    readonly score_change: number | null;
    readonly comment: string | null;
    readonly has_comment: boolean;
    readonly stream_live: boolean;
    readonly stream_override: boolean;

    constructor(
        {
            user,
            status,
            stream_live,
            stream_override,
            has_comment,
            comment = null,
            team = null,
            score = null,
            score_change = null,
            finish_time = null,
            finished_at = null,
            place = null,
            place_ordinal = null
        }: {
            user: RacetimeUser,
            status: RacetimeEntrantStatus,
            stream_live: boolean,
            stream_override: boolean,
            has_comment: boolean,
            comment?: string | null,
            team?: RacetimeTeam | null,
            score?: number | null,
            score_change?: number | null,
            finish_time?: string | null,
            finished_at?: Date | null,
            place?: number | null,
            place_ordinal?: string | null
        }
    ) {
        this.user = user;
        this.team = team;
        this.status = status;
        this.finish_time = !!finish_time ? parse(finish_time) : null;
        this.finished_at = finished_at;
        this.place = place;
        this.place_ordinal = place_ordinal;
        this.score = score;
        this.score_change = score_change;
        this.comment = comment;
        this.has_comment = has_comment;
        this.stream_live = stream_live;
        this.stream_override = stream_override;
    }
}

class RacetimeCategory {
    readonly name: string;
    readonly short_name: string;
    readonly slug: string;
    readonly url: string;
    readonly data_url: string;
    readonly image: string;
    readonly info: string | null;
    readonly streaming_required: boolean | null;
    readonly owners: RacetimeUser[] | null;
    readonly moderators: RacetimeUser[] | null;
    readonly goals: string[] | null;
    readonly current_races: RacetimeRace[] | null;
    readonly emotes: {[name: string]: string} | null;

    constructor(
        {
            name,
            short_name,
            slug,
            url,
            data_url,
            image,
            info = null,
            streaming_required = null,
            owners = null,
            moderators = null,
            goals = null,
            current_races = null,
            emotes = null
        }: {
            name: string,
            short_name: string,
            slug: string,
            url: string,
            data_url: string,
            image: string,
            info?: string | null,
            streaming_required?: boolean | null,
            owners?: RacetimeUser[] | null,
            moderators?: RacetimeUser[] | null,
            goals?: string[] | null,
            current_races?: RacetimeRace[] | null,
            emotes?: { [name: string]: string } | null
        }
    ) {
        this.name = name;
        this.short_name = short_name;
        this.slug = slug;
        this.url = url;
        this.data_url = data_url;
        this.image = image;
        this.info = info;
        this.streaming_required = streaming_required;
        this.owners = owners;
        this.moderators = moderators;
        this.goals = goals;
        this.current_races = current_races;
        this.emotes = emotes;
    }
}

export class RacetimeRace {
    readonly version: number | null;
    readonly name: string;
    readonly slug: string | null;
    readonly status: RacetimeRaceStatus;
    readonly url: string;
    readonly data_url: string;
    readonly websocket_url: string | null;
    readonly websocket_bot_url: string | null;
    readonly websocket_oauth_url: string | null;
    readonly category: RacetimeCategory | null;
    readonly goal: RacetimeRaceGoal;
    readonly info: string;
    readonly info_bot: string | null;
    readonly info_user: string | null;
    readonly team_race: boolean | null;
    readonly entrants_count: number;
    readonly entrants_count_finished: number;
    readonly entrants_count_inactive: number;
    readonly entrants: RacetimeEntrant[] | null;
    readonly opened_at: Date;
    readonly start_delay: Duration | null;
    readonly started_at: Date | null;
    readonly ended_at: Date | null;
    readonly cancelled_at: Date | null;
    readonly unlisted: boolean | null;
    readonly time_limit: Duration;
    readonly time_limit_auto_complete: boolean | null;
    readonly require_even_teams: boolean | null;
    readonly streaming_required: boolean | null;
    readonly auto_start: boolean | null;
    readonly opened_by: RacetimeUser | null;
    readonly monitors: RacetimeUser[] | null;
    readonly recordable: boolean | null;
    readonly recorded: boolean | null;
    readonly recorded_by: RacetimeUser | null;
    readonly allow_comments: boolean | null;
    readonly hide_comments: boolean | null;
    readonly allow_prerace_chat: boolean | null;
    readonly allow_midrace_chat: boolean | null;
    readonly allow_non_entrant_chat: boolean | null;
    readonly chat_message_delay: Duration | null;

    constructor(
        {
            name,
            status,
            url,
            data_url,
            goal,
            info,
            entrants_count,
            entrants_count_finished,
            entrants_count_inactive,
            opened_at,
            time_limit,
            version = null,
            slug = null,
            websocket_url = null,
            websocket_bot_url = null,
            websocket_oauth_url = null,
            category = null,
            info_bot = null,
            info_user = null,
            team_race = null,
            entrants = null,
            start_delay = null,
            started_at = null,
            ended_at = null,
            cancelled_at = null,
            unlisted = null,
            time_limit_auto_complete = null,
            require_even_teams = null,
            streaming_required = null,
            auto_start = null,
            opened_by = null,
            monitors = null,
            recordable = null,
            recorded = null,
            recorded_by = null,
            allow_comments = null,
            hide_comments = null,
            allow_prerace_chat = null,
            allow_midrace_chat = null,
            allow_non_entrant_chat = null,
            chat_message_delay = null
        }: {
            name: string,
            status: RacetimeRaceStatus,
            url: string,
            data_url: string,
            goal: RacetimeRaceGoal,
            info: string,
            entrants_count: number,
            entrants_count_finished: number,
            entrants_count_inactive: number,
            opened_at: Date,
            time_limit: string,
            version?: number | null,
            slug?: string | null,
            websocket_url?: string | null,
            websocket_bot_url?: string | null,
            websocket_oauth_url?: string | null,
            category?: RacetimeCategory | null,
            info_bot?: string | null,
            info_user?: string | null,
            team_race?: boolean | null,
            entrants?: RacetimeEntrant[] | null,
            start_delay?: string | null,
            started_at?: Date | null,
            ended_at?: Date | null,
            cancelled_at?: Date | null,
            unlisted?: boolean | null,
            time_limit_auto_complete?: boolean | null,
            require_even_teams?: boolean | null,
            streaming_required?: boolean | null,
            auto_start?: boolean | null,
            opened_by?: RacetimeUser | null,
            monitors?: RacetimeUser[] | null,
            recordable?: boolean | null,
            recorded?: boolean | null,
            recorded_by?: RacetimeUser | null,
            allow_comments?: boolean | null,
            hide_comments?: boolean | null,
            allow_prerace_chat?: boolean | null,
            allow_midrace_chat?: boolean | null,
            allow_non_entrant_chat?: boolean | null,
            chat_message_delay?: string | null
        }
    ) {
        this.version = version;
        this.name = name;
        this.slug = slug;
        this.status = status;
        this.url = url;
        this.data_url = data_url;
        this.websocket_url = websocket_url;
        this.websocket_bot_url = websocket_bot_url;
        this.websocket_oauth_url = websocket_oauth_url;
        this.category = category;
        this.goal = goal;
        this.info = info;
        this.info_bot = info_bot;
        this.info_user = info_user;
        this.team_race = team_race;
        this.entrants_count = entrants_count;
        this.entrants_count_finished = entrants_count_finished;
        this.entrants_count_inactive = entrants_count_inactive;
        this.entrants = entrants;
        this.opened_at = opened_at;
        this.start_delay = !!start_delay ? parse(start_delay) : null;
        this.started_at = started_at;
        this.ended_at = ended_at;
        this.cancelled_at = cancelled_at;
        this.unlisted = unlisted;
        this.time_limit = !!time_limit ? parse(time_limit) : null;
        this.time_limit_auto_complete = time_limit_auto_complete;
        this.require_even_teams = require_even_teams;
        this.streaming_required = streaming_required;
        this.auto_start = auto_start;
        this.opened_by = opened_by;
        this.monitors = monitors;
        this.recordable = recordable;
        this.recorded = recorded;
        this.recorded_by = recorded_by;
        this.allow_comments = allow_comments;
        this.hide_comments = hide_comments;
        this.allow_prerace_chat = allow_prerace_chat;
        this.allow_midrace_chat = allow_midrace_chat;
        this.allow_non_entrant_chat = allow_non_entrant_chat;
        this.chat_message_delay = !!chat_message_delay ? parse(chat_message_delay) : null;
    }
}