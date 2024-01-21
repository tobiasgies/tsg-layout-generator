export class RacetimeUser {

}

function getRacetimeData(p1_rid: string, p2_rid: string) {
    let p1Req = UrlFetchApp.fetch("https://racetime.gg/user/" + p1_rid + "/data");
    let p2Req = UrlFetchApp.fetch("https://racetime.gg/user/" + p2_rid + "/data");

    if (p1Req.getResponseCode() != 200 || p2Req.getResponseCode() != 200) {
        return null;
    }

    // Find players
    const p1 = JSON.parse(p1Req.getContentText());
    const p2 = JSON.parse(p2Req.getContentText());
    const players = [p1, p2];

    // Get players races
    const races = []; //0: p1, 1: p2
    const stats = []; //0: p1, 1: p2
    for (let p = 0; p < players.length; ++p) {
        let numPage = 1;
        let maxPage = 1;
        const pRaces = [];
        const pStats = {
            "pronouns": null,
            "bestTime": null,
            "bestTimeRace": null,
            "bestTimeDate": null,
            "nb_races": 0,
            "ranked1": 0,
            "ranked2": 0,
            "ranked3": 0,
            "forfeited": 0,
            "win": 0,
            "lose": 0,
            "draw": 0
        };

        if (players[p] != null) {
            pStats.pronouns = players[p].pronouns;
            // Fetch player races
            do {
                let req = UrlFetchApp.fetch("https://racetime.gg" + players[p].url + "/races/data?show_entrants=1&page=" + numPage);
                const tmpResp = JSON.parse(req.getContentText());
                maxPage = tmpResp.num_pages;

                // Compute player stats from races
                for (let r = 0; r < tmpResp.races.length; ++r) {
                    const currentRace = tmpResp.races[r];

                    // Only process recorded ootr std races
                    if (currentRace.goal.name === "Triforce Blitz"
                        && !currentRace.goal.custom
                        && currentRace.category.slug === "ootr") {

                        const entrant = currentRace.entrants.filter(e => e.user.full_name === players[p].full_name)[0] || null;
                        if (entrant != null) {
                            if (entrant.place == null) { // Forfeit
                                ++pStats.forfeited;
                            } else { // Finish
                                const time = entrant.finish_time.substring(4);
                                if (pStats.bestTime == null || _isBetterFinishTime(time, pStats.bestTime)) {
                                    pStats.bestTime = time;
                                    pStats.bestTimeRace = currentRace.name;
                                    pStats.bestTimeDate = Utilities.formatDate(new Date(entrant.finished_at), "Etc/UTC", "yyyy-MM-dd");
                                }

                                if (entrant.place === 1) {
                                    ++pStats.ranked1;
                                } else if (entrant.place === 2) {
                                    ++pStats.ranked2;
                                }
                                if (entrant.place === 3) {
                                    ++pStats.ranked3;
                                }
                            }

                            pRaces.push({"name": currentRace.name, "place": entrant.place});
                        }
                    }
                }
            }
            while (++numPage <= maxPage);

            pStats.nb_races = pRaces.length;
        }

        races.push(pRaces);
        stats.push(pStats);
    }

    // If both players were found, compute vs stats
    for (let r1 = 0; r1 < races[0].length; ++r1) {
        const p1race = races[0][r1];
        const p2race = races[1].filter(r2 => r2.name === p1race.name)[0] || null;

        if (p2race != null) {
            if (p1race.place == p2race.place) {
                ++stats[0].draw;
                ++stats[1].draw;
            } else if (p1race.place != null && p2race.place == null) {
                ++stats[0].win;
                ++stats[1].lose;
            } else if (p1race.place == null && p2race.place != null) {
                ++stats[0].lose;
                ++stats[1].win;
            } else if (p1race.place < p2race.place) {
                ++stats[0].win;
                ++stats[1].lose;
            } else {
                ++stats[0].lose;
                ++stats[1].win;
            }
        }
    }


    return {
        "p1": stats[0],
        "p2": stats[1]
    };
}

const _regFinishTime = /([0-9]+)H([0-9]+)M([0-9]+(\.[0-9]+)?)S/;

function _isBetterFinishTime(t1, t2) {
    const m1 = t1.match(_regFinishTime);
    const m2 = t2.match(_regFinishTime);

    const time1 = (+m1[1] * 3600) + (+m1[2] * 60) + parseFloat(m1[3]);
    const time2 = (+m2[1] * 3600) + (+m2[2] * 60) + parseFloat(m2[3]);

    return time1 <= time2;
}
