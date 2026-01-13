const forgotPasswordTemplate=({name,otp})=>{
    return`
    <div>
      <p> Dear ${name}</p>
      <p> Your requested a password reset.please use following OTP code to
       reset your password.</p>
        <div style="background:yellow;fontsize:20px">
          ${otp}

        </div>
        <p>This otp is valid for 10minutes only.Enter the otp in the blinkeyit website
        to proceed with resetting your password.</P>
        <br/>
        </br>
        <p>Thanks</p>
        <p>Blinkeyit</p>
    </div>
    
    `
}

export default forgotPasswordTemplate