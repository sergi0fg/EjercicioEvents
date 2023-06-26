import { ObjectId } from "mongo";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { getQuery } from 'https://deno.land/x/oak@v11.1.0/helpers.ts';
import { eventCollection } from "../mongoDB/db.ts"


type DeleteEventContext = RouterContext<"/event/:id",
{ id: string; } & Record<string | number, string | undefined>,
Record<string, any>>;


export const deleteEvent = async(context:DeleteEventContext) => {
    const id = context.params.id;
    const result = await eventCollection.deleteOne({_id:new ObjectId(id)});
    context.response.body = result;
    context.response.status = 200;
    console.log(result);
}


/*

import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { eventosCollection } from "../db/mongo.ts";


type RemoveEventContext = RouterContext<
  "/deleteEvent/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const removeEvent = async (context: RemoveEventContext) => {
    try{
        const id = context.params.id;
        if(!id){
            context.response.status = 400;
            context.response.body = "Falta el id";
            return;
        }

        const evento = await eventosCollection.findOne({_id: new ObjectId(id)});
        if(!evento){
            context.response.status = 404;
            context.response.body = "No existe el evento";
            return;
        }

        await eventosCollection.deleteOne({_id: new ObjectId(id)});
        context.response.status = 200;
        context.response.body = "Evento eliminado";
    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}


*/