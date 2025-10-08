import { Inject } from "./Inject";
import { SetMetadata } from "./SetMetadata";

class B
{

}

@SetMetadata( "test", 1234 )
export class Test
{
       public constructor( @Inject( "b_injectKey" ) public b: B )
       {

       }

       @Inject( "prop" )
       public tester: B;

       @SetMetadata( "prop", { method: "request" } )
       public request( parma: string ): void
       {

       }
}