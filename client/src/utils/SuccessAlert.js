import Swal from 'sweetalert2'
const successAlert=(title)=>{
    const alert= Swal.fire({
        icon:"success",
        title: title,
        confirmButtonColor: "#16d967"
    });
    return alert
}

export default successAlert