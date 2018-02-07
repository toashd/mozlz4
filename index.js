#!/usr/bin/env node

'use strict';

const fs = require('fs');
const lz4 = require('lz4');
const path = require('path');
const program = require('commander');

const packageJson = require('./package.json');

// Custom Mozilla LZ4 file header / magic number
const magicNumber = "mozLz40\0";

/**
 * Decompress jsonlz4 file buffer
 *
 * @param {buffer} inputBuffer File buffer
 *
 * @returns {JSON}
 */
let decompress = (inputBuffer) => {
    // Verify inputBuffer
    if (!Buffer.isBuffer(inputBuffer)) {
        throw new Error('input is not of type Buffer');
        return false;
    }

    // Verifiy custom Mozilla LZ4 header
    if (inputBuffer.slice(0, 8).toString() !== magicNumber) {
        throw new Error('input does not seem to be a valid jsonlz4 format');
        return false;
    }

    let outputBuffer = new Buffer(inputBuffer.readUInt32LE(8));
    lz4.decodeBlock(inputBuffer, outputBuffer, 12);

    return JSON.parse(outputBuffer.toString());
};

// Export node module
module.exports = decompress;

if (require.main === module) {
    // Set up commandline parameters
    program.usage('[options] <file>')
        .version(packageJson.version)
        .arguments('<file>')
        .description('Decompress a Firefox bookmark backup jsonlz4 file to JSON')
        .option('-p, --pretty', 'Pretty print JSON')
        .action(function(file) {
            if (program.pretty) {
                console.log(JSON.stringify(decompress(fs.readFileSync(file)), null, 2));
            } else {
                console.log(JSON.stringify(decompress(fs.readFileSync(file))));
            }
        })
        .parse(process.argv);

    // If file argument is missing, print help menu
    if (!program.args.length) {
        program.outputHelp();
    }
}
