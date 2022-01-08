
const username = 'cazzscookingcommunity'
const owner = 'cooking@miplace.com'
const repo = 'cazzscookingcommunity.github.io'
const token = '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'
const ref = 'master'
var githuburl = `https://api.github.com/repos/${username}/${repo}/commits/${ref}/status`;
const headers = {
    authorization: `Token ${token}`
}
  

// const getUserData = async () => {
//         const response = await fetch(gitHubUrl);
//         const jsonData = await response.json();
//         if (jsonData && jsonData.message !== "Not Found") {
//             setUserData(jsonData);
//             console.log(jsonData)
//         }
//         else if (username !== "") {
//             console.log('Username does not exist');
//         }
//         else {
//             setUserData({})
//         }
//     };

function done() { 
    githubToken = document.getElementById("pass").value;
    // window.close('/pages/github.html');
    // window.history.back();

    //DO STUFF WITH githubToken HERE
    console.debug("clicked OK");
    commit("dummyfile");   
};
    
function cancel() { 
    // window.history.back();
    window.close('/pages/github.html');
    console.debug("clicked cancel2");
};

// Commit updated recipe to GitHub
async function commit(file) {
    console.debug(githubToken);
    console.debug(file);
    document.getElementById("popup").style.display = "none";
    document.getElementById("commit").style.display = "block";
    const response = await fetch(githuburl, {
        "method": "GET",
        "headers": headers
    })

    const data = await response.json();
    // const text = await response.text();

    console.debug(response);
    console.debug(data);
    // console.debug(text);
    // console.debug(atob(data.content));

}
    