const path = require('path')
const express = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const hbs = require('hbs')

const app = express()

//define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials' )

//setup handlebars engine and views
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res)=>{
    res.render('index',{
        title:'Weather App', 
        name:'Darren Ramirez'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About',
        name:'Darren Ramirez'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        helptext:'This is the help page! At least i think.',
        title:"Help",
        name:'Darren Ramirez'
    })
})


app.get('/weather',(req, res)=>{
    
    if(!req.query.address){
        return res.send({
            error:"You have to an address provide a search term"
        })
    }
    geocode(req.query.address,(error,{latitude, longitude, location}={}) =>{
        if(error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({error})
            }

            res.send({
                forecast:forecastData,
                location,
                address:req.query.address
            })

        })
    })

    // res.send([{
    //     location: 'Boston',
    //     forecast:'90 degrees and cloudly',
    //     address: req.query.address
    // }])
})

app.get('/products',(req, res)=>{
    if(!req.query.search){
        return res.send({
            error:"You have to provide a search term"
        })
    }

    console.log(req.query.search)
    res.send({
        products:[]
    })
})

app.get('/help/*',(req,res)=>
    res.render('404',{
        title:'404',
        name: 'Darren Ramirez',
        errorMessage:'Help article not found'
    })
)


app.get('*',(req, res) => {
    res.render('404',{
        title:'404',
        name: 'Darren Ramirez',
        errorMessage:'Page not found'
    })
})

app.listen(3000, () =>{
    console.log('Server up and running!')
})
