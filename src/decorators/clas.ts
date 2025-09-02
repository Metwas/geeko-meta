import { SetMetadata } from "./SetMetadata";

@SetMetadata( "test", 1234 )
export class Test
{
       public constructor( setss: typeof SetMetadata, value: string )
       {

       }

       @SetMetadata( "prop", { method: "request" } )
       public request( parma: string ): void
       {

       }
}