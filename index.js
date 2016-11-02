#!/usr/bin/env node

var hypercore = require('hypercore')
var swarm = require('hyperdrive-archive-swarm')
var level = require('level')
var minimist = require('minimist')
var mkdirp = require('mkdirp')
var path = require('path')
var fs = require('fs')

var usage = fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf8')
var argv = minimist(process.argv.slice(2), {
  alias: {help: 'h', tail: 't'},
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
      const opts = {
        live: !argv['no-live'],
        start: argv.tail ? feed.blocks : 0
      }
      feed.createReadStream(opts).on('end', onend).pipe(process.stdout)
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

