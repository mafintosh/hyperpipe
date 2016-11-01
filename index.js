#!/usr/bin/env node

var hypercore = require('hypercore')
var swarm = require('hyperdrive-archive-swarm')
var level = require('level')
var minimist = require('minimist')

var argv = minimist(process.argv.slice(2), {
  alias: {help: 'h', tail: 't'},
  boolean: ['help', 'tail'],
  default: {live: true}
})

if (!argv._[0] || argv.h) {
  console.error('Usage: hyperpipe [dir] [key?]')
  process.exit(1)
}

var core = hypercore(level(argv._[0]))
var key = argv._[1]

if (key) {
  onkey(key)
} else {
  core.list(function (err, keys) {
    if (err) throw err
    onkey(keys[0])
  })
}

function onkey (key) {
  var feed = core.createFeed(key)

  feed.open(function (err) {
    if (err) throw err

    if (!feed.secretKey) {
      feed.createReadStream({live: argv.live, start: argv.tail ? feed.blocks : 0}).on('end', onend).pipe(process.stdout)
    } else {
      console.error(feed.key.toString('hex'))
      process.stdin.pipe(feed.createWriteStream())
    }
  })

  var sw = swarm(feed)

  function onend () {
    sw.close()
  }
}

