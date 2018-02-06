# mozlz4

Decompress Mozilla Firefox bookmarks backup file.

## Node module

#### Installation
To install as a local module and include as a dependency:
```bash
npm install --save mozlz4
```

#### Usage
```javascript
const fs = require('fs');
const jsonlz4 = require('mozlz4');

// Read file into buffer
fs.readFile('/path/to/bookmarkbackups/recovery.jsonlz4', function(err, fileBuffer) {
  // decompress file buffer to JSON
  decompressedJson = jsonlz4.decompress(fileBuffer);

  // do something with the JSON
  console.log(decompressedJson);
});
```

## Commandline

#### Installation
To install as a command line application:
```bash
npm install mozlz4
```
You may need to prefix the command with sudo.

#### Usage
```none
  Usage: mozlz4 [options] <file>

  Decompress a Firefox bookmark backup jsonlz4 file to JSON.

  Options:

    -h, --help    output usage information
    -p, --pretty  Pretty print JSON

```

Output is sent to `stdout`

## Notes

`bytes 0-7`: Magic number when converted to a string `mozLz40` followed by a null character.
`bytes 8-11`: Uncompressed file size.  Little endian unsigned 32bit integer.
`bytes 12-EOL`: LZ4 compressed blocked.

