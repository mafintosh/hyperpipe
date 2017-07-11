#!/usr/bin/env node

var hypercore = require('hypercore')
var swarm = require('hyperdiscovery')
var minimist = require('minimist')
var mkdirp = require('mkdirp')
var path = require('path')
var ndjson = require('ndjson')
var fs = require('fs')

var usage = fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf8')
var argv = minimist(process.argv.slice(2), {
  alias: {help: 'h', tail: 't', encoding: 'e'},
  boolean: ['help', 'tail', 'no-live'],
  default: {'no-live': false}
})

if (argv.help) {
  console.log(usage)
  process.exit()
}

if (!argv._[0]) {
  console.error(usage)
  process.exit(1)
}

mkdirp.sync(argv._[0])

var key = argv._[1]
var feed = hypercore(argv._[0], key, {valueEncoding: argv.encoding})

feed.on('ready', function () {
  if (!feed.writable) {
    const opts = {
      live: !argv['no-live'],
      start: argv.tail ? feed.blocks : 0
    }
    feed.createReadStream(opts).on('end', onend).pipe(process.stdout)
  } else {
    console.error(feed.key.toString('hex'))
    if (argv.encoding === 'json') {
      process.stdin.pipe(ndjson.parse()).pipe(feed.createWriteStream())
    } else {
      process.stdin.pipe(feed.createWriteStream())
    }
  }

  var sw = swarm(feed)

  function onend () {
    sw.close()
  }
})
