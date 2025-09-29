import { InjectionToken } from "../types/tokens";

/**
 * Injects property or method parameter metadata
 * 
 * @public
 * @param {InjectionToken} token 
 * @returns {PropertyDecorator & ParameterDecorator}
 */
export const Inject = ( token: InjectionToken ): PropertyDecorator & ParameterDecorator =>
{
       /**
        * @param {Object} target
        * @param {String} key
        * @param {Number} index
        */
       return ( target: object, key: string, index?: number ): void =>
       {
              if ( !index && key )
              {
                     const type: any = target?.constructor;
                     console.log( "INJECT PROP ", type, key );
                     /** Method parameter */
                     Reflect.defineMetadata( "CLASS_PROPERTY_TOKENS", { key, token }, type );

                     return void 0;
              }

              console.log( "INJECT PARAM", target, index );
              Reflect.defineMetadata( "CLASS_PARAMETER_TOKENS", { index, token }, target );
       };
}