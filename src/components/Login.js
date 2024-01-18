// LoginForm.js
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';


const Login = ({setIsAuthenticated,setUserInfo}) => {
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }

        let resMsg;

        let user= {
            "email_id":email,
            "password":password
        }

        try {
            const response = await fetch('http://localhost:8080/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email_id:email, password }),
            });

            await response.text().then(data => {
                // Handle the response data here
                console.log(data);
                resMsg=data;
                 // "Your account has been created"
            })

            

            if (response.ok) {
                // Handle successful login

                const fetchUser = async () => {
                    try {
                      // Perform the API call to fetch slots
                      const response = await fetch('http://localhost:8080/api/user/findByEmail/'+email);
              
                      // Check if the response is successful (status code 200)
                      if (response.ok) {
                        // Parse the response data as JSON
                        const data = await response.json();
              
                        // Update the state with the fetched slots
                        setUserInfo(data);
                        //console.log(data);
                      } else {
                        // Handle errors if the response status is not OK
                        console.error('Failed to fetch slots. Status:', response.status);
                      }
                    } catch (error) {
                      // Handle any other errors that might occur during the fetch
                      console.error('Error fetching slots:', error.message);
                    }
                  };

                await fetchUser();

                setemail("");
                setPassword("");
                setIsAuthenticated(true);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: resMsg,
                    showConfirmButton: false,
                    timer: 1500
                  });
                console.log('Login successful!');
                navigate("/booktest");
            } else {
                // Handle login failure
                
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: resMsg,
                    showConfirmButton: false,
                    timer: 1500
                  });
                console.error('Invalid credentials');
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '80px' }}>
            <div style={{ width: '300px', alignItems: 'center' }}>
                <Card title="Login">
                    <form onSubmit={handleLogin}>
                        <div className="p-fluid">
                            <div className="p-field">
                                <label htmlFor="email">Email</label>
                                <InputText
                                    id="email"
                                    type="text"
                                    value={email}
                                    onChange={(e) => {
                                        setemail(e.target.value);
                                        setError("");
                                    }}
                                />
                            </div>
                            <br></br>
                            <div className="p-field">
                                <label htmlFor="password">Password</label>
                                <InputText
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        {error && <div style={{ color: 'red' }}>{error}</div>}
                        <br></br>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                style={{ marginRight: '10px' }}
                                type="submit"
                                label="Login"
                                icon="pi pi-user"
                            ></Button>
                            
                        </div>
                        <br></br>
                        <Link to="/">don't have an account? Create here</Link>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
