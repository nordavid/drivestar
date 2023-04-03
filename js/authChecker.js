async function checkAuthentication() {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
        // JWT doesn't exist in localStorage, user is not logged in
        // redirect to login page or show login message
        return { test: "Test" };
    } else {
        const headers = {
            Authorization: `Bearer ${jwtToken}`,
        };
        return fetch("./api/account/validate", { headers })
            .then((response) => {
                if (response.ok) {
                    // Token is valid, user is logged in
                    return response.json();
                } else {
                    // Token is not valid, log the user out and redirect to the login page or homepage
                    localStorage.removeItem("jwtToken");
                    // redirect to login page or homepage
                }
            })
            .catch((error) => {
                // Handle the error
            });
    }
}
