let fs = require('fs');

const recalculateChordRules = () => {
    let chordRules = [];

    BASE_CHORD_RULES.map(chordRule => {
        let pitchClass = chordRule.pitchClass.slice();

        for (let v = 0; v < chordRule.pitchClass.length; v++) {
            if (v > 0) {
                let firstPitch = pitchClass.shift();
                if (firstPitch >= 0) {
                    pitchClass.push(firstPitch)
                }
            }
            for (let p = 0; p < pitchClass.length; p++) {
                while (p > 0 && pitchClass[p] < pitchClass[p - 1]) {
                    pitchClass[p] += 12;
                }
            }
            chordRules.push({...chordRule, pitchClass: pitchClass.slice(), variation: v});
        }
    });

    fs.writeFile('src/constants/chord-rules-with-variations.ts', "export const CHORD_RULES_WITH_VARIATIONS = " + JSON.stringify(chordRules),
        (err) => {
            if (err) {console.error("Failed to write File", err)};
        });

    return chordRules;
};

const recalculateAllChords = () => {
    let chords = [];
    let chordRules = recalculateChordRules();

    let keys = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

    for (let n = 0; n < 88; n++) {
        let baseKey = keys[n % keys.length];
        for (let c = 0; c < chordRules.length; c++) {
            let chordRule = chordRules[c];
            let pitchClass = chordRule.pitchClass.slice();

            for (let p = 0; p < pitchClass.length; p++) {
                pitchClass[p] += n;
            }

            chords.push({
                ...chordRule,
                pitchClass: pitchClass,
                baseKey: baseKey,
            });
        }

    }

    fs.writeFile('src/constants/chords.ts', "export const CHORDS = " + JSON.stringify(chords),
        (err) => {
            if (err) {console.error("Failed to write File", err)};
        });

    return chords;
};

let data = fs.readFileSync('src/constants/base-chord-rules.json');
const BASE_CHORD_RULES = JSON.parse(data);
recalculateAllChords();