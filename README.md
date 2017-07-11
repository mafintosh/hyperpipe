# hyperpipe

Distributed input/output pipe.

``` sh
npm install -g hyperpipe
hyperpipe --help
```

## Usage

On one computer

``` sh
./program | hyperpipe /tmp/some-folder
<prints-key>
```

On another

``` sh
hyperpipe /tmp/some-other-folder <key-from-above>
```

## API
```sh
  Usage:
    $ hyperpipe <database> <key?> [options]

  Commands:
    <default>    Pipe a file into the swarm or read from the swarm at a key

    Options:
      -h, --help      Print usage
      -t, --tail      Only print get updates
      -e, --encoding  Set encoding for hypercore (parse ndjson by setting to 'json')
          --no-live   Exit after hyperpipe is done syncing

  Examples:
    $ hyperpipe ./pipe.db < README.md         # cat a file & print key
    $ hyperpipe ./pipe.db <key> > README.md   # write a file from a key
    $ tail -F foo.log | hyperpipe ./pipe.db   # tail a live log file
    $ hyperpipe ./pipe.db --encoding='json' < my-data.json   # put ndjson into hypercore
```

## License

MIT
