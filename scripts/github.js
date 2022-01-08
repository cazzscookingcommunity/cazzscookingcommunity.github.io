var gitHubUrl = `https://api.github.com/users/${username}`;
  
const getUserData = async () => {
        const response = await fetch(gitHubUrl);
        const jsonData = await response.json();
        if (jsonData && jsonData.message !== "Not Found") {
            setUserData(jsonData);
            console.log(jsonData)
        }
        else if (username !== "") {
            console.log('Username does not exist');
        }
        else {
            setUserData({})
        }
    };