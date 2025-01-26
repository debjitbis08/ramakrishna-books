#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import Sanscript from '@indic-transliteration/sanscript'; // Import transliteration library

const options = {
    preferred_alternates: {
        itrans: {
            // Vowels
            "A": "a",
            "I": "i",
            "U": "u",
            "e": "e",
            "ai": "ai",
            "o": "o",
            "au": "au",

            // Consonants
            "k": "k",
            "kh": "kh",
            "g": "g",
            "gh": "gh",
            "ng": "ng",
            "ch": "ch",
            "chh": "ch",
            "j": "j",
            "jh": "jh",
            "ny": "ny",
            "t": "t",
            "th": "th",
            "d": "d",
            "dh": "dh",
            "n": "n",
            "p": "p",
            "ph": "ph",
            "b": "b",
            "bh": "bh",
            "m": "m",
            "r": "r",
            "RR": "r",
            "R": "r",
            "l": "l",
            "Sh": "sh",
            "sh": "sh",
            "N": "n",
            "s": "s",
            "h": "h",
            "Ch": "ch",
            "v": "b",
            "Y": "y",
            "Th": "th",
            ".D": "r",
            ".n": "",

            // Nasals and Yogavaahas
            "M": "n",   // Anusvara
            "~n": "n",  // Chandrabindu
            "H": "",    // Visarga (remove it)

            // Special Characters
            "j~n": "ny",
            "kSh": "ksh",
            "gY": "gy",

            "ৎ": "ts", // Transliterate 'ৎ' to 'ts'
            "ছ": "ch",

            // Numbers
            "0": "0", "1": "1", "2": "2", "3": "3",
            "4": "4", "5": "5", "6": "6", "7": "7",
            "8": "8", "9": "9",

            // Punctuation
            "|": ".",   // Single danda
            "||": ".",  // Double danda
        }
    },
    syncope: true,  // Drop schwa (e.g., ajaya → ajay)
};

// Function to read an .mdx file, process it, and add Transliteration below BengaliText
function processMdxFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    // Read the file content
    const content = fs.readFileSync(filePath, 'utf-8');

    // Regex to match <BengaliText> elements that do not already have a <Transliteration> below them
    const bengaliTextRegex = /(<BengaliText>([\s\S]*?)<\/BengaliText>)(?!\s*<Transliteration>)/g;

    // Regex to find standalone Bengali text not wrapped in <BengaliText>
    const standaloneBengaliRegex = /^\s*(?<!<BengaliText[^>]*?>)([\u0980-\u09FF][\u0980-\u09FF\s,।“”‘’()]*)(?!<\/BengaliText>)/gm;

    // Step 1: Wrap standalone Bengali text in <BengaliText>
    let wrappedContent = content.replace(standaloneBengaliRegex, (match) => {
        return `<BengaliText>${match.trim()}</BengaliText>`;
    });

    // Step 2: Add Transliteration below BengaliText if not already present
    const updatedContent = wrappedContent.replace(bengaliTextRegex, (match, _, innerText) => {
        // Generate corresponding Transliteration using the library
        const transliteration = `<Transliteration>${Sanscript.t(innerText.trim(), 'bengali', 'iso')}</Transliteration>`;

        // Return the updated content
        return `\n<p>\n${match}\n${transliteration}\n</p>\n`;
    });

    // Write the updated content back to the file
    const outputFilePath = path.join(
        path.dirname(filePath),
        `${path.basename(filePath)}`
    );
    fs.writeFileSync(outputFilePath, updatedContent, 'utf-8');

    console.log(`File processed and saved as: ${outputFilePath}`);
}

// Command-line interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error("Usage: node processMdxFile.js <path-to-mdx-file>");
        process.exit(1);
    }

    const filePath = path.resolve(args[0]);
    processMdxFile(filePath);
}
