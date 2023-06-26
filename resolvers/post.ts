import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from  "https://deno.land/x/mongo/mod.ts";
import { Context } from 'https://deno.land/x/oak/mod.ts';
import { eventCollection } from '../mongoDB/db.ts';
import { Event } from "../types.ts";
/*
type PostAddSlotContext = RouterContext<
  "/addSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;
*/

type PostAddEventContext = RouterContext<
  "/addEvent",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

/*
const isValidDate = (
  year: number,
  month: number,
  day: number,
  hour: number
): boolean => {
  const date = new Date(year, month, day, hour);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDay() === day &&
    date.getHours() === hour
  );
};
*/


function eventsOverlap(event1: Event, event2: Event): boolean {
  const sameDay = event1.fecha.toDateString() === event2.fecha.toDateString();
  const overlaps = event1.horaInicio < event2.horaFin && event1.horaFin > event2.horaInicio;
  return sameDay && overlaps;
}

export const addEvent = async (ctx: PostAddEventContext): Promise<void> => {
  const body = await ctx.request.body().value;
  const { titulo, descripcion, fecha, horaInicio, horaFin, invitados } = body;

  // Check if all required data is provided
  if (!titulo || !fecha || !horaInicio || !horaFin || !invitados) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Missing required data" };
    return;
  }

  // Check if the end time is greater than the start time
  if (horaFin <= horaInicio) {
    ctx.response.status = 400;
    ctx.response.body = { error: "End time must be greater than start time" };
    return;
  }

  // Check if there is any overlapping event
  const existingEvents = await eventCollection.find({ fecha }).toArray();

  for (const event of existingEvents) {
    if (eventsOverlap(event, body)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "There is an overlapping event" };
      return;
    }
  }

  // Add the event to the database
  const event = {
    titulo,
    descripcion,
    fecha,
    horaInicio,
    horaFin,
    invitados,
  }
  const _id = await eventCollection.insertOne(event);
  ctx.response.status = 201;
  ctx.response.body = { _id, ...event };
  
};


/*

import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { eventosCollection } from "../db/mongo.ts";
import { Eventos } from "../types.ts";
import { EventosSchema } from "../db/schema.ts";


type PostEventosContext = RouterContext<
  "/addEvent",
  Record<string | number, string | undefined>,
  Record<string, any>
>;


export const postEvento = async (context: PostEventosContext) => {
    try{
        const result = context.request.body({type: "json"});
        const value = await result.value;

        if(!value?.titulo || !value?.fecha || !value?.horaInicio || !value?.horaFinal || !value?.invitados){
            context.response.status = 400;
            context.response.body = "Faltan campos";
            return;
        }

        if(value.horaInicio < 0 || value.horaInicio > 23 || value.horaFinal < 0 || value.horaFinal > 23){
            context.response.status = 400;
            context.response.body = "La horas horas deben estar entre las 0 y las 23";
            return;
        }

        if(value.horaInicio >= value.horaFinal){
            context.response.status = 400;
            context.response.body = "La hora de inicio no puede ser mayor o igual a la hora final";
            return;
        }

        const comprobarEvento = await eventosCollection.find({fecha: new Date(value.fecha)}).toArray();
        if(comprobarEvento.length > 0){
            for(let i = 0; i < comprobarEvento.length; i++){
                if(comprobarEvento[i].horaInicio <= value.horaInicio && comprobarEvento[i].horaFinal >= value.horaInicio){
                    context.response.status = 400;
                    context.response.body = "Ya hay un evento en esa hora";
                    return;
                }
            }
        }
            
        const newEvent: Partial<Eventos> = {
            titulo: value.titulo,
            descripcion: value.descripcion,
            fecha: new Date(value.fecha),
            horaInicio: value.horaInicio,
            horaFinal: value.horaFinal,
            invitados: value.invitados,
        }

        const id = await eventosCollection.insertOne(newEvent as EventosSchema);
        newEvent.id = id.toString()
        const {_id, ...eventosSinId} = newEvent as EventosSchema;
        context.response.status = 200;
        context.response.body = eventosSinId;

    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}

*/