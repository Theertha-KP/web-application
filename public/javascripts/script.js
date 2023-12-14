$(document).ready( function () {
    $('#userTable').DataTable();
} );
document.getElementById('signup').addEventListener('submit', (e) => {
    e.preventDefault()
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const rePassword = document.getElementById("password_confirm" ).value
    if (password === rePassword) {
       
        fetch('/signup', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name, email: email, password: password
            }),
        }
        ).then(async (result) => {
            data = await result.json()
            console.log(data);
            if (data.success) {
                window.location.href = '/login'
            }else{
                window.location.href = '/signup'
            }

        })
    } else {
        document.getElementById('message').innerText = "password not match"
    }
})