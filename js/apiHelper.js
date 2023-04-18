async function postRequest(endpoint, formData, authNeeded = false) {
    const jwtToken = authNeeded ? localStorage.getItem("jwtToken") : null;
    const headers = jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {};

    const request = new Request(`./api/${endpoint}`, {
        method: "POST",
        body: formData,
        headers: headers,
    });

    try {
        const response = await fetch(request);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unbekannter Fehler");
        }

        return data.payload || data.message;
    } catch (error) {
        console.log(error + " [Endpoint: " + endpoint + "]");
        throw error;
    }
}

async function getRequest(endpoint, params, authNeeded = false) {
    const jwtToken = authNeeded ? localStorage.getItem("jwtToken") : null;
    const headers = jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {};

    const queryString = new URLSearchParams(params).toString();

    try {
        const response = await fetch(`./api/${endpoint}?${queryString}`, { headers });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unbekannter Fehler");
        }

        return data.payload || data.message;
    } catch (error) {
        console.log(error + " [Endpoint: " + endpoint + "]");
        throw error;
    }
}
