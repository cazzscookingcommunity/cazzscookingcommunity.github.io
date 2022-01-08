// var gitHubUrl = `https://api.github.com/users/${username}`;
  
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

var githubToken = ""

    function done() { 
        githubToken = document.getElementById("pass").value;
        // window.close('/admin/github.html');
        // window.history.back();
    
        //DO STUFF WITH githubToken HERE
        console.debug("clicked OK");
        commit("dummyfile");

   
    };
    
    function cancel() { 
        // window.history.back();
        window.close('/admin/github.html');
        console.debug("clicked cancel2");
    };

    // Commit updated recipe to GitHub
function commit(file) {
    console.debug(githubToken);
    console.debug(file);

    document.getElementById("popup").style.display = "none";
    document.getElementById("commit").style.display = "block";

}
    