

const fetch = require('node-fetch');

const asyfetchApi = async () => {

    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0L2FwaS9hdXRoL2xvZ2luIiwiaWF0IjoxNjU2MzY2ODQyLCJleHAiOjE2NTYzNzA0NDIsIm5iZiI6MTY1NjM2Njg0MiwianRpIjoiOXFDQUMxcUlRWnd0bXZ3ZyIsInN1YiI6IjEiLCJjb3JyZW8iOiJhYnJhaGFtYmVycmVsbGV6YTEwQGdtYWlsLmNvbSJ9.Gt3AYt1AEz1n_DQWs_B1GEFEmRIsGnDpHOe2SoOUsXs';

    const json = { method: "POST", token };

    const res  = await fetch('http://localhost/api/auth/authenticateToken',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                token: token
            })
        });

        
        const data = await res.json();
        console.log(data);

}

asyfetchApi();