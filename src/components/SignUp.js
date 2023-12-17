// SignUp.js
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !mobile.trim()) {
            setError('Please enter all required fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        let user= {
            "user_name":name,
            "mobile":mobile,
            "email_id":email,
            "password":password,
            "user_type":"user"
        }

        let resMsg;

        try {
            // Perform signup API call here

            // Example:
            const response = await fetch('http://localhost:8080/api/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            await response.text().then(data => {
                // Handle the response data here
                console.log(data);
                resMsg=data;
                 // "Your account has been created"
            })
            

            if (response.ok) {
                // Handle successful signup
                setName("");
                setEmail("");
                setMobile("");
                setPassword("");
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: resMsg,
                    showConfirmButton: false,
                    timer: 1500
                  });
                
            } else {
                // Handle signup failure
                // console.error(response.body);
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: resMsg,
                    showConfirmButton: false,
                    timer: 1500
                  });
                
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center',marginTop:"10px" }}>
            <div style={{ width: '400px', alignItems: 'center' }}>
                <Card title="Sign Up">
                    <form onSubmit={handleSignUp}>
                        <div className="p-fluid" style={{display:"grid",justifyContent:"center"}}>
                            <div className="p-field" style={{width:"300px"}}>
                                <label htmlFor="name">Name</label>
                                <InputText
                                    id="name"
                                    type="text"
                                    value={name}
                                    placeholder="Enter Your Name"
                                    onChange={(e) =>{ 
                                        setName(e.target.value);
                                        setError("");
                                    }}
                                />
                            </div>
                            
                            <div className="p-field" style={{width:"300px"}}>
                                <label htmlFor="email">Email</label>
                                <InputText
                                    id="email"
                                    type="text"
                                    value={email}
                                    placeholder="Enter Your Email"
                                    onChange={(e) =>{ 
                                        setEmail(e.target.value);
                                        setError("");
                                    }}
                                />
                            </div>
                            <div className="p-field" style={{width:"300px"}}>
                                <label htmlFor="mobile">Mobile</label>
                                <InputText
                                    id="mobile"
                                    type="text"
                                    value={mobile}
                                    placeholder="Enter Your Mobile"
                                    onChange={(e) =>{ 
                                        setMobile(e.target.value);
                                        setError("");
                                    }}
                                />
                            </div>
                            
                            <div className="p-field" style={{width:"300px"}}>
                                <label htmlFor="password">Password</label>
                                <InputText
                                    id="password"
                                    type="password"
                                    value={password}
                                    placeholder="Enter Your Password"
                                    onChange={(e) =>{ 
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                />
                            </div>
                            
                            <div className="p-field" style={{width:"300px"}}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <InputText
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    placeholder="Confirm Your Password"
                                    onChange={(e) =>{ 
                                        setConfirmPassword(e.target.value);
                                        setError("");
                                    }}
                                />
                            </div>
                            
                            
                        </div>
                        <div style={{display:"flex",justifyContent:"center"}}>
                        {error && <div style={{ color: 'red' }}>{error}</div>}
                        </div>
                        <br></br>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                style={{ marginRight: '10px' }}
                                type="submit"
                                label="Sign Up"
                                icon="pi pi-user-plus"
                                severity="success"
                            ></Button>
                            
                        </div>
                        <div style={{display:"flex",justifyContent:"center"}}>
                        <Link to="/login">Already have an account? Login here</Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default SignUp;
