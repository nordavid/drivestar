async function redirectIfNotAuthenticated() {
    const isAuthenticated = await isLoggedIn();
    if (!isAuthenticated) {
        window.location.href = "./login.html";
    }
}

redirectIfNotAuthenticated();
