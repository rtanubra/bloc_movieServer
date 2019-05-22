const express = require('express') //forgot to download express
const morgan = require('morgan')
const MOVIELIST= require('./movies-data.json')

const app = express()
app.use(morgan('dev'))
app.use(AuthorizeToken)

require('dotenv').config() //need to install dotenv
const API_TOKEN = process.env.API_TOKEN

function AuthorizeToken(req,res,next){
    const authorization = req.get('Authorization')
    
    console.log(authorization)
    if (!authorization){
        return res.status(401).json({error:"Unauthorized, please provide an api token"})
    }
    if (authorization.split(" ")[1] !== API_TOKEN){
        return res.status(401).json({error:"Unauthorized, please provide a VALID api token"})
    }
    next()
}

function capitalizeCorrectly(str){
    const myArr = str.split(" ")//split by space
    const capitalizedArr = myArr.map((wrd)=>{
        return wrd.charAt(0).toUpperCase() + wrd.slice(1)
    })
    return capitalizedArr.join(" ")
}

function getMovies(req,res){
    const { genre= "" } = req.query
    const { country = "" } = req.query
    const { avg_vote = "" } = req.query 
    if (!genre && !country && !avg_vote ){
        return res.status(400).json({error:"Required Params: at least one of three [genre,country,avg_vote]"})
    }

    const genreCorrected = genre? capitalizeCorrectly(genre) : ""
    //filter by genre
    const moviesByGenre = genreCorrected? MOVIELIST.filter((movie)=>{
        return movie.genre.includes(genreCorrected)
    }) : [...MOVIELIST]

    //filter by country 
    const countryCorrected = country? capitalizeCorrectly(country) : ""
    const moviesByCountry = countryCorrected? moviesByGenre.filter((movie)=>{
        return movie.country.includes(countryCorrected)
    }) : [...moviesByGenre]

    //filter by avg_vote
    if (avg_vote){
        if (isNaN(avg_vote)){
            return res.status(400).json({error:"avg_vote should be a number between 0.1 to 9.9"})
        }
        if (Number(avg_vote) <0 || Number(avg_vote) > 9.9 ){
            return res.status(400).json({error:"avg_vote should be a number between 0.1 to 9.9"})
        }
        const moviesByRating = moviesByCountry.filter((movie)=>{
            return Number(movie.avg_vote) >= Number(avg_vote)
        })
        return res.json(moviesByRating)
    }
    

    res.json(moviesByCountry)
}

app.get('/Movie/',getMovies)

module.exports= app