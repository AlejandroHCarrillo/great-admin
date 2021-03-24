export const fileUpload = async (file:any) => {
    // console.log("Archivo a subir: ", file);
    const cloudUrl = 'https://api.cloudinary.com/v1_1/alexthegreat/upload';
    const formData = new FormData();
    formData.append('upload_preset', 'react-journal');
    formData.append('file', file);

    try {
        const resp = await fetch(cloudUrl, {
                                method: 'POST', 
                                body: formData
                                });
        if( resp.ok ){
            // console.log('subio OK');
            const cloudResp = await resp.json();
            // console.log(cloudResp.secure_url);            
            return cloudResp.secure_url;
        } else {
            console.log('No subio', await resp.json());
            throw await resp.json();
            return null;       
        }
    } catch (error) {
        console.log(error);
        throw error;            
    }
}