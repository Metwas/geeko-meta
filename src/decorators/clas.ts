import { SetMetadata } from "./SetMetadata";
import { Injectable } from "./Injectable";
import { Inject } from "./Inject";

@Injectable( "Injected_D" )
class D
{
       public name: string = "D";
}

@Injectable()
class B
{
       public hello()
       {
              return "Hello from B";
       }
}

@Injectable()
class C
{
       public constructor( public b: B ) { }

       public hello()
       {
              return "Hello from C";
       }
}

@Injectable()
export class Test
{
       public constructor( @Inject( "b_injectKey" ) public b: B, public c: C )
       {

       }

       @Inject( "Injected_D" )
       public tester: D;

       @SetMetadata( "prop", { method: "request" } )
       public request( parma: string ): void
       {
              console.log( this.b?.hello() );
              console.log( this.c?.hello() );
       }
}