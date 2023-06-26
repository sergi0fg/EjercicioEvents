import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { getQuery } from 'https://deno.land/x/oak@v11.1.0/helpers.ts';
import { eventCollection } from "../mongoDB/db.ts";
import { ObjectId } from "https://deno.land/x/mongo/mod.ts";

/*
type GetAvailabeSlotsContext = RouterContext<
  "/availableSlots",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

*/

type GetEventsContext = RouterContext<
    "/events",
    Record<string | number, string | undefined>,
    Record<string, any>
    >;


type GetEventContext = RouterContext<
    "/event/:id",{
    id: string;
    }&
    Record<string | number, string | undefined>,
    Record<string, any>
    >;


export const events = async (ctx: GetEventsContext) => {
  const query = getQuery(ctx, { mergeParams: true });
  const events = await eventCollection.find({}).toArray();

  ctx.response.body = events.map((event: any) => {
    const { _id, ...rest } = event;
    return rest;
  });
};

export const event = async (ctx: GetEventContext) => {
    const query = getQuery(ctx, { mergeParams: true });
      const { id } = ctx.params;
  
      const event = await eventCollection.findOne({ _id: new ObjectId(id) });
      ctx.response.body = event;
  
  }


    

/*

import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { eventosCollection } from "../db/mongo.ts";


type GetEventContext = RouterContext<
  "/event/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetEventosContext = RouterContext<
  "/events",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getEvent = async (context: GetEventContext) => {
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

       context.response.status = 200;
         context.response.body = evento;
    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}

export const getEvents = async (context: GetEventosContext) => {
    try {
        const eventos = await eventosCollection.find({}).toArray();
        if(eventos.length === 0){
            context.response.status = 404;
            context.response.body = "No hay eventos";
            return;
        }

        context.response.status = 200;
        context.response.body = eventos;
        
    } catch (error) {
        console.log(error)
        context.response.status = 500
    }
}

*/