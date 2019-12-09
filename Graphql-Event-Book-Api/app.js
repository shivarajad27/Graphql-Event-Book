const express = require('express');
const bodyparser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');

const port = process.env.PORT || 3000;
const app = express()

app.use(bodyparser.json());

const schema = buildSchema(`
    type Event{
        _id:ID!
        title:String!
        description:String!
        price:Float!
        date:String!
    }

    input EventInput{
        title:String!
        description:String!
        price:Float!
        date:String!
    }

    type RootQuery{
        events:[Event!]!
    }

    type RootMutation{
        createEvent(eventInput: EventInput):Event
    }

    schema {
        query:RootQuery,
        mutation:RootMutation
    }
`);

const rootValue = {
    events: ()=>{
        return Event.find()
        .then(events=>{
            return events.map(event =>{
               return {...event._doc,_id:event._doc._id.toString()}
            })
        })
        .catch(err=>{
            throw err;
        })
    },
    createEvent: (args) =>{
        const event = new Event({
            title:args.eventInput.title,
            description:args.eventInput.description,
            price:+args.eventInput.price,
            date:new Date().toString()
        })
        
        return event.save()
        .then(result=>{
            return {...result._doc,_id:result._doc._id.toString()};
        })
        .catch(err=>{
            console.log(err);
            throw err;
        })
    }
}

app.use('/graphql',graphqlHttp({
    schema:schema,
    rootValue:rootValue,
    graphiql:true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@devmeetups-uqzdb.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,{ useNewUrlParser: true })
.then(()=>{
    console.log("DB connected");
    app.listen(port,()=>console.log('server started'));
})
.catch(err=>{
    console.log(err);
})
