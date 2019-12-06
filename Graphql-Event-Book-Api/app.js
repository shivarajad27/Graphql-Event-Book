const express = require('express');
const bodyparser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const port = process.env.PORT || 3000;
const app = express()

const events = [];

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
        return events;
    },
    createEvent: (args) =>{
        const event = {
            _id:Math.random().toString(),
            title:args.eventInput.title,
            description:args.eventInput.description,
            price:+args.eventInput.price,
            date:new Date().toString()
        }
        events.push(event);
        return event;
    }
}

app.use('/graphql',graphqlHttp({
    schema:schema,
    rootValue:rootValue,
    graphiql:true
}));

app.listen(port,()=>console.log('server started'));