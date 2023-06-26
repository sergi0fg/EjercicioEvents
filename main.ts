import { RouterContext, Context } from 'https://deno.land/x/oak/mod.ts';
import { addEvent } from "./resolvers/post.ts";
import { Application, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { event, events } from "./resolvers/get.ts";
import { deleteEvent } from "./resolvers/delete.ts";
import { updateEvent } from "./resolvers/put.ts";


const router = new Router();

router.get("/test", () => {
    console.log("test");
}),
router.post("/addEvent", addEvent),
router.get("/events", events),
router.get("/event/:id", event),
router.put("/updateEvent", updateEvent),
router.delete("/event/:id",deleteEvent );





export default router;



const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());



await app.listen({ port: 7070 });