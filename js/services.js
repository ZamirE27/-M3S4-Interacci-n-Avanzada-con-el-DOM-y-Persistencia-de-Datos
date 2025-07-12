// POST Function
// This function will be used to send data to the server
// It will be called when the user submits the form to create a new user

export async function post(urlDb, body) {
    try {
        const response = await fetch(urlDb, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en POST:", error.message || error);
        throw error;
    }
}


// DELETE Function
export async function deletes(url, id) {
    try {
        const response = await fetch(`${url}/${id}`, {
        method: "DELETE"
        });

        if (response.ok) {
        console.log("DELETE: Successfully deleted");
        return true;
        } else {
        console.error("delete failed");
        return false;
        }
    } catch (error) {
        console.error("Error en DELETE:", error);
        throw error;
    }
}

// PUT function
export async function put(url, id, data) {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json(); 
    } catch (error) {
        console.error("Error inside PUT function:", error);
        throw error;
    }
}