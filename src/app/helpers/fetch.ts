import { URL_BASE } from '../config/settings';

const baseURL = URL_BASE;
// const baseURL = process.env.REACT_APP_API_URL;

const fetchSimple = (endpoint:string, data:any, method:string = 'GET') => {

    const url = `${ baseURL }/${endpoint}/`;

    console.log("url: ", url );
    console.log("method: ", method );
    console.log("data: ", data );

    if ( method === 'GET' ){
        return fetch( url );
    }

    return fetch( url, {
        method,
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data)
    })
}

const fetchToken = (endpoint:string, data:any, method:string = 'GET') => {
    const url = `${ baseURL }/${endpoint}`;
    const token = localStorage.getItem('token') || '';

    // console.log("url: ", url );
    // console.log("method: ", method );
    // console.log("input data: ", data );
    // console.log("token: ", token );

    if ( method === 'GET' ){
        console.log("Ejecutamos el fetch");
        
        return fetch( url, {
            method,
            headers: { 'x-token': token }
        });
    }

    return fetch( url, {
        method,
        headers: {
            'Content-type': 'application/json',
            'x-token': token 
        },
        body: JSON.stringify( data )
    });
}

export {
    fetchSimple,
    fetchToken
}