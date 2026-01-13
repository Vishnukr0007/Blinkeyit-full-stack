const verifyEmailTemplate=({name,Url})=>{
    return`
    <p> Dear ${name}</P>
    <p> Thank you for registering Blikeyit.</P>
    <a href=${Url} style="color:blue;background:white;margin-top:10px;padding:20px">
        Verify Email
     </a>   
    
    
    `
}

export default verifyEmailTemplate