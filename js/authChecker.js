async function isLoggedIn() {
    const jwtToken = localStorage.getItem("jwtToken");

    if (jwtToken == undefined || jwtToken === null) {
        return false;
    } else {
        const headers = {
            Authorization: `Bearer ${jwtToken}`,
        };
        try {
            const response = await fetch("./api/account/validatetoken", { headers });
            if (response.ok) {
                return true;
            } else {
                localStorage.removeItem("jwtToken");
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}
