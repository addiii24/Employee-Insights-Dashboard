const credentials = [{
    username: "testuser",
    password: 123
}];

export const setlocalstorage = () => {
    JSON.parse(localStorage.setItem("credentials"));
}

export const getlocalstorage = () => {
    const credentials = JSON.parse(localStorage.getItem("credentials"));
    return {credentials};
}