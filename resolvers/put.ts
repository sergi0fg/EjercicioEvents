import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { eventCollection } from "../mongoDB/db.ts";
import { ObjectId } from "https://deno.land/x/mongo/mod.ts";
import { Event } from "../types.ts";


type UpdateEventContext = RouterContext<
  "/updateEvent",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const updateEvent = async(context:UpdateEventContext) => {

  const result = context.request.body({type: "json"});
  const value:Event = await result.value;
  if(!value.id){
    context.response.body = "Id is required";
    context.response.status = 400;
    return;
  }
  if(value.horaInicio >= value.horaFin){
    context.response.body = "Hora de inicio debe ser menor a hora de fin";
    context.response.status = 400;
    return;
  }
  const evento = await eventCollection.findOne({_id:new ObjectId(value.id)});
  if(!evento){
    context.response.body = "Evento no encontrado";
    context.response.status = 404;
    return;
  }
  const comprobarEvento = await eventCollection.find({fecha: new Date(value.fecha)}).toArray();
  if(comprobarEvento.length > 0){
    for(let i = 0; i < comprobarEvento.length; i++){
      if(comprobarEvento[i].horaInicio <= value.horaInicio && comprobarEvento[i].horaFinal >= value.horaInicio){
          context.response.status = 400;
          context.response.body = "Ya hay un evento en esa hora";
          return;
      }
      if(comprobarEvento[i].horaInicio <= value.horaFin && comprobarEvento[i].horaFinal >= value.horaFin){
          context.response.status = 400;
          context.response.body = "Ya hay un evento en esa hora";
          return;
      }
    }
  const newEvent:Partial<Event> = {
    titulo: value.titulo,
    descripcion: value.descripcion,
    fecha: new Date (value.fecha),
    horaInicio: value.horaInicio,
    horaFin: value.horaFin,
    invitados: value.invitados
  }
  await eventCollection.updateOne({_id:new ObjectId(value.id)},{$set:{...newEvent}});
  const eventUpdated = await eventCollection.findOne({_id:new ObjectId(value.id)});
  context.response.body = eventUpdated;
  context.response.status = 200;
    
 
}

}

  /*  
  const id = context.params.id;
    const body = await context.request.body();
    const event = body.value;
    console.log(event);
    const result = await eventCollection.updateOne({_id:new ObjectId(id)},{$set:{...event}});
    context.response.body = result;

  */
