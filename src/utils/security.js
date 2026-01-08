import CryptoJS from 'crypto-js';

// SECRET_KEY for client-side hashing (This is public to the app, but ensures 
// raw passwords aren't sent in cleartext JSON)
const CLIENT_SECRET = "6a48b6d8e895dbc8dde56195a4aeca4286f7c88a8bf6eb37b4e45e4177555bc1"; 

export const hashPasswordClientSide = (plainPassword) => {
    // We use SHA256 for the initial client-side hash
    return CryptoJS.SHA256(plainPassword + CLIENT_SECRET).toString();
};

export const validatePasswordStrength = (password) => {
    // [cite_start]// 8 chars, alphanumeric, special char, both cases [cite: 2]
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    return regex.test(password);
};