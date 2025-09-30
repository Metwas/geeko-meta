import { Inject } from "./Inject";
import { SetMetadata } from "./SetMetadata";

class B
{

}

@SetMetadata( "test", 1234 )
export class Test
{
       public constructor( @Inject( "test" ) public b: B )
       {

       }

       @Inject( "pig" )
       public tester: B;

       @SetMetadata( "prop", { method: "request" } )
       public request( parma: string ): void
       {

       }
}