const express = require('express')
const mocha = require('mocha')
const MOVIELIST= require('movies-data.json')

const app = express()
app.use(mocha('dev'))

require('dotenv').config() 


module.exports= app