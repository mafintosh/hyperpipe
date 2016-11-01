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

## License

MIT
