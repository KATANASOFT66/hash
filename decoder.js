// ==========================================
// Universal Decoder v1.0
// Supports: Base64, Base32, Hex, Binary,
// URL Encoding, ROT13, Caesar Cipher,
// Morse Code, ASCII, Octal, HTML Entities,
// Reverse, Atbash, and more
// ==========================================

class UniversalDecoder {
    constructor() {
        this.results = [];
    }

    // ==================
    // BASE64
    // ==================
    decodeBase64(input) {
        try {
            const decoded = atob(input.trim());
            return { method: "Base64", result: decoded };
        } catch {
            return null;
        }
    }

    encodeBase64(input) {
        return { method: "Base64 Encode", result: btoa(input) };
    }

    // ==================
    // BASE32
    // ==================
    decodeBase32(input) {
        try {
            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
            let bits = "";
            let result = "";

            const cleaned = input.toUpperCase().replace(/=+$/, "").trim();

            for (const char of cleaned) {
                const val = alphabet.indexOf(char);
                if (val === -1) return null;
                bits += val.toString(2).padStart(5, "0");
            }

            for (let i = 0; i + 8 <= bits.length; i += 8) {
                result += String.fromCharCode(parseInt(bits.substr(i, 8), 2));
            }

            return { method: "Base32", result };
        } catch {
            return null;
        }
    }

    // ==================
    // HEX
    // ==================
    decodeHex(input) {
        try {
            const cleaned = input.replace(/\s+/g, "").replace(/0x/gi, "");
            if (!/^[0-9a-fA-F]+$/.test(cleaned)) return null;
            if (cleaned.length % 2 !== 0) return null;

            let result = "";
            for (let i = 0; i < cleaned.length; i += 2) {
                result += String.fromCharCode(parseInt(cleaned.substr(i, 2), 16));
            }

            return { method: "Hexadecimal", result };
        } catch {
            return null;
        }
    }

    // ==================
    // BINARY
    // ==================
    decodeBinary(input) {
        try {
            const cleaned = input.replace(/\s+/g, "");
            if (!/^[01]+$/.test(cleaned)) return null;
            if (cleaned.length % 8 !== 0) return null;

            let result = "";
            for (let i = 0; i < cleaned.length; i += 8) {
                result += String.fromCharCode(parseInt(cleaned.substr(i, 8), 2));
            }

            return { method: "Binary", result };
        } catch {
            return null;
        }
    }

    // ==================
    // OCTAL
    // ==================
    decodeOctal(input) {
        try {
            const parts = input.trim().split(/\s+/);
            if (parts.length < 2) return null;

            let result = "";
            for (const part of parts) {
                if (!/^[0-7]+$/.test(part)) return null;
                const code = parseInt(part, 8);
                if (code > 127) return null;
                result += String.fromCharCode(code);
            }

            return { method: "Octal", result };
        } catch {
            return null;
        }
    }

    // ==================
    // DECIMAL ASCII
    // ==================
    decodeDecimalASCII(input) {
        try {
            const parts = input.trim().split(/[\s,]+/);
            if (parts.length < 2) return null;

            let result = "";
            for (const part of parts) {
                const num = parseInt(part, 10);
                if (isNaN(num) || num < 0 || num > 127) return null;
                result += String.fromCharCode(num);
            }

            return { method: "Decimal ASCII", result };
        } catch {
            return null;
        }
    }

    // ==================
    // URL ENCODING
    // ==================
    decodeURL(input) {
        try {
            if (!input.includes("%")) return null;
            const decoded = decodeURIComponent(input);
            if (decoded === input) return null;
            return { method: "URL Encoding", result: decoded };
        } catch {
            return null;
        }
    }

    // ==================
    // HTML ENTITIES
    // ==================
    decodeHTMLEntities(input) {
        try {
            if (!input.includes("&") || !input.includes(";")) return null;

            const entityMap = {
                "&amp;": "&", "&lt;": "<", "&gt;": ">",
                "&quot;": '"', "&apos;": "'", "&nbsp;": " ",
                "&copy;": "©", "&reg;": "®", "&trade;": "™",
                "&euro;": "€", "&pound;": "£", "&yen;": "¥",
                "&cent;": "¢", "&sect;": "§", "&deg;": "°",
                "&plusmn;": "±", "&times;": "×", "&divide;": "÷",
                "&micro;": "µ", "&para;": "¶", "&middot;": "·",
                "&bull;": "•", "&hellip;": "…", "&prime;": "′",
                "&laquo;": "«", "&raquo;": "»", "&larr;": "←",
                "&rarr;": "→", "&uarr;": "↑", "&darr;": "↓",
                "&hearts;": "♥", "&diams;": "♦", "&clubs;": "♣",
                "&spades;": "♠"
            };

            let result = input;

            // Named entities
            for (const [entity, char] of Object.entries(entityMap)) {
                result = result.split(entity).join(char);
            }

            // Numeric entities &#123;
            result = result.replace(/&#(\d+);/g, (_, num) =>
                String.fromCharCode(parseInt(num, 10))
            );

            // Hex entities &#x1F;
            result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
                String.fromCharCode(parseInt(hex, 16))
            );

            if (result === input) return null;
            return { method: "HTML Entities", result };
        } catch {
            return null;
        }
    }

    // ==================
    // ROT13
    // ==================
    decodeROT13(input) {
        try {
            const result = input.replace(/[a-zA-Z]/g, (c) => {
                const base = c <= "Z" ? 65 : 97;
                return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
            });

            if (result === input) return null;
            return { method: "ROT13", result };
        } catch {
            return null;
        }
    }

    // ==================
    // ALL ROT (Caesar Cipher Brute Force)
    // ==================
    decodeAllROT(input) {
        const results = [];
        for (let shift = 1; shift <= 25; shift++) {
            const result = input.replace(/[a-zA-Z]/g, (c) => {
                const base = c <= "Z" ? 65 : 97;
                return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
            });

            if (result !== input) {
                results.push({
                    method: `ROT${shift} (Caesar Shift ${shift})`,
                    result
                });
            }
        }
        return results;
    }

    // ==================
    // ATBASH CIPHER
    // ==================
    decodeAtbash(input) {
        try {
            const result = input.replace(/[a-zA-Z]/g, (c) => {
                if (c >= "a" && c <= "z") {
                    return String.fromCharCode(219 - c.charCodeAt(0));
                }
                if (c >= "A" && c <= "Z") {
                    return String.fromCharCode(155 - c.charCodeAt(0));
                }
                return c;
            });

            if (result === input) return null;
            return { method: "Atbash Cipher", result };
        } catch {
            return null;
        }
    }

    // ==================
    // REVERSE STRING
    // ==================
    decodeReverse(input) {
        const result = input.split("").reverse().join("");
        if (result === input) return null;
        return { method: "Reversed String", result };
    }

    // ==================
    // MORSE CODE
    // ==================
    decodeMorse(input) {
        try {
            const morseMap = {
                ".-": "A", "-...": "B", "-.-.": "C", "-..": "D",
                ".": "E", "..-.": "F", "--.": "G", "....": "H",
                "..": "I", ".---": "J", "-.-": "K", ".-..": "L",
                "--": "M", "-.": "N", "---": "O", ".--.": "P",
                "--.-": "Q", ".-.": "R", "...": "S", "-": "T",
                "..-": "U", "...-": "V", ".--": "W", "-..-": "X",
                "-.--": "Y", "--..": "Z", ".----": "1", "..---": "2",
                "...--": "3", "....-": "4", ".....": "5", "-....": "6",
                "--...": "7", "---..": "8", "----.": "9", "-----": "0",
                ".-.-.-": ".", "--..--": ",", "..--..": "?",
                ".----.": "'", "-.-.--": "!", "-..-.": "/",
                "-.--.": "(", "-.--.-": ")", ".-...": "&",
                "---...": ":", "-.-.-.": ";", "-...-": "=",
                ".-.-.": "+", "-....-": "-", "..--.-": "_",
                ".-..-.": '"', "...-..-": "$", ".--.-.": "@"
            };

            if (!/^[\.\-\s\/]+$/.test(input.trim())) return null;

            const words = input.trim().split(/\s{2,}|\//);
            let result = "";

            for (const word of words) {
                const letters = word.trim().split(/\s+/);
                for (const letter of letters) {
                    if (morseMap[letter]) {
                        result += morseMap[letter];
                    } else if (letter === "") {
                        continue;
                    } else {
                        return null;
                    }
                }
                result += " ";
            }

            return { method: "Morse Code", result: result.trim() };
        } catch {
            return null;
        }
    }

    // ==================
    // UNICODE ESCAPE
    // ==================
    decodeUnicodeEscape(input) {
        try {
            if (!input.includes("\\u")) return null;

            const result = input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
                String.fromCharCode(parseInt(hex, 16))
            );

            if (result === input) return null;
            return { method: "Unicode Escape", result };
        } catch {
            return null;
        }
    }

    // ==================
    // JWT DECODE
    // ==================
    decodeJWT(input) {
        try {
            const parts = input.trim().split(".");
            if (parts.length !== 3) return null;

            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));

            return {
                method: "JWT Token",
                result: JSON.stringify({ header, payload }, null, 2)
            };
        } catch {
            return null;
        }
    }

    // ==================
    // XOR BRUTE FORCE (Single byte key)
    // ==================
    decodeXORBruteForce(input) {
        const results = [];
        try {
            // Assume hex input
            const cleaned = input.replace(/\s+/g, "").replace(/0x/gi, "");
            if (!/^[0-9a-fA-F]+$/.test(cleaned)) return results;
            if (cleaned.length % 2 !== 0) return results;

            const bytes = [];
            for (let i = 0; i < cleaned.length; i += 2) {
                bytes.push(parseInt(cleaned.substr(i, 2), 16));
            }

            for (let key = 1; key <= 255; key++) {
                const decoded = bytes.map(b => String.fromCharCode(b ^ key)).join("");
                const printable = decoded.split("").every(c =>
                    c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126
                );

                if (printable) {
                    results.push({
                        method: `XOR (Key: 0x${key.toString(16).padStart(2, "0")} / ${key})`,
                        result: decoded
                    });
                }
            }
        } catch { }
        return results;
    }

    // ==================
    // VIGENERE BRUTE FORCE (common keys)
    // ==================
    decodeVigenere(input, key) {
        try {
            if (!/^[a-zA-Z\s]+$/.test(input)) return null;

            let result = "";
            let keyIndex = 0;

            for (const char of input) {
                if (/[a-zA-Z]/.test(char)) {
                    const base = char <= "Z" ? 65 : 97;
                    const keyBase = key[keyIndex % key.length].toUpperCase().charCodeAt(0) - 65;
                    const decoded = ((char.charCodeAt(0) - base - keyBase + 26) % 26) + base;
                    result += String.fromCharCode(decoded);
                    keyIndex++;
                } else {
                    result += char;
                }
            }

            return { method: `Vigenère (Key: "${key}")`, result };
        } catch {
            return null;
        }
    }

    // ==================
    // BACON CIPHER
    // ==================
    decodeBacon(input) {
        try {
            const cleaned = input.toUpperCase().replace(/\s+/g, "");
            if (!/^[AB]+$/.test(cleaned)) return null;
            if (cleaned.length % 5 !== 0) return null;

            const baconMap = {
                "AAAAA": "A", "AAAAB": "B", "AAABA": "C", "AAABB": "D",
                "AABAA": "E", "AABAB": "F", "AABBA": "G", "AABBB": "H",
                "ABAAA": "I", "ABAAB": "J", "ABABA": "K", "ABABB": "L",
                "ABBAA": "M", "ABBAB": "N", "ABBBA": "O", "ABBBB": "P",
                "BAAAA": "Q", "BAAAB": "R", "BAABA": "S", "BAABB": "T",
                "BABAA": "U", "BABAB": "V", "BABBA": "W", "BABBB": "X",
                "BAAAA": "Y", "BAAAB": "Z"
            };

            let result = "";
            for (let i = 0; i < cleaned.length; i += 5) {
                const chunk = cleaned.substr(i, 5);
                if (baconMap[chunk]) {
                    result += baconMap[chunk];
                } else {
                    return null;
                }
            }

            return { method: "Bacon Cipher", result };
        } catch {
            return null;
        }
    }

    // ==================
    // RAIL FENCE CIPHER
    // ==================
    decodeRailFence(input, rails) {
        try {
            const len = input.length;
            const fence = Array.from({ length: rails }, () => Array(len).fill(""));

            let rail = 0;
            let direction = 1;

            // Mark positions
            for (let i = 0; i < len; i++) {
                fence[rail][i] = "*";
                if (rail === 0) direction = 1;
                if (rail === rails - 1) direction = -1;
                rail += direction;
            }

            // Fill characters
            let index = 0;
            for (let r = 0; r < rails; r++) {
                for (let c = 0; c < len; c++) {
                    if (fence[r][c] === "*") {
                        fence[r][c] = input[index++];
                    }
                }
            }

            // Read off
            let result = "";
            rail = 0;
            direction = 1;
            for (let i = 0; i < len; i++) {
                result += fence[rail][i];
                if (rail === 0) direction = 1;
                if (rail === rails - 1) direction = -1;
                rail += direction;
            }

            return { method: `Rail Fence (${rails} rails)`, result };
        } catch {
            return null;
        }
    }

    // ==================
    // HASH IDENTIFICATION
    // ==================
    identifyHash(input) {
        const cleaned = input.trim();
        const identifications = [];

        const patterns = [
            { regex: /^[a-f0-9]{32}$/i, name: "MD5" },
            { regex: /^[a-f0-9]{40}$/i, name: "SHA-1" },
            { regex: /^[a-f0-9]{56}$/i, name: "SHA-224" },
            { regex: /^[a-f0-9]{64}$/i, name: "SHA-256" },
            { regex: /^[a-f0-9]{96}$/i, name: "SHA-384" },
            { regex: /^[a-f0-9]{128}$/i, name: "SHA-512" },
            { regex: /^\$2[aby]\$\d{2}\$.{53}$/, name: "Bcrypt" },
            { regex: /^\$1\$.{8}\$.{22}$/, name: "MD5 Crypt" },
            { regex: /^\$5\$/, name: "SHA-256 Crypt" },
            { regex: /^\$6\$/, name: "SHA-512 Crypt" },
            { regex: /^\$argon2(i|d|id)\$/, name: "Argon2" },
            { regex: /^[a-f0-9]{8}$/i, name: "CRC32 / Adler32" },
            { regex: /^[a-f0-9]{16}$/i, name: "MySQL / Half MD5" },
            { regex: /^[a-f0-9]{48}$/i, name: "Tiger-192 / Haval-192" },
            { regex: /^[A-Za-z0-9+/]{43}=$/i, name: "SHA-256 (Base64)" },
            { regex: /^[A-Za-z0-9+/]{27}=$/i, name: "MD5 (Base64)" },
            { regex: /^pbkdf2[:_]sha256\$/, name: "PBKDF2-SHA256" },
            { regex: /^scrypt\$/, name: "Scrypt" }
        ];

        for (const pattern of patterns) {
            if (pattern.regex.test(cleaned)) {
                identifications.push(pattern.name);
            }
        }

        return identifications;
    }

    // ==================
    // AUTO DETECT & DECODE ALL
    // ==================
    decodeAll(input) {
        const results = [];
        const addResult = (r) => {
            if (r && r.result && r.result !== input && r.result.trim() !== "") {
                results.push(r);
            }
        };

        const addResults = (arr) => {
            if (Array.isArray(arr)) {
                arr.forEach(r => addResult(r));
            }
        };

        console.log("═".repeat(60));
        console.log("  UNIVERSAL DECODER v1.0");
        console.log("═".repeat(60));
        console.log(`\n📥 Input: "${input.substring(0, 100)}${input.length > 100 ? "..." : ""}"\n`);

        // Hash Identification
        const hashes = this.identifyHash(input);
        if (hashes.length > 0) {
            console.log("🔐 Hash Identification:");
            hashes.forEach(h => console.log(`   ➤ Possibly: ${h}`));
            console.log("   ⚠ Note: Hashes are ONE-WAY and cannot be decoded\n");
        }

        // Try all decoders
        addResult(this.decodeBase64(input));
        addResult(this.decodeBase32(input));
        addResult(this.decodeHex(input));
        addResult(this.decodeBinary(input));
        addResult(this.decodeOctal(input));
        addResult(this.decodeDecimalASCII(input));
        addResult(this.decodeURL(input));
        addResult(this.decodeHTMLEntities(input));
        addResult(this.decodeROT13(input));
        addResult(this.decodeAtbash(input));
        addResult(this.decodeReverse(input));
        addResult(this.decodeMorse(input));
        addResult(this.decodeUnicodeEscape(input));
        addResult(this.decodeJWT(input));
        addResult(this.decodeBacon(input));

        // Rail Fence (try 2-5 rails)
        for (let rails = 2; rails <= 5; rails++) {
            addResult(this.decodeRailFence(input, rails));
        }

        // Caesar / ROT brute force
        addResults(this.decodeAllROT(input));

        // XOR brute force (if hex input)
        addResults(this.decodeXORBruteForce(input));

        // Vigenere with common keys
        const commonKeys = ["KEY", "SECRET", "PASSWORD", "CIPHER", "CODE", "ABC", "HACK"];
        for (const key of commonKeys) {
            addResult(this.decodeVigenere(input, key));
        }

        // Print results
        if (results.length > 0) {
            console.log(`✅ Found ${results.length} possible decodings:\n`);
            console.log("─".repeat(60));

            results.forEach((r, i) => {
                console.log(`\n  [${i + 1}] ${r.method}`);
                console.log(`  ${"─".repeat(40)}`);
                console.log(`  ${r.result}`);
            });

            console.log("\n" + "─".repeat(60));
        } else {
            console.log("❌ No decodings found for this input.");
        }

        console.log("\n" + "═".repeat(60));

        return results;
    }
}

// ==========================================
// INTERACTIVE CLI USAGE (Node.js)
// ==========================================
function main() {
    const decoder = new UniversalDecoder();

    // ===== TEST EXAMPLES =====
    const testCases = [
        "SGVsbG8gV29ybGQh",                                         // Base64
        "48656c6c6f20576f726c6421",                                  // Hex
        "01001000 01100101 01101100 01101100 01101111",               // Binary
        "Uryyb Jbeyq!",                                              // ROT13
        ".... . .-.. .-.. --- / .-- --- .-. .-.. -..",               // Morse
        "Hello%20World%21",                                          // URL
        "JBSWY3DPEBLW64TMMQ======",                                 // Base32
        "5d41402abc4b2a76b9719d911017c592",                          // MD5 hash
        "\\u0048\\u0065\\u006C\\u006C\\u006F",                       // Unicode
        "&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;",        // HTML
    ];

    console.log("\n🔬 RUNNING TEST CASES\n");

    for (const test of testCases) {
        decoder.decodeAll(test);
        console.log("\n");
    }
}

// ==========================================
// BROWSER USAGE (HTML Interface)
// ==========================================
function createWebInterface() {
    if (typeof document === "undefined") return;

    document.body.innerHTML = `
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, sans-serif;
            background: #0a0a0a;
            color: #e0e0e0;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            color: #00ff88;
            margin-bottom: 30px;
            font-size: 2em;
            text-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }
        .input-section {
            background: #1a1a2e;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            border: 1px solid #333;
        }
        textarea {
            width: 100%;
            height: 120px;
            background: #0d0d1a;
            border: 2px solid #444;
            border-radius: 8px;
            color: #fff;
            padding: 15px;
            font-size: 14px;
            font-family: 'Courier New', monospace;
            resize: vertical;
            outline: none;
            transition: border-color 0.3s;
        }
        textarea:focus { border-color: #00ff88; }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #00ff88, #00cc6a);
            color: #000;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 15px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(0, 255, 136, 0.4);
        }
        .btn-clear {
            background: linear-gradient(135deg, #ff4444, #cc0000);
            color: #fff;
            margin-left: 10px;
        }
        .results {
            background: #1a1a2e;
            border-radius: 12px;
            padding: 25px;
            border: 1px solid #333;
        }
        .result-item {
            background: #0d0d1a;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 12px;
            border-left: 4px solid #00ff88;
            transition: transform 0.2s;
        }
        .result-item:hover { transform: translateX(5px); }
        .result-method {
            color: #00ff88;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .result-text {
            color: #fff;
            font-family: 'Courier New', monospace;
            word-break: break-all;
            font-size: 13px;
            background: #111;
            padding: 10px;
            border-radius: 5px;
        }
        .hash-warning {
            background: #2a1a00;
            border-left: 4px solid #ffaa00;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 12px;
            color: #ffcc66;
        }
        .no-results {
            text-align: center;
            color: #666;
            padding: 40px;
            font-size: 18px;
        }
        .copy-btn {
            float: right;
            padding: 4px 12px;
            background: #333;
            color: #aaa;
            border: 1px solid #555;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
        }
        .copy-btn:hover { background: #444; color: #fff; }
        .stats {
            text-align: center;
            color: #666;
            margin-top: 15px;
            font-size: 13px;
        }
    </style>

    <div class="container">
        <h1>🔓 Universal Decoder</h1>
        <div class="input-section">
            <textarea id="input"
                placeholder="Paste encoded text, hash, or cipher here..."></textarea>
            <br>
            <button class="btn" onclick="runDecode()">⚡ Decode All</button>
            <button class="btn btn-clear" onclick="clearAll()">🗑 Clear</button>
        </div>
        <div class="results" id="results">
            <div class="no-results">
                Enter encoded text above and click Decode
            </div>
        </div>
    </div>
    `;

    window.runDecode = function () {
        const input = document.getElementById("input").value.trim();
        if (!input) return;

        const decoder = new UniversalDecoder();
        const resultsDiv = document.getElementById("results");
        let html = "";

        // Hash identification
        const hashes = decoder.identifyHash(input);
        if (hashes.length > 0) {
            html += `<div class="hash-warning">
                <strong>🔐 Hash Identified:</strong> ${hashes.join(", ")}<br>
                <small>⚠ Hashes are one-way functions and cannot be reversed/decoded</small>
            </div>`;
        }

        const results = decoder.decodeAll(input);

        if (results.length > 0) {
            results.forEach((r, i) => {
                html += `<div class="result-item">
                    <button class="copy-btn"
                        onclick="navigator.clipboard.writeText(this.parentElement
                        .querySelector('.result-text').innerText)">
                        📋 Copy
                    </button>
                    <div class="result-method">[${i + 1}] ${r.method}</div>
                    <div class="result-text">${escapeHTML(r.result)}</div>
                </div>`;
            });
            html += `<div class="stats">Found ${results.length} possible decodings</div>`;
        } else if (hashes.length === 0) {
            html = `<div class="no-results">❌ No decodings found</div>`;
        }

        resultsDiv.innerHTML = html;
    };

    window.clearAll = function () {
        document.getElementById("input").value = "";
        document.getElementById("results").innerHTML =
            '<div class="no-results">Enter encoded text above and click Decode</div>';
    };

    window.escapeHTML = function (str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };
}

// ==========================================
// AUTO-RUN
// ==========================================
if (typeof window !== "undefined") {
    createWebInterface();
} else {
    main();
}
