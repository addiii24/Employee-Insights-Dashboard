const credentials = [
    {
        username: "testuser",
        password: "123", // Set as string for easier comparison
    }
];

export const setlocalstorage = () => {
    localStorage.setItem("credentials", JSON.stringify(credentials));
}

export const getlocalstorage = () => {
    const data = localStorage.getItem("credentials");
    return data ? JSON.parse(data) : credentials; 
}