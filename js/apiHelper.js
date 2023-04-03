async function postRequest(endpoint, formData, authNeeded = false) {
    let headers = {};

    if (authNeeded) {
        const jwtToken = localStorage.getItem("jwtToken");
        headers = {
            Authorization: `Bearer ${jwtToken}`,
        };
    }

    const request = new Request("./api/" + endpoint, {
        method: "POST",
        body: formData,
        headers: headers,
    });

    try {
        const response = await fetch(request);
        return response;
    } catch (error) {
        console.log(error);
    }
}

async function getRequest(endpoint, params, authNeeded = false) {
    let headers = {};

    if (authNeeded) {
        const jwtToken = localStorage.getItem("jwtToken");
        headers = {
            Authorization: `Bearer ${jwtToken}`,
        };
    }
    let queryString = "";
    for (const [key, value] of Object.entries(params)) {
        queryString += `${key}=${value}&`;
    }

    try {
        const response = await fetch(`./api/${endpoint}?${queryString}`, { headers });
        return response;
    } catch (error) {
        console.log(error);
    }
}
