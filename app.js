const express = require('express')
const bodyParser = require('body-parser')
const Feed = require('rss-to-json')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/rss', function(req, res, next) {
  console.log(`request url : ${req.body.rssUrl}`)
  const requestUrl = req.body.rssUrl
  const rssFilters = req.body.rssFilter || []

  Feed.load(requestUrl, function(err, jsonRss) {
    if (err) {
      res.status(503).send(err)
    } else {
      const filteredRss = jsonRss.items.filter(item =>
        item.title.match(rssFilters)
      )
      res.status(200).send(filteredRss)
    }
  })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, function() {
  console.log(`Web server listening on port ${PORT}`)
})
