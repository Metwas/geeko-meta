/**
 * @public
 */
export type CustomTrackDecorator<T> = {
       KEY: T;
};

/**
 * @public
 */
export type CustomDecorator<T = string> = MethodDecorator & ClassDecorator & CustomTrackDecorator<T>;

/**
 * Sets metadata on a given class OR function.
 * 
 * @public
 * @param {T} metadataKey 
 * @param {V} metadataValue
 * @returns {CustomDecorator<T>} 
 */
export const SetMetadata = <T = string, V = any>( metadataKey: T, metadataValue: V ): CustomDecorator<T> =>
{
       console.log( "PRE" );
       const factory = ( target: any, key?: any, descriptor?: any ): void =>
       {
              // this is to get constructor arguments, TODO: Include a discovery service to fetch this and other useful data 
              console.log( Reflect.getMetadata( 'design:paramtypes', target ) );

              if ( descriptor )
              {
                     Reflect.defineMetadata( metadataKey, metadataValue, descriptor.value );
                     return descriptor;
              }

              Reflect.defineMetadata( metadataKey, metadataValue, target );
       };

       factory.KEY = metadataKey;
       return factory;
};

/**
 * Helper for setting the metadata for a given method parameter
 * 
 * @public
 * @param {T} metadataKey
 * @param {V} parameter
 * @returns {ParameterDecorator & CustomTrackDecorator<T>}
 */
export const SetParameter = <T, V>( metadataKey: T, parameter: Partial<V> ): ParameterDecorator & CustomTrackDecorator<T> =>
{
       const factory = ( target: object, propertyKey: string | symbol, paramIndex: number ): void =>
       {
              const params = Reflect.getMetadata( metadataKey, target[ propertyKey ] ) ?? [];

              params.push( {
                     index: paramIndex,
                     ...parameter,
              } );

              Reflect.defineMetadata( metadataKey, params, target[ propertyKey ] );
       };

       factory.KEY = metadataKey;
       return factory;
};